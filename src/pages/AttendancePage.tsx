import { useState } from "react";
import { useData } from "@/lib/DataContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Attendance } from "@/lib/types";

const AttendancePage = () => {
  const { attendance, students, addAttendance, updateAttendance, deleteAttendance } = useData();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Attendance, "attendance_id">>({ student_id: 0, date: "", status: "Present" });

  const openAdd = () => { setEditId(null); setForm({ student_id: 0, date: new Date().toISOString().split("T")[0], status: "Present" }); setOpen(true); };
  const openEdit = (id: number) => {
    const a = attendance.find((x) => x.attendance_id === id);
    if (a) { setEditId(id); setForm({ student_id: a.student_id, date: a.date, status: a.status }); setOpen(true); }
  };
  const handleSubmit = () => {
    if (!form.student_id) { toast.error("Student required"); return; }
    if (editId) { updateAttendance(editId, form); toast.success(`UPDATE executed — Attendance ${editId}`); }
    else { addAttendance(form); toast.success("INSERT executed — New attendance"); }
    setOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Attendance</h1>
            <p className="text-muted-foreground">SELECT * FROM attendance — {attendance.length} rows</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Mark Attendance</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "UPDATE Attendance" : "INSERT INTO attendance"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Student (FK)</Label>
                  <Select value={String(form.student_id)} onValueChange={(v) => setForm({ ...form, student_id: Number(v) })}>
                    <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>{students.map((s) => <SelectItem key={s.student_id} value={String(s.student_id)}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Attendance["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Present">Present</SelectItem>
                      <SelectItem value="Absent">Absent</SelectItem>
                      <SelectItem value="Leave">Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSubmit} className="w-full">{editId ? "Execute UPDATE" : "Execute INSERT"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>attendance_id</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>date</TableHead>
                  <TableHead>status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendance.map((a) => {
                  const student = students.find((s) => s.student_id === a.student_id);
                  return (
                    <TableRow key={a.attendance_id}>
                      <TableCell className="font-mono">{a.attendance_id}</TableCell>
                      <TableCell className="font-medium">{student?.name ?? "—"}</TableCell>
                      <TableCell>{a.date}</TableCell>
                      <TableCell><Badge variant={a.status === "Present" ? "default" : a.status === "Absent" ? "destructive" : "secondary"}>{a.status}</Badge></TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(a.attendance_id)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { deleteAttendance(a.attendance_id); toast.success(`DELETE executed — Attendance ${a.attendance_id}`); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default AttendancePage;
