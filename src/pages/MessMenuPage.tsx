import { useState } from "react";
import { useData } from "@/lib/DataContext";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MessMenu } from "@/lib/types";

const MessMenuPage = () => {
  const { messMenu, addMessMenu, updateMessMenu, deleteMessMenu } = useData();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<MessMenu, "menu_id">>({ day: "", breakfast: "", lunch: "", dinner: "" });

  const openAdd = () => { setEditId(null); setForm({ day: "", breakfast: "", lunch: "", dinner: "" }); setOpen(true); };
  const openEdit = (id: number) => {
    const m = messMenu.find((x) => x.menu_id === id);
    if (m) { setEditId(id); setForm({ day: m.day, breakfast: m.breakfast, lunch: m.lunch, dinner: m.dinner }); setOpen(true); }
  };
  const handleSubmit = () => {
    if (!form.day) { toast.error("Day is required"); return; }
    if (editId) { updateMessMenu(editId, form); toast.success(`UPDATE executed — Menu ${editId}`); }
    else { addMessMenu(form); toast.success("INSERT executed — New menu item"); }
    setOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mess Menu</h1>
            <p className="text-muted-foreground">SELECT * FROM mess_menu — {messMenu.length} rows</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Menu</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "UPDATE Menu" : "INSERT INTO mess_menu"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Day</Label><Input value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} /></div>
                <div><Label>Breakfast</Label><Input value={form.breakfast} onChange={(e) => setForm({ ...form, breakfast: e.target.value })} /></div>
                <div><Label>Lunch</Label><Input value={form.lunch} onChange={(e) => setForm({ ...form, lunch: e.target.value })} /></div>
                <div><Label>Dinner</Label><Input value={form.dinner} onChange={(e) => setForm({ ...form, dinner: e.target.value })} /></div>
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
                  <TableHead>menu_id</TableHead>
                  <TableHead>day</TableHead>
                  <TableHead>breakfast</TableHead>
                  <TableHead>lunch</TableHead>
                  <TableHead>dinner</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messMenu.map((m) => (
                  <TableRow key={m.menu_id}>
                    <TableCell className="font-mono">{m.menu_id}</TableCell>
                    <TableCell className="font-medium">{m.day}</TableCell>
                    <TableCell>{m.breakfast}</TableCell>
                    <TableCell>{m.lunch}</TableCell>
                    <TableCell>{m.dinner}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(m.menu_id)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { deleteMessMenu(m.menu_id); toast.success(`DELETE executed — Menu ${m.menu_id}`); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

export default MessMenuPage;
