import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, DoorOpen, CreditCard,
  MessageSquareWarning, ArrowRightLeft, Terminal, LogOut,
  UtensilsCrossed, Package, UserCheck, ClipboardList, Bell, Wrench, Database,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "Students", icon: Users },
  { to: "/rooms", label: "Rooms", icon: DoorOpen },
  { to: "/allocations", label: "Allocations", icon: ArrowRightLeft },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/complaints", label: "Complaints", icon: MessageSquareWarning },
  { to: "/mess-menu", label: "Mess Menu", icon: UtensilsCrossed },
  { to: "/inventory", label: "Inventory", icon: Package },
  { to: "/visitors", label: "Visitors", icon: UserCheck },
  { to: "/attendance", label: "Attendance", icon: ClipboardList },
  { to: "/notices", label: "Notices", icon: Bell },
  { to: "/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/query-log", label: "SQL Log", icon: Terminal },
];

const AppSidebar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <Database className="h-7 w-7 text-sidebar-primary" />
          <div>
            <h1 className="text-lg font-bold text-sidebar-primary-foreground">PG Management</h1>
            <p className="text-xs text-sidebar-foreground/60">System</p>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t border-sidebar-border space-y-3">
        {user && (
          <div className="text-xs text-sidebar-foreground/70 truncate">{user.email}</div>
        )}
        <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/70" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
        <p className="text-xs text-sidebar-foreground/50">DBMS Project — Batch 28</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
