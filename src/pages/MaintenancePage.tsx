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
import { MaintenanceRequest } from "@/lib/types";

const MaintenancePage = () => {
  const { maintenanceRequests, rooms, addMaintenanceRequest, updateMaintenanceRequest, deleteMaintenanceRequest } = useData();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<MaintenanceRequest, "request_id">>({ room_id: 0, description: "", status: "Pending", request_date: "", resolved_date: null });

  const openAdd = () => { setEditId(null); setForm({ room_id: 0, description: "", status: "Pending", request_date: new Date().toISOString().split("T")[0], resolved_date: null }); setOpen(true); };
  const openEdit = (id: number) => {
    const m = maintenanceRequests.find((x) => x.request_id === id);
    if (m) { setEditId(id); setForm({ room_id: m.room_id, description: m.description, status: m.status, request_date: m.request_date, resolved_date: m.resolved_date }); setOpen(true); }
  };
  const handleSubmit = () => {
    if (!form.room_id || !form.description) { toast.error("Room and description required"); return; }
    if (editId) { updateMaintenanceRequest(editId, form); toast.success(`UPDATE executed — Request ${editId}`); }
    else { addMaintenanceRequest(form); toast.success("INSERT executed — New request"); }
    setOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Maintenance</h1>
            <p className="text-muted-foreground">SELECT * FROM maintenance_requests — {maintenanceRequests.length} rows</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button onClick={openAdd}><Plus className="h-4 w-4 mr-2" />New Request</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editId ? "UPDATE Request" : "INSERT INTO maintenance_requests"}</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Room (FK)</Label>
                  <Select value={String(form.room_id)} onValueChange={(v) => setForm({ ...form, room_id: Number(v) })}>
                    <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
                    <SelectContent>{rooms.map((r) => <SelectItem key={r.room_id} value={String(r.room_id)}>{r.room_number}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as MaintenanceRequest["status"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Request Date</Label><Input type="date" value={form.request_date} onChange={(e) => setForm({ ...form, request_date: e.target.value })} /></div>
                <div><Label>Resolved Date</Label><Input type="date" value={form.resolved_date || ""} onChange={(e) => setForm({ ...form, resolved_date: e.target.value || null })} /></div>
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
                  <TableHead>request_id</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>description</TableHead>
                  <TableHead>status</TableHead>
                  <TableHead>request_date</TableHead>
                  <TableHead>resolved_date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceRequests.map((m) => {
                  const room = rooms.find((r) => r.room_id === m.room_id);
                  return (
                    <TableRow key={m.request_id}>
                      <TableCell className="font-mono">{m.request_id}</TableCell>
                      <TableCell className="font-medium">{room?.room_number ?? "—"}</TableCell>
                      <TableCell>{m.description}</TableCell>
                      <TableCell><Badge variant={m.status === "Resolved" ? "default" : m.status === "In Progress" ? "secondary" : "destructive"}>{m.status}</Badge></TableCell>
                      <TableCell>{m.request_date}</TableCell>
                      <TableCell>{m.resolved_date ?? "—"}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(m.request_id)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => { deleteMaintenanceRequest(m.request_id); toast.success(`DELETE executed — Request ${m.request_id}`); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

export default MaintenancePage;
