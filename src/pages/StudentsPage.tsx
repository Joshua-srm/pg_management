import { useState } from "react";
import { useData } from "@/lib/DataContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const StudentsPage = () => {
  const { students, addStudent, updateStudent, deleteStudent } = useData();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", contact: "", address: "", user_id: 0 });
  const [search, setSearch] = useState("");

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contact.includes(search)
  );

  const openAdd = () => {
    setEditId(null);
    setForm({ name: "", contact: "", address: "", user_id: 0 });
    setOpen(true);
  };

  const openEdit = (id: number) => {
    const s = students.find((x) => x.student_id === id);
    if (s) {
      setEditId(id);
      setForm({ name: s.name, contact: s.contact, address: s.address, user_id: s.user_id });
      setOpen(true);
    }
  };

  const handleSubmit = () => {
    if (!form.name || !form.contact) {
      toast.error("Name and contact are required");
      return;
    }
    if (editId) {
      updateStudent(editId, form);
      toast.success(`UPDATE executed — Student ${editId} updated`);
    } else {
      addStudent(form);
      toast.success("INSERT executed — New student added");
    }
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    deleteStudent(id);
    toast.success(`DELETE executed — Student ${id} removed`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Students</h1>
            <p className="text-muted-foreground">SELECT * FROM students — {filtered.length} rows</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Student</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editId ? "UPDATE Student" : "INSERT INTO Students"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Contact</Label><Input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} /></div>
                <div><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
                <div><Label>User ID (FK)</Label><Input type="number" value={form.user_id || ""} onChange={(e) => setForm({ ...form, user_id: Number(e.target.value) })} /></div>
                <Button onClick={handleSubmit} className="w-full">{editId ? "Execute UPDATE" : "Execute INSERT"}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Input placeholder="Search students (WHERE name LIKE '%...')" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>student_id</TableHead>
                  <TableHead>name</TableHead>
                  <TableHead>contact</TableHead>
                  <TableHead>address</TableHead>
                  <TableHead>user_id (FK)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.student_id}>
                    <TableCell className="font-mono">{s.student_id}</TableCell>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell>{s.contact}</TableCell>
                    <TableCell>{s.address}</TableCell>
                    <TableCell className="font-mono">{s.user_id}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(s.student_id)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(s.student_id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No rows returned</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default StudentsPage;
