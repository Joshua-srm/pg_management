import os
from contextlib import closing
from datetime import date, datetime, time, timedelta
from decimal import Decimal

import mysql.connector
from flask import Flask, jsonify, request
from flask_cors import CORS
from mysql.connector import Error


app = Flask(__name__)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:8080,http://localhost:5173,http://localhost:3000",
    ).split(",")
    if origin.strip()
]

CORS(app, resources={r"/api/*": {"origins": allowed_origins or "*"}})


DB_CONFIG = {
    "host": os.getenv("MYSQL_HOST", "localhost"),
    "user": os.getenv("MYSQL_USER", "root"),
    "password": os.getenv("MYSQL_PASSWORD", ""),
    "database": os.getenv("MYSQL_DATABASE", "pg_management"),
    "port": int(os.getenv("MYSQL_PORT", "3306")),
}


TABLE_CONFIG = {
    "users": {
        "id": "user_id",
        "cols": ["name", "email", "password", "role", "is_active"],
    },
    "students": {
        "id": "student_id",
        "cols": ["name", "contact", "address", "user_id"],
    },
    "rooms": {
        "id": "room_id",
        "cols": ["room_number", "capacity", "type", "rent", "occupants"],
    },
    "allocations": {
        "id": "allocation_id",
        "cols": ["student_id", "room_id", "check_in_date", "check_out_date", "status"],
    },
    "payments": {
        "id": "payment_id",
        "cols": ["student_id", "amount", "payment_date", "status"],
    },
    "complaints": {
        "id": "complaint_id",
        "cols": ["student_id", "description", "status", "created_at"],
    },
    "mess_menu": {
        "id": "menu_id",
        "cols": ["day", "breakfast", "lunch", "dinner"],
    },
    "inventory": {
        "id": "item_id",
        "cols": ["item_name", "category", "quantity", "item_condition"],
    },
    "visitors": {
        "id": "visitor_id",
        "cols": ["visitor_name", "student_id", "visit_date", "purpose", "check_in", "check_out"],
    },
    "attendance": {
        "id": "attendance_id",
        "cols": ["student_id", "date", "status"],
    },
    "notices": {
        "id": "notice_id",
        "cols": ["title", "description", "date", "priority"],
    },
    "maintenance_requests": {
        "id": "request_id",
        "cols": ["room_id", "description", "status", "request_date", "resolved_date"],
    },
}


COLUMN_MAP = {
    "inventory": {"item_condition": "condition"},
}

REVERSE_COLUMN_MAP = {
    "inventory": {"condition": "item_condition"},
}


def get_db():
    return mysql.connector.connect(**DB_CONFIG)


def serialize_value(value):
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, (datetime, date, time)):
        return value.isoformat()
    if isinstance(value, timedelta):
        total_seconds = int(value.total_seconds())
        hours = total_seconds // 3600
        minutes = (total_seconds % 3600) // 60
        seconds = total_seconds % 60
        return f"{hours:02d}:{minutes:02d}:{seconds:02d}"
    return value


def serialize_row(row):
    return {key: serialize_value(value) for key, value in row.items()}


def sql_literal(value):
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "1" if value else "0"
    if isinstance(value, (int, float, Decimal)):
        return str(value)
    text = str(value).replace("\\", "\\\\").replace("'", "''")
    return f"'{text}'"


def fetch_all(sql, params=None):
    with closing(get_db()) as conn:
        with closing(conn.cursor(dictionary=True)) as cursor:
            cursor.execute(sql, params or ())
            return [serialize_row(row) for row in cursor.fetchall()]


def fetch_one(sql, params=None):
    rows = fetch_all(sql, params)
    return rows[0] if rows else None


def execute_write(sql, params=None):
    with closing(get_db()) as conn:
        with closing(conn.cursor()) as cursor:
            cursor.execute(sql, params or ())
            conn.commit()
            return cursor.lastrowid


def log_query(query_text, query_type, table_affected):
    sql = """
        INSERT INTO query_log (query_text, query_type, table_affected)
        VALUES (%s, %s, %s)
    """
    execute_write(sql, (query_text, query_type, table_affected))


def map_row_to_frontend(table, row):
    mapped = dict(row)
    for source, target in COLUMN_MAP.get(table, {}).items():
        if source in mapped:
            mapped[target] = mapped.pop(source)
    return mapped


def map_frontend_to_db(table, payload):
    mapped = dict(payload)
    for source, target in REVERSE_COLUMN_MAP.get(table, {}).items():
        if source in mapped:
            mapped[target] = mapped.pop(source)
    return mapped


def sync_room_occupancy(room_ids):
    room_ids = [room_id for room_id in room_ids if room_id]
    if not room_ids:
        return

    unique_room_ids = sorted(set(room_ids))
    placeholders = ", ".join(["%s"] * len(unique_room_ids))
    counts_sql = f"""
        SELECT room_id, COUNT(*) AS occupant_count
        FROM allocations
        WHERE status = 'Active' AND room_id IN ({placeholders})
        GROUP BY room_id
    """
    counts = {
        row["room_id"]: row["occupant_count"]
        for row in fetch_all(counts_sql, unique_room_ids)
    }

    with closing(get_db()) as conn:
        with closing(conn.cursor()) as cursor:
            for room_id in unique_room_ids:
                cursor.execute(
                    "UPDATE rooms SET occupants = %s WHERE room_id = %s",
                    (counts.get(room_id, 0), room_id),
                )
            conn.commit()


def build_insert_query(table, data):
    columns = [column for column in TABLE_CONFIG[table]["cols"] if column in data]
    placeholders = ", ".join(["%s"] * len(columns))
    values = [data[column] for column in columns]
    sql = f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({placeholders})"
    display_sql = (
        f"INSERT INTO {table} ({', '.join(columns)}) VALUES "
        f"({', '.join(sql_literal(value) for value in values)});"
    )
    return sql, values, display_sql


def build_update_query(table, record_id, data):
    id_column = TABLE_CONFIG[table]["id"]
    columns = [column for column in TABLE_CONFIG[table]["cols"] if column in data]
    assignments = ", ".join(f"{column} = %s" for column in columns)
    values = [data[column] for column in columns] + [record_id]
    sql = f"UPDATE {table} SET {assignments} WHERE {id_column} = %s"
    display_sql = (
        f"UPDATE {table} SET "
        f"{', '.join(f'{column} = {sql_literal(data[column])}' for column in columns)} "
        f"WHERE {id_column} = {record_id};"
    )
    return sql, values, display_sql


def build_delete_query(table, record_id):
    id_column = TABLE_CONFIG[table]["id"]
    sql = f"DELETE FROM {table} WHERE {id_column} = %s"
    display_sql = f"DELETE FROM {table} WHERE {id_column} = {record_id};"
    return sql, display_sql


def get_table_rows(table):
    id_column = TABLE_CONFIG[table]["id"]
    rows = fetch_all(f"SELECT * FROM {table} ORDER BY {id_column} DESC")
    return [map_row_to_frontend(table, row) for row in rows]


def register_crud(table):
    id_column = TABLE_CONFIG[table]["id"]

    def get_all():
        return jsonify({"data": get_table_rows(table)})

    def create():
        payload = map_frontend_to_db(table, request.get_json(force=True))
        sql, values, display_sql = build_insert_query(table, payload)
        created_id = execute_write(sql, values)
        log_query(display_sql, "INSERT", table)

        if table == "allocations":
            sync_room_occupancy([payload.get("room_id")])

        return jsonify({"data": {"id": created_id}, "sql": display_sql}), 201

    def update(record_id):
        payload = map_frontend_to_db(table, request.get_json(force=True))
        previous_room_id = None

        if table == "allocations":
            existing = fetch_one(
                f"SELECT room_id FROM allocations WHERE {id_column} = %s",
                (record_id,),
            )
            previous_room_id = existing["room_id"] if existing else None

        sql, values, display_sql = build_update_query(table, record_id, payload)
        execute_write(sql, values)
        log_query(display_sql, "UPDATE", table)

        if table == "allocations":
            sync_room_occupancy([previous_room_id, payload.get("room_id")])

        return jsonify({"data": {"updated": True}, "sql": display_sql})

    def delete(record_id):
        previous_room_id = None

        if table == "allocations":
            existing = fetch_one(
                f"SELECT room_id FROM allocations WHERE {id_column} = %s",
                (record_id,),
            )
            previous_room_id = existing["room_id"] if existing else None

        sql, display_sql = build_delete_query(table, record_id)
        execute_write(sql, (record_id,))
        log_query(display_sql, "DELETE", table)

        if table == "allocations":
            sync_room_occupancy([previous_room_id])

        return jsonify({"data": {"deleted": True}, "sql": display_sql})

    app.add_url_rule(f"/api/{table}", f"{table}_get_all", get_all, methods=["GET"])
    app.add_url_rule(f"/api/{table}", f"{table}_create", create, methods=["POST"])
    app.add_url_rule(
        f"/api/{table}/<int:record_id>",
        f"{table}_update",
        update,
        methods=["PUT"],
    )
    app.add_url_rule(
        f"/api/{table}/<int:record_id>",
        f"{table}_delete",
        delete,
        methods=["DELETE"],
    )


for table_name in TABLE_CONFIG:
    register_crud(table_name)


@app.route("/api/health", methods=["GET"])
def health():
    try:
        with closing(get_db()) as conn:
            with closing(conn.cursor()) as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
        return jsonify({"status": "ok", "database": DB_CONFIG["database"]})
    except Error as exc:
        return jsonify({"status": "error", "message": str(exc)}), 500


@app.route("/api/auth/login", methods=["POST"])
def login():
    payload = request.get_json(force=True)
    email = payload.get("email", "").strip()
    password = payload.get("password", "")

    user = fetch_one(
        """
        SELECT user_id, name, email, role, is_active
        FROM users
        WHERE email = %s AND password = %s
        LIMIT 1
        """,
        (email, password),
    )

    if not user or not user.get("is_active", 1):
        return jsonify({"message": "Invalid email or password"}), 401

    return jsonify({"data": user})


@app.route("/api/auth/register", methods=["POST"])
def register():
    payload = request.get_json(force=True)
    email = payload.get("email", "").strip()
    password = payload.get("password", "")
    name = payload.get("name", "").strip() or email.split("@")[0].replace(".", " ").title()

    existing_user = fetch_one(
        "SELECT user_id FROM users WHERE email = %s LIMIT 1",
        (email,),
    )
    if existing_user:
        return jsonify({"message": "An account with this email already exists"}), 409

    sql = """
        INSERT INTO users (name, email, password, role, is_active)
        VALUES (%s, %s, %s, %s, %s)
    """
    execute_write(sql, (name, email, password, "admin", 1))

    user = fetch_one(
        """
        SELECT user_id, name, email, role, is_active
        FROM users
        WHERE email = %s
        LIMIT 1
        """,
        (email,),
    )

    return jsonify({"data": user}), 201


@app.route("/api/query-log", methods=["GET"])
def query_log():
    rows = fetch_all(
        """
        SELECT
            log_id AS id,
            query_text AS query,
            query_type AS type,
            executed_at AS timestamp
        FROM query_log
        ORDER BY log_id DESC
        LIMIT 100
        """
    )
    return jsonify({"data": rows})


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    print("=" * 60)
    print("PG Management API")
    print("=" * 60)
    print(
        f"MySQL: {DB_CONFIG['database']} @ "
        f"{DB_CONFIG['host']}:{DB_CONFIG['port']} as {DB_CONFIG['user']}"
    )
    print(f"API port: {port}")
    print("=" * 60)
    app.run(host="0.0.0.0", port=port, debug=True)
