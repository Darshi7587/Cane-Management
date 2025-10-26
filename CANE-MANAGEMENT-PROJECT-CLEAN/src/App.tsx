import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
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

const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Navbar onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)} />
            <div className="flex">
              <Sidebar
                collapsed={sidebarCollapsed}
                onCollapse={setSidebarCollapsed}
              />
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Overview />} />
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
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
