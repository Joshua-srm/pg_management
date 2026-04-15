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

const ComplaintsPage = () => {
  const { complaints, students, addComplaint, updateComplaint, deleteComplaint } = useData();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ student_id: 0, description: "", status: "Open" as "Open" | "In Progress" | "Resolved", created_at: "" });

  const openAdd = () => { setEditId(null); setForm({ student_id: 0, description: "", status: "Open", created_at: new Date().toISOString().split("T")[0] }); setOpen(true); };
  const openEdit = (id: number) => {
    const c = complaints.find((x) => x.complaint_id === id);
    if (c) { setEditId(id); setForm({ student_id: c.student_id, description: c.description, status: c.status, created_at: c.created_at }); setOpen(true); }
  };
  const handleSubmit = () => {
    if (!form.student_id || !form.description) { toast.error("Student and description required"); return; }
    if (editId) { updateComplaint(editId, form); toast.success(`UPDATE executed — Complaint ${editId}`); }
    else { addComplaint(form); toast.success("INSERT executed — New complaint"); }
    setOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Complaints</h1>
            <p className="text-muted-foreground">SELECT c.*, s.name FROM complaints c JOIN students s ON c.student_id = s.student_id — {complaints.length} rows</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />File Complaint</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "UPDATE Complaint" : "INSERT INTO Complaints"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Student (FK)</Label>
                  <Select value={String(form.student_id)} onValueChange={(v) => setForm({ ...form, student_id: Number(v) })}>
                    <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>{students.map((s) => <SelectItem key={s.student_id} value={String(s.student_id)}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as typeof form.status })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
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
                  <TableHead>complaint_id</TableHead>
                  <TableHead>student_id (FK)</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>description</TableHead>
                  <TableHead>status</TableHead>
                  <TableHead>created_at</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((c) => {
                  const student = students.find((s) => s.student_id === c.student_id);
                  return (
                    <TableRow key={c.complaint_id}>
                      <TableCell className="font-mono">{c.complaint_id}</TableCell>
                      <TableCell className="font-mono">{c.student_id}</TableCell>
                      <TableCell className="font-medium">{student?.name ?? "—"}</TableCell>
                      <TableCell className="max-w-[300px] truncate">{c.description}</TableCell>
                      <TableCell><Badge variant={c.status === "Resolved" ? "default" : c.status === "Open" ? "destructive" : "secondary"}>{c.status}</Badge></TableCell>
                      <TableCell>{c.created_at}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(c.complaint_id)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { deleteComplaint(c.complaint_id); toast.success(`DELETE executed — Complaint ${c.complaint_id}`); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

export default ComplaintsPage;
