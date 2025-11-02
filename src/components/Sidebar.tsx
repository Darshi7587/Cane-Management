import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Truck,
  Factory,
  Droplet,
  Zap,
  Leaf,
  BarChart3,
  Settings,
  ChevronLeft,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Register Farmer", href: "/register-farmer", icon: UserPlus },
  { name: "Farmers", href: "/farmers", icon: Users },
  { name: "Logistics", href: "/logistics", icon: Truck },
  { name: "Production", href: "/production", icon: Factory },
  { name: "Distillery", href: "/distillery", icon: Droplet },
  { name: "Power Plant", href: "/power", icon: Zap },
  { name: "Sustainability", href: "/sustainability", icon: Leaf },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ collapsed = false, onCollapse }: SidebarProps) {
  return (
    <aside
      className={cn(
        "sticky top-16 h-[calc(100vh-4rem)] border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="space-y-1 px-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  )
                }
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onCollapse?.(!collapsed)}
            className="w-full justify-center"
          >
            <ChevronLeft
              className={cn(
                "h-5 w-5 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </Button>
        </div>
      </div>
    </aside>
  );
}
