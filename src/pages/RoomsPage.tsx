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
import { Room } from "@/lib/types";

const RoomsPage = () => {
  const { rooms, addRoom, updateRoom, deleteRoom } = useData();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Room, "room_id">>({ room_number: "", capacity: 2, type: "Standard", rent: 8000, occupants: 0 });

  const openAdd = () => { setEditId(null); setForm({ room_number: "", capacity: 2, type: "Standard", rent: 8000, occupants: 0 }); setOpen(true); };
  const openEdit = (id: number) => {
    const r = rooms.find((x) => x.room_id === id);
    if (r) { setEditId(id); setForm({ room_number: r.room_number, capacity: r.capacity, type: r.type, rent: r.rent, occupants: r.occupants }); setOpen(true); }
  };
  const handleSubmit = () => {
    if (!form.room_number) { toast.error("Room number required"); return; }
    if (editId) { updateRoom(editId, form); toast.success(`UPDATE executed — Room ${editId}`); }
    else { addRoom(form); toast.success("INSERT executed — New room"); }
    setOpen(false);
  };
  const handleDelete = (id: number) => { deleteRoom(id); toast.success(`DELETE executed — Room ${id}`); };

  const statusColor = (r: Room) => {
    if (r.occupants >= r.capacity) return "destructive";
    if (r.occupants > 0) return "secondary";
    return "default";
  };
  const statusLabel = (r: Room) => {
    if (r.occupants >= r.capacity) return "Full";
    if (r.occupants > 0) return "Occupied";
    return "Available";
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Rooms</h1>
            <p className="text-muted-foreground">SELECT * FROM rooms — {rooms.length} rows</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />Add Room</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "UPDATE Room" : "INSERT INTO Rooms"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Room Number</Label><Input value={form.room_number} onChange={(e) => setForm({ ...form, room_number: e.target.value })} /></div>
                <div><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} /></div>
                <div>
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Room["type"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard">Standard</SelectItem>
                      <SelectItem value="Premium">Premium</SelectItem>
                      <SelectItem value="Suite">Suite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Rent (₹)</Label><Input type="number" value={form.rent} onChange={(e) => setForm({ ...form, rent: Number(e.target.value) })} /></div>
                <div><Label>Current Occupants</Label><Input type="number" value={form.occupants} onChange={(e) => setForm({ ...form, occupants: Number(e.target.value) })} /></div>
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
                  <TableHead>room_id</TableHead>
                  <TableHead>room_number</TableHead>
                  <TableHead>type</TableHead>
                  <TableHead>capacity</TableHead>
                  <TableHead>occupants</TableHead>
                  <TableHead>rent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((r) => (
                  <TableRow key={r.room_id}>
                    <TableCell className="font-mono">{r.room_id}</TableCell>
                    <TableCell className="font-medium">{r.room_number}</TableCell>
                    <TableCell>{r.type}</TableCell>
                    <TableCell>{r.capacity}</TableCell>
                    <TableCell>{r.occupants}/{r.capacity}</TableCell>
                    <TableCell>₹{r.rent.toLocaleString("en-IN")}</TableCell>
                    <TableCell><Badge variant={statusColor(r)}>{statusLabel(r)}</Badge></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(r.room_id)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(r.room_id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

export default RoomsPage;
