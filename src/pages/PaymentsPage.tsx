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

const PaymentsPage = () => {
  const { payments, students, addPayment, updatePayment, deletePayment } = useData();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ student_id: 0, amount: 0, payment_date: "", status: "Pending" as "Paid" | "Pending" | "Overdue" });

  const openAdd = () => { setEditId(null); setForm({ student_id: 0, amount: 0, payment_date: new Date().toISOString().split("T")[0], status: "Pending" }); setOpen(true); };
  const openEdit = (id: number) => {
    const p = payments.find((x) => x.payment_id === id);
    if (p) { setEditId(id); setForm({ student_id: p.student_id, amount: p.amount, payment_date: p.payment_date, status: p.status }); setOpen(true); }
  };
  const handleSubmit = () => {
    if (!form.student_id || !form.amount) { toast.error("Student and amount required"); return; }
    if (editId) { updatePayment(editId, form); toast.success(`UPDATE executed — Payment ${editId}`); }
    else { addPayment(form); toast.success("INSERT executed — New payment"); }
    setOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payments</h1>
            <p className="text-muted-foreground">SELECT p.*, s.name FROM payments p JOIN students s ON p.student_id = s.student_id — {payments.length} rows</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Payment</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "UPDATE Payment" : "INSERT INTO Payments"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Student (FK)</Label>
                  <Select value={String(form.student_id)} onValueChange={(v) => setForm({ ...form, student_id: Number(v) })}>
                    <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                    <SelectContent>{students.map((s) => <SelectItem key={s.student_id} value={String(s.student_id)}>{s.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Amount (₹)</Label><Input type="number" value={form.amount || ""} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} /></div>
                <div><Label>Payment Date</Label><Input type="date" value={form.payment_date} onChange={(e) => setForm({ ...form, payment_date: e.target.value })} /></div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as typeof form.status })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
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
                  <TableHead>payment_id</TableHead>
                  <TableHead>student_id (FK)</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>amount</TableHead>
                  <TableHead>payment_date</TableHead>
                  <TableHead>status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p) => {
                  const student = students.find((s) => s.student_id === p.student_id);
                  return (
                    <TableRow key={p.payment_id}>
                      <TableCell className="font-mono">{p.payment_id}</TableCell>
                      <TableCell className="font-mono">{p.student_id}</TableCell>
                      <TableCell className="font-medium">{student?.name ?? "—"}</TableCell>
                      <TableCell>₹{p.amount.toLocaleString("en-IN")}</TableCell>
                      <TableCell>{p.payment_date}</TableCell>
                      <TableCell><Badge variant={p.status === "Paid" ? "default" : p.status === "Overdue" ? "destructive" : "secondary"}>{p.status}</Badge></TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p.payment_id)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { deletePayment(p.payment_id); toast.success(`DELETE executed — Payment ${p.payment_id}`); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

export default PaymentsPage;
