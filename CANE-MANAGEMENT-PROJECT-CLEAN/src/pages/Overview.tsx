import { DashboardCard } from "@/components/DashboardCard";
import {
  Users,
  Truck,
  Factory,
  TrendingUp,
  Zap,
  Droplet,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";

const productionData = [
  { time: "00:00", crushing: 450, sugar: 42, ethanol: 18 },
  { time: "04:00", crushing: 520, sugar: 48, ethanol: 21 },
  { time: "08:00", crushing: 580, sugar: 54, ethanol: 24 },
  { time: "12:00", crushing: 610, sugar: 57, ethanol: 26 },
  { time: "16:00", crushing: 590, sugar: 55, ethanol: 25 },
  { time: "20:00", crushing: 540, sugar: 50, ethanol: 22 },
];

const deliveryData = [
  { day: "Mon", deliveries: 45 },
  { day: "Tue", deliveries: 52 },
  { day: "Wed", deliveries: 48 },
  { day: "Thu", deliveries: 61 },
  { day: "Fri", deliveries: 55 },
  { day: "Sat", deliveries: 67 },
  { day: "Sun", deliveries: 43 },
];

const resourceData = [
  { name: "Power", value: 8500, color: "hsl(168, 100%, 39%)" },
  { name: "Water", value: 6200, color: "hsl(210, 100%, 50%)" },
  { name: "Steam", value: 4800, color: "hsl(43, 100%, 50%)" },
];

const alerts = [
  { id: 1, type: "warning", message: "Mill 2 - Temperature rising", time: "5 min ago" },
  { id: 2, type: "success", message: "Truck T-2847 delivered successfully", time: "12 min ago" },
  { id: 3, type: "warning", message: "Low sugar stock in warehouse B", time: "1 hour ago" },
];

export default function Overview() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Real-time monitoring of all operations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Active Farmers"
          value="1,284"
          icon={<Users className="h-8 w-8" />}
          trend={{ value: 12, label: "vs last month" }}
          variant="success"
        />
        <DashboardCard
          title="Trucks in Transit"
          value="42"
          icon={<Truck className="h-8 w-8" />}
          trend={{ value: -5, label: "vs yesterday" }}
        />
        <DashboardCard
          title="Crushing Rate"
          value="610 TPH"
          icon={<Factory className="h-8 w-8" />}
          trend={{ value: 8, label: "efficiency" }}
          variant="success"
        />
        <DashboardCard
          title="Power Output"
          value="24.5 MW"
          icon={<Zap className="h-8 w-8" />}
          trend={{ value: 15, label: "vs target" }}
          variant="success"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Production Trends (24h)" className="col-span-1">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 45%, 25%)" />
              <XAxis
                dataKey="time"
                stroke="hsl(210, 15%, 65%)"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="hsl(210, 15%, 65%)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(210, 55%, 14%)",
                  border: "1px solid hsl(210, 45%, 25%)",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="crushing"
                stroke="hsl(168, 100%, 39%)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="sugar"
                stroke="hsl(210, 100%, 50%)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="ethanol"
                stroke="hsl(43, 100%, 50%)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Crushing (TPH)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(210, 100%, 50%)" }} />
              <span className="text-muted-foreground">Sugar (tons)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "hsl(43, 100%, 50%)" }} />
              <span className="text-muted-foreground">Ethanol (KL)</span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Weekly Deliveries">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deliveryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 45%, 25%)" />
              <XAxis
                dataKey="day"
                stroke="hsl(210, 15%, 65%)"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="hsl(210, 15%, 65%)" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(210, 55%, 14%)",
                  border: "1px solid hsl(210, 45%, 25%)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="deliveries" fill="hsl(168, 100%, 39%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardCard title="Resource Usage" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={resourceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {resourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(210, 55%, 14%)",
                  border: "1px solid hsl(210, 45%, 25%)",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {resourceData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium text-foreground">{item.value} units</span>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="System Alerts" className="lg:col-span-2">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border"
              >
                {alert.type === "warning" ? (
                  <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
                <Badge
                  variant={alert.type === "warning" ? "destructive" : "default"}
                  className="shrink-0"
                >
                  {alert.type}
                </Badge>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
