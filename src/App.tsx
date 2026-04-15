import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataProvider } from "@/lib/DataContext";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import StudentsPage from "./pages/StudentsPage";
import RoomsPage from "./pages/RoomsPage";
import AllocationsPage from "./pages/AllocationsPage";
import PaymentsPage from "./pages/PaymentsPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import QueryLogPage from "./pages/QueryLogPage";
import MessMenuPage from "./pages/MessMenuPage";
import InventoryPage from "./pages/InventoryPage";
import VisitorsPage from "./pages/VisitorsPage";
import AttendancePage from "./pages/AttendancePage";
import NoticesPage from "./pages/NoticesPage";
import MaintenancePage from "./pages/MaintenancePage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/students" element={<ProtectedRoute><StudentsPage /></ProtectedRoute>} />
              <Route path="/rooms" element={<ProtectedRoute><RoomsPage /></ProtectedRoute>} />
              <Route path="/allocations" element={<ProtectedRoute><AllocationsPage /></ProtectedRoute>} />
              <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
              <Route path="/complaints" element={<ProtectedRoute><ComplaintsPage /></ProtectedRoute>} />
              <Route path="/mess-menu" element={<ProtectedRoute><MessMenuPage /></ProtectedRoute>} />
              <Route path="/inventory" element={<ProtectedRoute><InventoryPage /></ProtectedRoute>} />
              <Route path="/visitors" element={<ProtectedRoute><VisitorsPage /></ProtectedRoute>} />
              <Route path="/attendance" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
              <Route path="/notices" element={<ProtectedRoute><NoticesPage /></ProtectedRoute>} />
              <Route path="/maintenance" element={<ProtectedRoute><MaintenancePage /></ProtectedRoute>} />
              <Route path="/query-log" element={<ProtectedRoute><QueryLogPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
