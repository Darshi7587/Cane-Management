import { Factory, Bell, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  onMenuClick?: () => void;
  userRole?: "admin" | "farmer" | "staff";
}

export function Navbar({ onMenuClick, userRole = "admin" }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-6 gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
            <Factory className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              SSIMP
            </h1>
            <p className="text-xs text-muted-foreground">
              Smart Sugar Industry Platform
            </p>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>

          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
            <User className="h-5 w-5 text-muted-foreground" />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-foreground capitalize">
                {userRole}
              </p>
              <p className="text-xs text-muted-foreground">
                Dashboard
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
