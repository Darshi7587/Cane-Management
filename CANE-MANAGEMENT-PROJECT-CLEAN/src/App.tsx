import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import StaffLogin from "./pages/StaffLogin";
import FarmerRegistration from "./pages/FarmerRegistration";
import LogisticsRegistration from "./pages/LogisticsRegistration";
import ClearStorage from "./pages/ClearStorage";
import AdminDashboard from "./pages/admin/EnhancedAdminDashboard";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import LogisticsDashboard from "./pages/logistics/LogisticsDashboard";
import ProductionDashboard from "./pages/staff/EnhancedProductionDashboard";
import QualityDashboard from "./pages/staff/EnhancedQualityDashboard";
import HRDashboard from "./pages/staff/EnhancedHRDashboard";
import SupportDashboard from "./pages/staff/EnhancedSupportDashboard";
import Overview from "./pages/Overview";
import Farmers from "./pages/Farmers";
import Logistics from "./pages/Logistics";
import Production from "./pages/Production";
import Distillery from "./pages/Distillery";
import PowerPlant from "./pages/PowerPlant";
import Sustainability from "./pages/Sustainability";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Layout wrapper component to conditionally show sidebar/navbar
const AppLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  
  // Routes that should NOT show sidebar/navbar (public pages)
  const publicRoutes = ['/', '/login', '/admin-login', '/staff-login', '/register-farmer', '/register-logistics'];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  
  // Admin, farmer, logistics, and staff dashboards should not show the regular sidebar
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isFarmerRoute = location.pathname.startsWith('/farmer');
  const isLogisticsRoute = location.pathname.startsWith('/logistics/dashboard');
  const isStaffRoute = location.pathname.startsWith('/staff');
  
  const shouldShowSidebar = !isPublicRoute && !isAdminRoute && !isFarmerRoute && !isLogisticsRoute && !isStaffRoute;

  return (
    <div className="min-h-screen bg-background">
      {shouldShowSidebar && <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />}
      <div className="flex">
        {shouldShowSidebar && (
          <Sidebar
            collapsed={sidebarCollapsed}
            onCollapse={setSidebarCollapsed}
          />
        )}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/staff-login" element={<StaffLogin />} />
            <Route path="/register-farmer" element={<FarmerRegistration />} />
            <Route path="/register-logistics" element={<LogisticsRegistration />} />
            <Route path="/clear-storage" element={<ClearStorage />} />
            
            {/* Admin Routes (no sidebar) */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Farmer Routes (no sidebar) */}
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            
            {/* Logistics Routes (no sidebar) */}
            <Route path="/logistics/dashboard" element={<LogisticsDashboard />} />
            
            {/* Staff Routes (no sidebar) */}
            <Route path="/staff/production" element={<ProductionDashboard />} />
            <Route path="/staff/quality" element={<QualityDashboard />} />
            <Route path="/staff/hr" element={<HRDashboard />} />
            <Route path="/staff/support" element={<SupportDashboard />} />
            
            {/* Dashboard Routes (with sidebar) */}
            <Route path="/overview" element={<Overview />} />
            <Route path="/farmers" element={<Farmers />} />
            <Route path="/logistics" element={<Logistics />} />
            <Route path="/production" element={<Production />} />
            <Route path="/distillery" element={<Distillery />} />
            <Route path="/power" element={<PowerPlant />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
