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

const AllocationsPage = () => {
  const { allocations, students, rooms, addAllocation, updateAllocation, deleteAllocation } = useData();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ student_id: 0, room_id: 0, check_in_date: "", check_out_date: null as string | null, status: "Active" as "Active" | "Checked Out" | "Pending" });

  const openAdd = () => { setEditId(null); setForm({ student_id: 0, room_id: 0, check_in_date: new Date().toISOString().split("T")[0], check_out_date: null, status: "Active" }); setOpen(true); };
  const openEdit = (id: number) => {
    const a = allocations.find((x) => x.allocation_id === id);
    if (a) { setEditId(id); setForm({ student_id: a.student_id, room_id: a.room_id, check_in_date: a.check_in_date, check_out_date: a.check_out_date, status: a.status }); setOpen(true); }
  };
  const handleSubmit = () => {
    if (!form.student_id || !form.room_id) { toast.error("Student and room required"); return; }
    if (editId) { updateAllocation(editId, form); toast.success(`UPDATE executed — Allocation ${editId}`); }
    else { addAllocation(form); toast.success("INSERT executed — New allocation"); }
    setOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Allocations</h1>
            <p className="text-muted-foreground">SELECT a.*, s.name, r.room_number FROM allocations a JOIN students s ... JOIN rooms r ... — {allocations.length} rows</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />New Allocation</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "UPDATE Allocation" : "INSERT INTO Allocations"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Student (FK)</Label>
                  <Select value={String(form.student_id)} onValueChange={(v) => setForm({ ...form, student_id: Number(v) })}>
                    <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>{students.map((s) => <SelectItem key={s.student_id} value={String(s.student_id)}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Room (FK)</Label>
                  <Select value={String(form.room_id)} onValueChange={(v) => setForm({ ...form, room_id: Number(v) })}>
                    <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
                    <SelectContent>{rooms.map((r) => <SelectItem key={r.room_id} value={String(r.room_id)}>{r.room_number} ({r.type})</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Check-in Date</Label><Input type="date" value={form.check_in_date} onChange={(e) => setForm({ ...form, check_in_date: e.target.value })} /></div>
                <div><Label>Check-out Date</Label><Input type="date" value={form.check_out_date || ""} onChange={(e) => setForm({ ...form, check_out_date: e.target.value || null })} /></div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as typeof form.status })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Checked Out">Checked Out</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
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
                  <TableHead>allocation_id</TableHead>
                  <TableHead>student_id (FK)</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>room_id (FK)</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>check_in_date</TableHead>
                  <TableHead>check_out_date</TableHead>
                  <TableHead>status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allocations.map((a) => {
                  const student = students.find((s) => s.student_id === a.student_id);
                  const room = rooms.find((r) => r.room_id === a.room_id);
                  return (
                    <TableRow key={a.allocation_id}>
                      <TableCell className="font-mono">{a.allocation_id}</TableCell>
                      <TableCell className="font-mono">{a.student_id}</TableCell>
                      <TableCell className="font-medium">{student?.name ?? "—"}</TableCell>
                      <TableCell className="font-mono">{a.room_id}</TableCell>
                      <TableCell>{room?.room_number ?? "—"}</TableCell>
                      <TableCell>{a.check_in_date}</TableCell>
                      <TableCell>{a.check_out_date ?? "NULL"}</TableCell>
                      <TableCell><Badge variant={a.status === "Active" ? "default" : a.status === "Pending" ? "secondary" : "destructive"}>{a.status}</Badge></TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(a.allocation_id)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { deleteAllocation(a.allocation_id); toast.success(`DELETE executed — Allocation ${a.allocation_id}`); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

export default AllocationsPage;
