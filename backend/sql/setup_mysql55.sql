CREATE DATABASE IF NOT EXISTS pg_management;
USE pg_management;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS query_log;
DROP TABLE IF EXISTS maintenance_requests;
DROP TABLE IF EXISTS notices;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS visitors;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS mess_menu;
DROP TABLE IF EXISTS complaints;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS allocations;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL,
    password VARCHAR(120) NOT NULL,
    role ENUM('admin', 'student') NOT NULL DEFAULT 'student',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE students (
    student_id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    user_id INT NULL,
    PRIMARY KEY (student_id),
    KEY idx_students_user_id (user_id),
    CONSTRAINT fk_students_user
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE rooms (
    room_id INT NOT NULL AUTO_INCREMENT,
    room_number VARCHAR(20) NOT NULL,
    capacity INT NOT NULL DEFAULT 1,
    type ENUM('Standard', 'Premium', 'Suite') NOT NULL DEFAULT 'Standard',
    rent DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    occupants INT NOT NULL DEFAULT 0,
    PRIMARY KEY (room_id),
    UNIQUE KEY uq_rooms_room_number (room_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE allocations (
    allocation_id INT NOT NULL AUTO_INCREMENT,
    student_id INT NOT NULL,
    room_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NULL,
    status ENUM('Active', 'Checked Out', 'Pending') NOT NULL DEFAULT 'Pending',
    PRIMARY KEY (allocation_id),
    KEY idx_allocations_student_id (student_id),
    KEY idx_allocations_room_id (room_id),
    CONSTRAINT fk_allocations_student
        FOREIGN KEY (student_id) REFERENCES students(student_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_allocations_room
        FOREIGN KEY (room_id) REFERENCES rooms(room_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE payments (
    payment_id INT NOT NULL AUTO_INCREMENT,
    student_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    status ENUM('Paid', 'Pending', 'Overdue') NOT NULL DEFAULT 'Pending',
    PRIMARY KEY (payment_id),
    KEY idx_payments_student_id (student_id),
    CONSTRAINT fk_payments_student
        FOREIGN KEY (student_id) REFERENCES students(student_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE complaints (
    complaint_id INT NOT NULL AUTO_INCREMENT,
    student_id INT NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Open', 'In Progress', 'Resolved') NOT NULL DEFAULT 'Open',
    created_at DATE NOT NULL,
    PRIMARY KEY (complaint_id),
    KEY idx_complaints_student_id (student_id),
    CONSTRAINT fk_complaints_student
        FOREIGN KEY (student_id) REFERENCES students(student_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE mess_menu (
    menu_id INT NOT NULL AUTO_INCREMENT,
    day VARCHAR(20) NOT NULL,
    breakfast VARCHAR(255) NOT NULL,
    lunch VARCHAR(255) NOT NULL,
    dinner VARCHAR(255) NOT NULL,
    PRIMARY KEY (menu_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE inventory (
    item_id INT NOT NULL AUTO_INCREMENT,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(60) NOT NULL,
    quantity INT NOT NULL DEFAULT 0,
    item_condition ENUM('Good', 'Fair', 'Poor') NOT NULL DEFAULT 'Good',
    PRIMARY KEY (item_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE visitors (
    visitor_id INT NOT NULL AUTO_INCREMENT,
    visitor_name VARCHAR(100) NOT NULL,
    student_id INT NOT NULL,
    visit_date DATE NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    check_in TIME NOT NULL,
    check_out TIME NULL,
    PRIMARY KEY (visitor_id),
    KEY idx_visitors_student_id (student_id),
    CONSTRAINT fk_visitors_student
        FOREIGN KEY (student_id) REFERENCES students(student_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE attendance (
    attendance_id INT NOT NULL AUTO_INCREMENT,
    student_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'Leave') NOT NULL DEFAULT 'Present',
    PRIMARY KEY (attendance_id),
    KEY idx_attendance_student_id (student_id),
    CONSTRAINT fk_attendance_student
        FOREIGN KEY (student_id) REFERENCES students(student_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE notices (
    notice_id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    priority ENUM('High', 'Medium', 'Low') NOT NULL DEFAULT 'Medium',
    PRIMARY KEY (notice_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE maintenance_requests (
    request_id INT NOT NULL AUTO_INCREMENT,
    room_id INT NOT NULL,
    description TEXT NOT NULL,
    status ENUM('Pending', 'In Progress', 'Resolved') NOT NULL DEFAULT 'Pending',
    request_date DATE NOT NULL,
    resolved_date DATE NULL,
    PRIMARY KEY (request_id),
    KEY idx_maintenance_room_id (room_id),
    CONSTRAINT fk_maintenance_room
        FOREIGN KEY (room_id) REFERENCES rooms(room_id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE query_log (
    log_id INT NOT NULL AUTO_INCREMENT,
    query_text TEXT NOT NULL,
    query_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    table_affected VARCHAR(60) NOT NULL,
    executed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (log_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO users (name, email, password, role, is_active) VALUES
('Admin User', 'admin@hostel.com', 'admin123', 'admin', 1),
('Joshua Admin', 'joshua@student.com', 'pass123', 'admin', 1),
('Rahul Sharma', 'rahul@student.com', 'pass123', 'student', 1),
('Priya Nair', 'priya@student.com', 'pass123', 'student', 1),
('Amit Patel', 'amit@student.com', 'pass123', 'student', 1),
('Sneha Reddy', 'sneha@student.com', 'pass123', 'student', 1),
('Karthik S', 'karthik@student.com', 'pass123', 'student', 1),
('Ananya Das', 'ananya@student.com', 'pass123', 'student', 1);

INSERT INTO students (name, contact, address, user_id) VALUES
('Rahul Sharma', '9876543210', 'Mumbai, MH', 3),
('Priya Nair', '9876543211', 'Kochi, KL', 4),
('Amit Patel', '9876543212', 'Ahmedabad, GJ', 5),
('Sneha Reddy', '9876543213', 'Hyderabad, TS', 6),
('Karthik S', '9876543214', 'Chennai, TN', 7),
('Ananya Das', '9876543215', 'Kolkata, WB', 8);

INSERT INTO rooms (room_number, capacity, type, rent, occupants) VALUES
('A-101', 2, 'Standard', 8000.00, 1),
('A-102', 2, 'Standard', 8000.00, 2),
('B-201', 1, 'Suite', 15000.00, 1),
('B-204', 2, 'Premium', 12000.00, 0),
('C-301', 3, 'Standard', 6500.00, 2);

INSERT INTO allocations (student_id, room_id, check_in_date, check_out_date, status) VALUES
(1, 1, '2026-01-15', NULL, 'Active'),
(2, 2, '2026-01-20', NULL, 'Active'),
(3, 2, '2026-01-22', NULL, 'Active'),
(4, 3, '2026-02-10', NULL, 'Active'),
(5, 5, '2026-03-05', NULL, 'Active'),
(6, 5, '2026-03-08', NULL, 'Active');

INSERT INTO payments (student_id, amount, payment_date, status) VALUES
(1, 8000.00, '2026-04-01', 'Paid'),
(2, 8000.00, '2026-04-01', 'Paid'),
(3, 8000.00, '2026-04-05', 'Pending'),
(4, 15000.00, '2026-04-02', 'Paid'),
(5, 6500.00, '2026-04-07', 'Overdue'),
(6, 6500.00, '2026-04-07', 'Pending');

INSERT INTO complaints (student_id, description, status, created_at) VALUES
(1, 'Water leakage in bathroom', 'Resolved', '2026-04-04'),
(3, 'WiFi not working in Block A', 'In Progress', '2026-04-08'),
(5, 'Room fan is noisy', 'Open', '2026-04-11');

INSERT INTO mess_menu (day, breakfast, lunch, dinner) VALUES
('Monday', 'Idli, Sambar', 'Rice, Dal, Sabzi', 'Chapati, Paneer Curry'),
('Tuesday', 'Poha, Tea', 'Rajma, Rice, Salad', 'Dosa, Chutney'),
('Wednesday', 'Paratha, Curd', 'Chole, Roti, Rice', 'Veg Pulao, Dal');

INSERT INTO inventory (item_name, category, quantity, item_condition) VALUES
('Bed', 'Furniture', 50, 'Good'),
('Mattress', 'Furniture', 48, 'Good'),
('Chair', 'Furniture', 42, 'Fair'),
('Water Purifier', 'Appliance', 5, 'Good');

INSERT INTO visitors (visitor_name, student_id, visit_date, purpose, check_in, check_out) VALUES
('Mr. Sharma', 1, '2026-04-10', 'Parent Visit', '10:00:00', '16:00:00'),
('Ravi Kumar', 3, '2026-04-11', 'Friend Visit', '15:30:00', '18:00:00');

INSERT INTO attendance (student_id, date, status) VALUES
(1, '2026-04-14', 'Present'),
(2, '2026-04-14', 'Present'),
(3, '2026-04-14', 'Absent'),
(4, '2026-04-14', 'Present'),
(5, '2026-04-14', 'Leave'),
(6, '2026-04-14', 'Present');

INSERT INTO notices (title, description, date, priority) VALUES
('Water Supply Maintenance', 'Water supply will be interrupted on April 15 from 10 AM to 2 PM.', '2026-04-12', 'High'),
('Mess Timing Change', 'Dinner timing changed to 7:30 PM to 9:30 PM starting next week.', '2026-04-10', 'Medium'),
('Cultural Fest', 'Annual cultural fest on April 20. All students are welcome.', '2026-04-08', 'Low');

INSERT INTO maintenance_requests (room_id, description, status, request_date, resolved_date) VALUES
(1, 'Leaking tap in bathroom', 'Pending', '2026-04-05', NULL),
(3, 'AC service required', 'Resolved', '2026-04-01', '2026-04-03'),
(5, 'Broken door handle', 'In Progress', '2026-04-09', NULL);
