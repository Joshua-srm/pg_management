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
import { Inventory } from "@/lib/types";

const InventoryPage = () => {
  const { inventory, addInventory, updateInventory, deleteInventory } = useData();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Inventory, "item_id">>({ item_name: "", category: "", quantity: 0, condition: "Good" });

  const openAdd = () => { setEditId(null); setForm({ item_name: "", category: "", quantity: 0, condition: "Good" }); setOpen(true); };
  const openEdit = (id: number) => {
    const i = inventory.find((x) => x.item_id === id);
    if (i) { setEditId(id); setForm({ item_name: i.item_name, category: i.category, quantity: i.quantity, condition: i.condition }); setOpen(true); }
  };
  const handleSubmit = () => {
    if (!form.item_name) { toast.error("Item name required"); return; }
    if (editId) { updateInventory(editId, form); toast.success(`UPDATE executed — Item ${editId}`); }
    else { addInventory(form); toast.success("INSERT executed — New item"); }
    setOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Inventory</h1>
            <p className="text-muted-foreground">SELECT * FROM inventory — {inventory.length} rows</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Item</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "UPDATE Item" : "INSERT INTO inventory"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Item Name</Label><Input value={form.item_name} onChange={(e) => setForm({ ...form, item_name: e.target.value })} /></div>
                <div><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
                <div><Label>Quantity</Label><Input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} /></div>
                <div>
                  <Label>Condition</Label>
                  <Select value={form.condition} onValueChange={(v) => setForm({ ...form, condition: v as Inventory["condition"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                      <SelectItem value="Poor">Poor</SelectItem>
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
                  <TableHead>item_id</TableHead>
                  <TableHead>item_name</TableHead>
                  <TableHead>category</TableHead>
                  <TableHead>quantity</TableHead>
                  <TableHead>condition</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((i) => (
                  <TableRow key={i.item_id}>
                    <TableCell className="font-mono">{i.item_id}</TableCell>
                    <TableCell className="font-medium">{i.item_name}</TableCell>
                    <TableCell>{i.category}</TableCell>
                    <TableCell>{i.quantity}</TableCell>
                    <TableCell><Badge variant={i.condition === "Good" ? "default" : i.condition === "Fair" ? "secondary" : "destructive"}>{i.condition}</Badge></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(i.item_id)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => { deleteInventory(i.item_id); toast.success(`DELETE executed — Item ${i.item_id}`); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

export default InventoryPage;
