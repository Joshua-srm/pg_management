# PG Management System

This project now runs as a local full-stack app:

- `frontend`: Vite + React
- `backend`: Flask API in `backend/app.py`
- `database`: MySQL 5.5-compatible schema and seed script in `backend/sql/setup_mysql55.sql`

## 1. Load the database in MySQL command line

Update the path if your project folder is different, then run:

```sql
mysql -u root -p < "C:\Users\Joshua\Downloads\table-heartbeat-777aa7ac-main\table-heartbeat-777aa7ac-main\backend\sql\setup_mysql55.sql"
```

This creates the `pg_management` database and inserts sample data.

Demo login after seeding:

- Email: `admin@hostel.com`
- Password: `admin123`

## 2. Run the backend

Open a terminal in the project root and run:

```powershell
cd backend
pip install -r requirements.txt
$env:MYSQL_HOST="localhost"
$env:MYSQL_USER="root"
$env:MYSQL_PASSWORD="YOUR_MYSQL_PASSWORD"
$env:MYSQL_DATABASE="pg_management"
$env:MYSQL_PORT="3306"
python app.py
```

The API will start on `http://localhost:5000`.

## 3. Run the frontend

In a second terminal:

```powershell
cd "C:\Users\Joshua\Downloads\table-heartbeat-777aa7ac-main\table-heartbeat-777aa7ac-main"
$env:VITE_API_BASE_URL="http://localhost:5000"
npm install
npm run dev
```

Open the local Vite URL, in this project usually `http://localhost:8080`.

## 4. Verify data is really stored in MySQL

After creating or editing records in the UI, check them in MySQL:

```sql
USE pg_management;
SELECT * FROM students;
SELECT * FROM rooms;
SELECT * FROM payments;
SELECT * FROM query_log;
```

The frontend no longer uses Supabase for CRUD. Inserts, updates, and deletes now go through Flask into MySQL.

## 5. Push to GitHub

Run these commands after creating an empty GitHub repository:

```powershell
git init
git add .
git commit -m "Switch project from Supabase to local MySQL + Flask"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## 6. Deploy later

Use this split when you deploy:

- Frontend: Vercel
- Backend: Render or another Python host
- Database: hosted MySQL

Important:

- Your local MySQL server on your PC cannot be used directly by Vercel or Render unless you expose it publicly.
- For deployment, keep the same backend code and just change the MySQL environment variables to a hosted MySQL instance.
- Set `VITE_API_BASE_URL` in Vercel to your deployed backend URL.
