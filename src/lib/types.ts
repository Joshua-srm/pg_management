export interface User {
  user_id: number;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "student";
  is_active?: number;
}

export interface Student {
  student_id: number;
  name: string;
  contact: string;
  address: string;
  user_id: number;
}

export interface Room {
  room_id: number;
  room_number: string;
  capacity: number;
  type: "Standard" | "Premium" | "Suite";
  rent: number;
  occupants: number;
}

export interface Allocation {
  allocation_id: number;
  student_id: number;
  room_id: number;
  check_in_date: string;
  check_out_date: string | null;
  status: "Active" | "Checked Out" | "Pending";
}

export interface Payment {
  payment_id: number;
  student_id: number;
  amount: number;
  payment_date: string;
  status: "Paid" | "Pending" | "Overdue";
}

export interface Complaint {
  complaint_id: number;
  student_id: number;
  description: string;
  status: "Open" | "In Progress" | "Resolved";
  created_at: string;
}

export interface MessMenu {
  menu_id: number;
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface Inventory {
  item_id: number;
  item_name: string;
  category: string;
  quantity: number;
  condition: "Good" | "Fair" | "Poor";
}

export interface Visitor {
  visitor_id: number;
  visitor_name: string;
  student_id: number;
  visit_date: string;
  purpose: string;
  check_in: string;
  check_out: string | null;
}

export interface Attendance {
  attendance_id: number;
  student_id: number;
  date: string;
  status: "Present" | "Absent" | "Leave";
}

export interface Notice {
  notice_id: number;
  title: string;
  description: string;
  date: string;
  priority: "High" | "Medium" | "Low";
}

export interface MaintenanceRequest {
  request_id: number;
  room_id: number;
  description: string;
  status: "Pending" | "In Progress" | "Resolved";
  request_date: string;
  resolved_date: string | null;
}
