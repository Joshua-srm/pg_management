import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";
import { apiRequest } from "./api";
import {
  User, Student, Room, Allocation, Payment, Complaint,
  MessMenu, Inventory, Visitor, Attendance, Notice, MaintenanceRequest,
} from "./types";

export interface QueryLog {
  id: number;
  query: string;
  timestamp: string;
  type: "SELECT" | "INSERT" | "UPDATE" | "DELETE";
}

interface DataContextType {
  users: User[];
  students: Student[];
  rooms: Room[];
  allocations: Allocation[];
  payments: Payment[];
  complaints: Complaint[];
  messMenu: MessMenu[];
  inventory: Inventory[];
  visitors: Visitor[];
  attendance: Attendance[];
  notices: Notice[];
  maintenanceRequests: MaintenanceRequest[];
  queryLogs: QueryLog[];
  addStudent: (s: Omit<Student, "student_id">) => Promise<void>;
  updateStudent: (id: number, s: Partial<Student>) => Promise<void>;
  deleteStudent: (id: number) => Promise<void>;
  addRoom: (r: Omit<Room, "room_id">) => Promise<void>;
  updateRoom: (id: number, r: Partial<Room>) => Promise<void>;
  deleteRoom: (id: number) => Promise<void>;
  addPayment: (p: Omit<Payment, "payment_id">) => Promise<void>;
  updatePayment: (id: number, p: Partial<Payment>) => Promise<void>;
  deletePayment: (id: number) => Promise<void>;
  addComplaint: (c: Omit<Complaint, "complaint_id">) => Promise<void>;
  updateComplaint: (id: number, c: Partial<Complaint>) => Promise<void>;
  deleteComplaint: (id: number) => Promise<void>;
  addAllocation: (a: Omit<Allocation, "allocation_id">) => Promise<void>;
  updateAllocation: (id: number, a: Partial<Allocation>) => Promise<void>;
  deleteAllocation: (id: number) => Promise<void>;
  addMessMenu: (m: Omit<MessMenu, "menu_id">) => Promise<void>;
  updateMessMenu: (id: number, m: Partial<MessMenu>) => Promise<void>;
  deleteMessMenu: (id: number) => Promise<void>;
  addInventory: (i: Omit<Inventory, "item_id">) => Promise<void>;
  updateInventory: (id: number, i: Partial<Inventory>) => Promise<void>;
  deleteInventory: (id: number) => Promise<void>;
  addVisitor: (v: Omit<Visitor, "visitor_id">) => Promise<void>;
  updateVisitor: (id: number, v: Partial<Visitor>) => Promise<void>;
  deleteVisitor: (id: number) => Promise<void>;
  addAttendance: (a: Omit<Attendance, "attendance_id">) => Promise<void>;
  updateAttendance: (id: number, a: Partial<Attendance>) => Promise<void>;
  deleteAttendance: (id: number) => Promise<void>;
  addNotice: (n: Omit<Notice, "notice_id">) => Promise<void>;
  updateNotice: (id: number, n: Partial<Notice>) => Promise<void>;
  deleteNotice: (id: number) => Promise<void>;
  addMaintenanceRequest: (m: Omit<MaintenanceRequest, "request_id">) => Promise<void>;
  updateMaintenanceRequest: (id: number, m: Partial<MaintenanceRequest>) => Promise<void>;
  deleteMaintenanceRequest: (id: number) => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};

async function fetchTable<T>(table: string): Promise<T[]> {
  const response = await apiRequest<{ data: T[] }>(`/api/${table}`);
  return response.data;
}

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [users] = useState<User[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [messMenu, setMessMenu] = useState<MessMenu[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [queryLogs, setQueryLogs] = useState<QueryLog[]>([]);

  const loadStudents = async () => setStudents(await fetchTable<Student>("students"));
  const loadRooms = async () => setRooms(await fetchTable<Room>("rooms"));
  const loadAllocations = async () => setAllocations(await fetchTable<Allocation>("allocations"));
  const loadPayments = async () => setPayments(await fetchTable<Payment>("payments"));
  const loadComplaints = async () => setComplaints(await fetchTable<Complaint>("complaints"));
  const loadMessMenu = async () => setMessMenu(await fetchTable<MessMenu>("mess_menu"));
  const loadInventory = async () => setInventory(await fetchTable<Inventory>("inventory"));
  const loadVisitors = async () => setVisitors(await fetchTable<Visitor>("visitors"));
  const loadAttendance = async () => setAttendance(await fetchTable<Attendance>("attendance"));
  const loadNotices = async () => setNotices(await fetchTable<Notice>("notices"));
  const loadMaintenanceRequests = async () =>
    setMaintenanceRequests(await fetchTable<MaintenanceRequest>("maintenance_requests"));
  const loadQueryLogs = async () => {
    const response = await apiRequest<{ data: QueryLog[] }>("/api/query-log");
    setQueryLogs(response.data);
  };

  const refreshAll = async () => {
    await Promise.all([
      loadStudents(),
      loadRooms(),
      loadAllocations(),
      loadPayments(),
      loadComplaints(),
      loadMessMenu(),
      loadInventory(),
      loadVisitors(),
      loadAttendance(),
      loadNotices(),
      loadMaintenanceRequests(),
      loadQueryLogs(),
    ]);
  };

  useEffect(() => {
    void (async () => {
      try {
        await refreshAll();
      } catch (error) {
        const description = error instanceof Error ? error.message : "Unable to load data";
        toast.error(description);
      }
    })();
  }, []);

  const runMutation = async (
    path: string,
    method: "POST" | "PUT" | "DELETE",
    body: unknown,
    reloaders: Array<() => Promise<void>>,
  ) => {
    await apiRequest(path, {
      method,
      body,
    });

    await Promise.all([loadQueryLogs(), ...reloaders.map((reload) => reload())]);
  };

  return (
    <DataContext.Provider
      value={{
        users, students, rooms, allocations, payments, complaints,
        messMenu, inventory, visitors, attendance, notices, maintenanceRequests, queryLogs,
        addStudent: (student) => runMutation("/api/students", "POST", student, [loadStudents]),
        updateStudent: (id, student) => runMutation(`/api/students/${id}`, "PUT", student, [loadStudents]),
        deleteStudent: (id) => runMutation(`/api/students/${id}`, "DELETE", undefined, [loadStudents]),
        addRoom: (room) => runMutation("/api/rooms", "POST", room, [loadRooms]),
        updateRoom: (id, room) => runMutation(`/api/rooms/${id}`, "PUT", room, [loadRooms]),
        deleteRoom: (id) => runMutation(`/api/rooms/${id}`, "DELETE", undefined, [loadRooms]),
        addPayment: (payment) => runMutation("/api/payments", "POST", payment, [loadPayments]),
        updatePayment: (id, payment) => runMutation(`/api/payments/${id}`, "PUT", payment, [loadPayments]),
        deletePayment: (id) => runMutation(`/api/payments/${id}`, "DELETE", undefined, [loadPayments]),
        addComplaint: (complaint) => runMutation("/api/complaints", "POST", complaint, [loadComplaints]),
        updateComplaint: (id, complaint) => runMutation(`/api/complaints/${id}`, "PUT", complaint, [loadComplaints]),
        deleteComplaint: (id) => runMutation(`/api/complaints/${id}`, "DELETE", undefined, [loadComplaints]),
        addAllocation: (allocation) => runMutation("/api/allocations", "POST", allocation, [loadAllocations, loadRooms]),
        updateAllocation: (id, allocation) =>
          runMutation(`/api/allocations/${id}`, "PUT", allocation, [loadAllocations, loadRooms]),
        deleteAllocation: (id) => runMutation(`/api/allocations/${id}`, "DELETE", undefined, [loadAllocations, loadRooms]),
        addMessMenu: (menu) => runMutation("/api/mess_menu", "POST", menu, [loadMessMenu]),
        updateMessMenu: (id, menu) => runMutation(`/api/mess_menu/${id}`, "PUT", menu, [loadMessMenu]),
        deleteMessMenu: (id) => runMutation(`/api/mess_menu/${id}`, "DELETE", undefined, [loadMessMenu]),
        addInventory: (item) => runMutation("/api/inventory", "POST", item, [loadInventory]),
        updateInventory: (id, item) => runMutation(`/api/inventory/${id}`, "PUT", item, [loadInventory]),
        deleteInventory: (id) => runMutation(`/api/inventory/${id}`, "DELETE", undefined, [loadInventory]),
        addVisitor: (visitor) => runMutation("/api/visitors", "POST", visitor, [loadVisitors]),
        updateVisitor: (id, visitor) => runMutation(`/api/visitors/${id}`, "PUT", visitor, [loadVisitors]),
        deleteVisitor: (id) => runMutation(`/api/visitors/${id}`, "DELETE", undefined, [loadVisitors]),
        addAttendance: (entry) => runMutation("/api/attendance", "POST", entry, [loadAttendance]),
        updateAttendance: (id, entry) => runMutation(`/api/attendance/${id}`, "PUT", entry, [loadAttendance]),
        deleteAttendance: (id) => runMutation(`/api/attendance/${id}`, "DELETE", undefined, [loadAttendance]),
        addNotice: (notice) => runMutation("/api/notices", "POST", notice, [loadNotices]),
        updateNotice: (id, notice) => runMutation(`/api/notices/${id}`, "PUT", notice, [loadNotices]),
        deleteNotice: (id) => runMutation(`/api/notices/${id}`, "DELETE", undefined, [loadNotices]),
        addMaintenanceRequest: (requestItem) =>
          runMutation("/api/maintenance_requests", "POST", requestItem, [loadMaintenanceRequests]),
        updateMaintenanceRequest: (id, requestItem) =>
          runMutation(`/api/maintenance_requests/${id}`, "PUT", requestItem, [loadMaintenanceRequests]),
        deleteMaintenanceRequest: (id) =>
          runMutation(`/api/maintenance_requests/${id}`, "DELETE", undefined, [loadMaintenanceRequests]),
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
