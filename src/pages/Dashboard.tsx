import { useData } from "@/lib/DataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DoorOpen, CreditCard, MessageSquareWarning, ArrowRightLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/components/AppLayout";

const StatCard = ({
  title, value, icon: Icon, description, color,
}: {
  title: string; value: string | number; icon: React.ElementType; description: string; color: string;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { students, rooms, payments, complaints, allocations, queryLogs } = useData();

  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((r) => r.occupants > 0).length;
  const pendingPayments = payments.filter((p) => p.status === "Pending" || p.status === "Overdue").length;
  const openComplaints = complaints.filter((c) => c.status !== "Resolved").length;
  const activeAllocations = allocations.filter((a) => a.status === "Active").length;
  const totalRevenue = payments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Hostel/PG Management System Overview</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Total Students" value={students.length} icon={Users} description="Registered students" color="bg-primary/10 text-primary" />
          <StatCard title="Room Occupancy" value={`${occupiedRooms}/${totalRooms}`} icon={DoorOpen} description={`${totalRooms - occupiedRooms} rooms available`} color="bg-success/10 text-success" />
          <StatCard title="Active Allocations" value={activeAllocations} icon={ArrowRightLeft} description="Currently checked in" color="bg-info/10 text-info" />
          <StatCard title="Pending Payments" value={pendingPayments} icon={CreditCard} description={`₹${totalRevenue.toLocaleString("en-IN")} collected`} color="bg-warning/10 text-warning" />
          <StatCard title="Open Complaints" value={openComplaints} icon={MessageSquareWarning} description={`${complaints.length} total filed`} color="bg-destructive/10 text-destructive" />
          <StatCard title="SQL Queries Run" value={queryLogs.length} icon={CreditCard} description="CRUD operations logged" color="bg-primary/10 text-primary" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Payments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {payments.slice(0, 5).map((p) => {
                const student = students.find((s) => s.student_id === p.student_id);
                return (
                  <div key={p.payment_id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{student?.name ?? "Unknown"}</span>
                      <span className="text-muted-foreground ml-2">₹{p.amount.toLocaleString("en-IN")}</span>
                    </div>
                    <Badge variant={p.status === "Paid" ? "default" : p.status === "Overdue" ? "destructive" : "secondary"}>
                      {p.status}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent Complaints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {complaints.slice(0, 5).map((c) => {
                const student = students.find((s) => s.student_id === c.student_id);
                return (
                  <div key={c.complaint_id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{student?.name ?? "Unknown"}</span>
                      <span className="text-muted-foreground ml-2 truncate max-w-[200px] inline-block align-bottom">{c.description}</span>
                    </div>
                    <Badge variant={c.status === "Resolved" ? "default" : c.status === "Open" ? "destructive" : "secondary"}>
                      {c.status}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {queryLogs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Recent SQL Queries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-xs">
                {queryLogs.slice(0, 5).map((q) => (
                  <div key={q.id} className="flex gap-3 items-start">
                    <Badge variant={q.type === "INSERT" ? "default" : q.type === "DELETE" ? "destructive" : "secondary"} className="text-[10px] shrink-0">
                      {q.type}
                    </Badge>
                    <code className="text-muted-foreground break-all">{q.query}</code>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default Dashboard;
