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
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Visitor } from "@/lib/types";

const VisitorsPage = () => {
  const { visitors, students, addVisitor, updateVisitor, deleteVisitor } = useData();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Visitor, "visitor_id">>({ visitor_name: "", student_id: 0, visit_date: "", purpose: "", check_in: "", check_out: null });

  const openAdd = () => { setEditId(null); setForm({ visitor_name: "", student_id: 0, visit_date: new Date().toISOString().split("T")[0], purpose: "", check_in: "", check_out: null }); setOpen(true); };
  const openEdit = (id: number) => {
    const v = visitors.find((x) => x.visitor_id === id);
    if (v) { setEditId(id); setForm({ visitor_name: v.visitor_name, student_id: v.student_id, visit_date: v.visit_date, purpose: v.purpose, check_in: v.check_in, check_out: v.check_out }); setOpen(true); }
  };
  const handleSubmit = () => {
    if (!form.visitor_name || !form.student_id) { toast.error("Visitor name and student required"); return; }
    if (editId) { updateVisitor(editId, form); toast.success(`UPDATE executed — Visitor ${editId}`); }
    else { addVisitor(form); toast.success("INSERT executed — New visitor"); }
    setOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Visitors</h1>
            <p className="text-muted-foreground">SELECT * FROM visitors — {visitors.length} rows</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Visitor</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "UPDATE Visitor" : "INSERT INTO visitors"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Visitor Name</Label><Input value={form.visitor_name} onChange={(e) => setForm({ ...form, visitor_name: e.target.value })} /></div>
                <div>
                  <Label>Student (FK)</Label>
                  <Select value={String(form.student_id)} onValueChange={(v) => setForm({ ...form, student_id: Number(v) })}>
                    <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>{students.map((s) => <SelectItem key={s.student_id} value={String(s.student_id)}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Visit Date</Label><Input type="date" value={form.visit_date} onChange={(e) => setForm({ ...form, visit_date: e.target.value })} /></div>
                <div><Label>Purpose</Label><Input value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} /></div>
                <div><Label>Check In Time</Label><Input type="time" value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })} /></div>
                <div><Label>Check Out Time</Label><Input type="time" value={form.check_out || ""} onChange={(e) => setForm({ ...form, check_out: e.target.value || null })} /></div>
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
                  <TableHead>visitor_id</TableHead>
                  <TableHead>visitor_name</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>visit_date</TableHead>
                  <TableHead>purpose</TableHead>
                  <TableHead>check_in</TableHead>
                  <TableHead>check_out</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitors.map((v) => {
                  const student = students.find((s) => s.student_id === v.student_id);
                  return (
                    <TableRow key={v.visitor_id}>
                      <TableCell className="font-mono">{v.visitor_id}</TableCell>
                      <TableCell className="font-medium">{v.visitor_name}</TableCell>
                      <TableCell>{student?.name ?? "—"}</TableCell>
                      <TableCell>{v.visit_date}</TableCell>
                      <TableCell>{v.purpose}</TableCell>
                      <TableCell>{v.check_in}</TableCell>
                      <TableCell>{v.check_out ?? "—"}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(v.visitor_id)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { deleteVisitor(v.visitor_id); toast.success(`DELETE executed — Visitor ${v.visitor_id}`); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

export default VisitorsPage;
