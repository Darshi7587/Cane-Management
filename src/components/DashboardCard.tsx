import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  value?: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  children?: ReactNode;
  className?: string;
  variant?: "default" | "success" | "warning" | "critical";
}

export function DashboardCard({
  title,
  value,
  icon,
  trend,
  children,
  className,
  variant = "default",
}: DashboardCardProps) {
  const variants = {
    default: "",
    success: "border-l-4 border-l-success",
    warning: "border-l-4 border-l-warning",
    critical: "border-l-4 border-l-destructive",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "relative overflow-hidden backdrop-blur-sm bg-card/50 border-border hover:shadow-[var(--shadow-card)] transition-shadow",
        variants[variant],
        className
      )}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {title}
              </p>
              {value !== undefined && (
                <p className="text-3xl font-bold text-foreground">
                  {value}
                </p>
              )}
              {trend && (
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn(
                    "text-sm font-medium",
                    trend.value >= 0 ? "text-success" : "text-destructive"
                  )}>
                    {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {trend.label}
                  </span>
                </div>
              )}
            </div>
            {icon && (
              <div className="text-primary opacity-80">
                {icon}
              </div>
            )}
          </div>
          {children}
        </div>
      </Card>
    </motion.div>
  );
}
