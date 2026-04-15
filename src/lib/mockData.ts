import { User, Student, Room, Allocation, Payment, Complaint, MessMenu, Inventory, Visitor, Attendance, Notice, MaintenanceRequest } from "./types";

export const initialUsers: User[] = [
  { user_id: 1, name: "Admin User", email: "admin@hostel.com", password: "hashed", role: "admin" },
  { user_id: 2, name: "Rahul Sharma", email: "rahul@student.com", password: "hashed", role: "student" },
  { user_id: 3, name: "Priya Nair", email: "priya@student.com", password: "hashed", role: "student" },
  { user_id: 4, name: "Amit Patel", email: "amit@student.com", password: "hashed", role: "student" },
  { user_id: 5, name: "Sneha Reddy", email: "sneha@student.com", password: "hashed", role: "student" },
  { user_id: 6, name: "Karthik S", email: "karthik@student.com", password: "hashed", role: "student" },
  { user_id: 7, name: "Ananya Das", email: "ananya@student.com", password: "hashed", role: "student" },
  { user_id: 8, name: "Joshua Joemon", email: "joshua@student.com", password: "hashed", role: "student" },
];

export const initialStudents: Student[] = [
  { student_id: 1, name: "Rahul Sharma", contact: "9876543210", address: "Mumbai, MH", user_id: 2 },
  { student_id: 2, name: "Priya Nair", contact: "9876543211", address: "Kochi, KL", user_id: 3 },
  { student_id: 3, name: "Amit Patel", contact: "9876543212", address: "Ahmedabad, GJ", user_id: 4 },
  { student_id: 4, name: "Sneha Reddy", contact: "9876543213", address: "Hyderabad, TS", user_id: 5 },
  { student_id: 5, name: "Karthik S", contact: "9876543214", address: "Chennai, TN", user_id: 6 },
  { student_id: 6, name: "Ananya Das", contact: "9876543215", address: "Kolkata, WB", user_id: 7 },
  { student_id: 7, name: "Joshua Joemon", contact: "9876543216", address: "Chennai, TN", user_id: 8 },
];

export const initialRooms: Room[] = [
  { room_id: 1, room_number: "A-101", capacity: 2, type: "Standard", rent: 8000, occupants: 1 },
  { room_id: 2, room_number: "A-102", capacity: 2, type: "Standard", rent: 8000, occupants: 2 },
  { room_id: 3, room_number: "A-110", capacity: 3, type: "Standard", rent: 6500, occupants: 1 },
  { room_id: 4, room_number: "B-102", capacity: 2, type: "Premium", rent: 12000, occupants: 1 },
  { room_id: 5, room_number: "B-204", capacity: 2, type: "Premium", rent: 12000, occupants: 0 },
  { room_id: 6, room_number: "C-301", capacity: 2, type: "Standard", rent: 8000, occupants: 1 },
  { room_id: 7, room_number: "C-405", capacity: 1, type: "Suite", rent: 15000, occupants: 1 },
  { room_id: 8, room_number: "D-112", capacity: 2, type: "Premium", rent: 12000, occupants: 0 },
  { room_id: 9, room_number: "D-215", capacity: 2, type: "Standard", rent: 8000, occupants: 1 },
  { room_id: 10, room_number: "E-101", capacity: 3, type: "Standard", rent: 6500, occupants: 0 },
  { room_id: 11, room_number: "E-202", capacity: 1, type: "Suite", rent: 15000, occupants: 0 },
  { room_id: 12, room_number: "F-301", capacity: 2, type: "Premium", rent: 12000, occupants: 0 },
];

export const initialAllocations: Allocation[] = [
  { allocation_id: 1, student_id: 1, room_id: 1, check_in_date: "2026-01-15", check_out_date: null, status: "Active" },
  { allocation_id: 2, student_id: 2, room_id: 2, check_in_date: "2026-01-20", check_out_date: null, status: "Active" },
  { allocation_id: 3, student_id: 3, room_id: 2, check_in_date: "2026-01-20", check_out_date: null, status: "Active" },
  { allocation_id: 4, student_id: 4, room_id: 3, check_in_date: "2026-02-01", check_out_date: null, status: "Active" },
  { allocation_id: 5, student_id: 5, room_id: 4, check_in_date: "2026-02-10", check_out_date: null, status: "Active" },
  { allocation_id: 6, student_id: 6, room_id: 6, check_in_date: "2026-03-01", check_out_date: null, status: "Active" },
  { allocation_id: 7, student_id: 7, room_id: 7, check_in_date: "2026-03-05", check_out_date: null, status: "Active" },
];

export const initialPayments: Payment[] = [
  { payment_id: 1, student_id: 1, amount: 8000, payment_date: "2026-03-01", status: "Paid" },
  { payment_id: 2, student_id: 2, amount: 8000, payment_date: "2026-03-01", status: "Paid" },
  { payment_id: 3, student_id: 3, amount: 8000, payment_date: "2026-03-05", status: "Paid" },
  { payment_id: 4, student_id: 4, amount: 6500, payment_date: "2026-04-01", status: "Pending" },
  { payment_id: 5, student_id: 5, amount: 12000, payment_date: "2026-03-15", status: "Paid" },
  { payment_id: 6, student_id: 6, amount: 8000, payment_date: "2026-03-01", status: "Overdue" },
  { payment_id: 7, student_id: 7, amount: 15000, payment_date: "2026-04-01", status: "Pending" },
  { payment_id: 8, student_id: 1, amount: 8000, payment_date: "2026-04-01", status: "Pending" },
];

export const initialComplaints: Complaint[] = [
  { complaint_id: 1, student_id: 1, description: "Water leakage in bathroom", status: "Resolved", created_at: "2026-02-15" },
  { complaint_id: 2, student_id: 3, description: "WiFi not working in Block A", status: "In Progress", created_at: "2026-03-10" },
  { complaint_id: 3, student_id: 5, description: "AC not cooling properly", status: "Open", created_at: "2026-03-20" },
  { complaint_id: 4, student_id: 6, description: "Broken window latch", status: "Open", created_at: "2026-03-25" },
  { complaint_id: 5, student_id: 7, description: "Noisy plumbing at night", status: "In Progress", created_at: "2026-04-01" },
];

export const initialMessMenu: MessMenu[] = [
  { menu_id: 1, day: "Monday", breakfast: "Idli, Sambar, Chutney", lunch: "Rice, Dal, Sabzi, Roti", dinner: "Chapati, Paneer Butter Masala, Rice" },
  { menu_id: 2, day: "Tuesday", breakfast: "Poha, Chai", lunch: "Rice, Rajma, Salad, Roti", dinner: "Dosa, Coconut Chutney, Sambar" },
  { menu_id: 3, day: "Wednesday", breakfast: "Paratha, Curd, Pickle", lunch: "Rice, Chole, Roti, Raita", dinner: "Rice, Fish Curry, Dal" },
  { menu_id: 4, day: "Thursday", breakfast: "Upma, Vada", lunch: "Biryani, Raita, Salad", dinner: "Chapati, Mixed Veg, Dal Rice" },
  { menu_id: 5, day: "Friday", breakfast: "Bread, Butter, Omelette", lunch: "Rice, Sambar, Poriyal, Roti", dinner: "Fried Rice, Manchurian" },
  { menu_id: 6, day: "Saturday", breakfast: "Puri, Aloo Sabzi", lunch: "Rice, Dal Tadka, Aloo Gobi", dinner: "Chapati, Chicken Curry, Rice" },
  { menu_id: 7, day: "Sunday", breakfast: "Chole Bhature", lunch: "Special Thali", dinner: "Pulao, Paneer Tikka, Naan" },
];

export const initialInventory: Inventory[] = [
  { item_id: 1, item_name: "Bed", category: "Furniture", quantity: 50, condition: "Good" },
  { item_id: 2, item_name: "Mattress", category: "Furniture", quantity: 50, condition: "Good" },
  { item_id: 3, item_name: "Study Table", category: "Furniture", quantity: 40, condition: "Good" },
  { item_id: 4, item_name: "Chair", category: "Furniture", quantity: 45, condition: "Fair" },
  { item_id: 5, item_name: "Fan", category: "Electrical", quantity: 60, condition: "Good" },
  { item_id: 6, item_name: "Tube Light", category: "Electrical", quantity: 80, condition: "Good" },
  { item_id: 7, item_name: "Water Purifier", category: "Appliance", quantity: 5, condition: "Good" },
  { item_id: 8, item_name: "Washing Machine", category: "Appliance", quantity: 3, condition: "Fair" },
];

export const initialVisitors: Visitor[] = [
  { visitor_id: 1, visitor_name: "Mr. Sharma", student_id: 1, visit_date: "2026-03-10", purpose: "Parent Visit", check_in: "10:00", check_out: "16:00" },
  { visitor_id: 2, visitor_name: "Mrs. Nair", student_id: 2, visit_date: "2026-03-12", purpose: "Parent Visit", check_in: "11:00", check_out: "14:00" },
  { visitor_id: 3, visitor_name: "Ravi Kumar", student_id: 5, visit_date: "2026-03-15", purpose: "Friend Visit", check_in: "15:00", check_out: "18:00" },
];

export const initialAttendance: Attendance[] = [
  { attendance_id: 1, student_id: 1, date: "2026-04-10", status: "Present" },
  { attendance_id: 2, student_id: 2, date: "2026-04-10", status: "Present" },
  { attendance_id: 3, student_id: 3, date: "2026-04-10", status: "Absent" },
  { attendance_id: 4, student_id: 4, date: "2026-04-10", status: "Present" },
  { attendance_id: 5, student_id: 5, date: "2026-04-10", status: "Leave" },
  { attendance_id: 6, student_id: 6, date: "2026-04-10", status: "Present" },
  { attendance_id: 7, student_id: 7, date: "2026-04-10", status: "Present" },
];

export const initialNotices: Notice[] = [
  { notice_id: 1, title: "Water Supply Maintenance", description: "Water supply will be interrupted on April 15th from 10 AM to 2 PM for tank cleaning.", date: "2026-04-12", priority: "High" },
  { notice_id: 2, title: "Mess Timing Change", description: "Dinner timing changed to 7:30 PM - 9:30 PM starting next week.", date: "2026-04-10", priority: "Medium" },
  { notice_id: 3, title: "Cultural Fest", description: "Annual cultural fest on April 20th. All students are welcome to participate.", date: "2026-04-08", priority: "Low" },
];

export const initialMaintenanceRequests: MaintenanceRequest[] = [
  { request_id: 1, room_id: 1, description: "Leaking tap in bathroom", status: "Pending", request_date: "2026-04-05", resolved_date: null },
  { request_id: 2, room_id: 3, description: "Broken door handle", status: "In Progress", request_date: "2026-04-02", resolved_date: null },
  { request_id: 3, room_id: 7, description: "AC service required", status: "Resolved", request_date: "2026-03-28", resolved_date: "2026-04-01" },
];
