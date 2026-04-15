import { useState } from "react";
import { useData } from "@/lib/DataContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Notice } from "@/lib/types";

const NoticesPage = () => {
  const { notices, addNotice, updateNotice, deleteNotice } = useData();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Notice, "notice_id">>({ title: "", description: "", date: "", priority: "Medium" });

  const openAdd = () => { setEditId(null); setForm({ title: "", description: "", date: new Date().toISOString().split("T")[0], priority: "Medium" }); setOpen(true); };
  const openEdit = (id: number) => {
    const n = notices.find((x) => x.notice_id === id);
    if (n) { setEditId(id); setForm({ title: n.title, description: n.description, date: n.date, priority: n.priority }); setOpen(true); }
  };
  const handleSubmit = () => {
    if (!form.title) { toast.error("Title required"); return; }
    if (editId) { updateNotice(editId, form); toast.success(`UPDATE executed — Notice ${editId}`); }
    else { addNotice(form); toast.success("INSERT executed — New notice"); }
    setOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notices</h1>
            <p className="text-muted-foreground">SELECT * FROM notices — {notices.length} rows</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Notice</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "UPDATE Notice" : "INSERT INTO notices"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
                <div><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
                <div>
                  <Label>Priority</Label>
                  <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v as Notice["priority"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
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
                  <TableHead>notice_id</TableHead>
                  <TableHead>title</TableHead>
                  <TableHead>description</TableHead>
                  <TableHead>date</TableHead>
                  <TableHead>priority</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notices.map((n) => (
                  <TableRow key={n.notice_id}>
                    <TableCell className="font-mono">{n.notice_id}</TableCell>
                    <TableCell className="font-medium">{n.title}</TableCell>
                    <TableCell className="max-w-[300px] truncate">{n.description}</TableCell>
                    <TableCell>{n.date}</TableCell>
                    <TableCell><Badge variant={n.priority === "High" ? "destructive" : n.priority === "Medium" ? "secondary" : "default"}>{n.priority}</Badge></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(n.notice_id)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { deleteNotice(n.notice_id); toast.success(`DELETE executed — Notice ${n.notice_id}`); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default NoticesPage;
