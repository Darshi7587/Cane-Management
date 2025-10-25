import { DashboardCard } from "@/components/DashboardCard";
import { Droplet, Gauge, TrendingUp, FlaskConical, AlertCircle } from "lucide-react";
import {
  LineChart,
  Line,
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
import { Progress } from "@/components/ui/progress";

const ethanolProductionData = [
  { time: "00:00", production: 850, purity: 99.2 },
  { time: "02:00", production: 880, purity: 99.3 },
  { time: "04:00", production: 920, purity: 99.1 },
  { time: "06:00", production: 950, purity: 99.4 },
  { time: "08:00", production: 980, purity: 99.5 },
  { time: "10:00", production: 1020, purity: 99.6 },
  { time: "12:00", production: 1050, purity: 99.5 },
  { time: "14:00", production: 1030, purity: 99.4 },
  { time: "16:00", production: 1010, purity: 99.3 },
  { time: "18:00", production: 990, purity: 99.2 },
  { time: "20:00", production: 960, purity: 99.1 },
  { time: "22:00", production: 920, purity: 99.0 },
];

const feedstockData = [
  { name: "Molasses", value: 65 },
  { name: "Bagasse", value: 25 },
  { name: "B-Heavy", value: 10 },
];

const COLORS = ["hsl(168, 100%, 39%)", "hsl(43, 100%, 50%)", "hsl(210, 15%, 65%)"];

const fermentationTanks = [
  { id: "Tank 1", status: "active", fill: 92, brix: 18.5, temp: 32 },
  { id: "Tank 2", status: "active", fill: 88, brix: 17.8, temp: 31 },
  { id: "Tank 3", status: "cleaning", fill: 15, brix: 0, temp: 25 },
  { id: "Tank 4", status: "active", fill: 95, brix: 19.2, temp: 33 },
];

export default function Distillery() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Ethanol Distillery
        </h1>
        <p className="text-muted-foreground">
          Real-time ethanol production and fermentation monitoring
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Production Today"
          value="23,450 L"
          icon={<Droplet className="h-8 w-8" />}
          trend={{ value: 12, label: "vs yesterday" }}
          variant="success"
        />
        <DashboardCard
          title="Ethanol Purity"
          value="99.5%"
          icon={<FlaskConical className="h-8 w-8" />}
          trend={{ value: 0.3, label: "quality grade" }}
          variant="success"
        />
        <DashboardCard
          title="Fermentation Rate"
          value="85%"
          icon={<Gauge className="h-8 w-8" />}
          trend={{ value: 5, label: "efficiency" }}
        />
        <DashboardCard
          title="Daily Revenue"
          value="₹18.2L"
          icon={<TrendingUp className="h-8 w-8" />}
          trend={{ value: 8, label: "growth" }}
          variant="success"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Ethanol Production & Purity (24h)">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={ethanolProductionData}>
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
                dataKey="production"
                stroke="hsl(168, 100%, 39%)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="purity"
                stroke="hsl(43, 100%, 50%)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Production (L/hr)</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: "hsl(43, 100%, 50%)" }}
              />
              <span className="text-muted-foreground">Purity (%)</span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Feedstock Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={feedstockData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {feedstockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
          <div className="mt-4 space-y-2 text-sm">
            {feedstockData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="text-foreground font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Fermentation Tanks Status">
        <div className="grid gap-4 md:grid-cols-2">
          {fermentationTanks.map((tank) => (
            <div
              key={tank.id}
              className="p-4 rounded-lg bg-muted/30 border border-border"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Droplet className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">{tank.id}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {tank.status}
                    </p>
                  </div>
                </div>
                {tank.status === "active" ? (
                  <Badge className="bg-success/20 text-success border-success/40">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-muted text-muted-foreground">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Cleaning
                  </Badge>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">Fill Level</span>
                    <span className="text-xs font-medium text-foreground">
                      {tank.fill}%
                    </span>
                  </div>
                  <Progress value={tank.fill} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Brix</span>
                    <p className="text-foreground font-medium">{tank.brix}°</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Temperature</span>
                    <p className="text-foreground font-medium">{tank.temp}°C</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
