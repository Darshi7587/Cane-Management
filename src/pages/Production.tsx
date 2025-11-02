import { DashboardCard } from "@/components/DashboardCard";
import { Factory, Gauge, Thermometer, Activity, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { fetchProductionKPIs } from "@/data/mock-api";

const crushingData = [
  { time: "00:00", rate: 450, efficiency: 88 },
  { time: "02:00", rate: 480, efficiency: 89 },
  { time: "04:00", rate: 520, efficiency: 91 },
  { time: "06:00", rate: 580, efficiency: 93 },
  { time: "08:00", rate: 610, efficiency: 95 },
  { time: "10:00", rate: 595, efficiency: 94 },
  { time: "12:00", rate: 610, efficiency: 95 },
  { time: "14:00", rate: 590, efficiency: 93 },
  { time: "16:00", rate: 570, efficiency: 92 },
  { time: "18:00", rate: 550, efficiency: 91 },
  { time: "20:00", rate: 540, efficiency: 90 },
  { time: "22:00", rate: 520, efficiency: 89 },
];

const iotMetrics = [
  { name: "Mill 1", value: "Operating", temp: 78, pressure: 92, status: "normal" },
  { name: "Mill 2", value: "Operating", temp: 82, pressure: 88, status: "warning" },
  { name: "Boiler 1", value: "Operating", temp: 165, pressure: 95, status: "normal" },
  { name: "Boiler 2", value: "Operating", temp: 158, pressure: 94, status: "normal" },
];

const COLORS = ['hsl(168, 100%, 39%)', 'hsl(43, 100%, 50%)', 'hsl(0, 100%, 63%)'];

export default function Production() {
  const { data: kpis, isLoading } = useQuery({
    queryKey: ['productionKPIs'],
    queryFn: fetchProductionKPIs,
    staleTime: 5000,
    refetchInterval: 5000,
  });

  if (isLoading || !kpis) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">Loading production data...</div>
      </div>
    );
  }

  const downtimeData = [
    { name: 'Mechanical', value: kpis.downtimeSummary.mechanical },
    { name: 'Process', value: kpis.downtimeSummary.process },
    { name: 'Electrical', value: kpis.downtimeSummary.electrical },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Production Monitoring
        </h1>
        <p className="text-muted-foreground">
          Real-time IoT data and predictive maintenance
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Crushing Rate"
          value={`${kpis.crushingRate.value} ${kpis.crushingRate.unit}`}
          icon={<Factory className="h-8 w-8" />}
          variant="success"
        >
          <div className="mt-4 flex items-center gap-2">
            {kpis.crushingRate.value >= kpis.crushingRate.target ? (
              <TrendingUp className="h-5 w-5 text-success" />
            ) : (
              <TrendingDown className="h-5 w-5 text-destructive" />
            )}
            <span className="text-sm text-muted-foreground">
              Target: {kpis.crushingRate.target} {kpis.crushingRate.unit}
            </span>
          </div>
        </DashboardCard>
        
        <DashboardCard
          title="Sugar Recovery Factor"
          value={`${kpis.sugarRecoveryFactor.value}${kpis.sugarRecoveryFactor.unit}`}
          icon={<Gauge className="h-8 w-8" />}
          variant="success"
        >
          <div className="mt-4 flex items-center gap-2">
            {kpis.sugarRecoveryFactor.trend === 'up' ? (
              <TrendingUp className="h-5 w-5 text-success" />
            ) : (
              <TrendingDown className="h-5 w-5 text-destructive" />
            )}
            <span className="text-sm text-muted-foreground">
              Trend: {kpis.sugarRecoveryFactor.trend === 'up' ? 'Improving' : 'Declining'}
            </span>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Total Downtime"
          value={`${kpis.downtimeSummary.totalHours} hrs`}
          icon={<AlertTriangle className="h-8 w-8" />}
          variant="default"
        >
          <div className="mt-4 text-sm text-muted-foreground">
            Last 24 hours
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Hourly Crushing Throughput (Tons vs Target)">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={kpis.hourlyThroughput}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 45%, 25%)" />
              <XAxis
                dataKey="hour"
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
                dataKey="tons"
                stroke="hsl(168, 100%, 39%)"
                strokeWidth={2}
                dot={{ fill: "hsl(168, 100%, 39%)" }}
                name="Actual Tons"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="hsl(43, 100%, 50%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="Target Tons"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Actual Tons</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: "hsl(43, 100%, 50%)" }}
              />
              <span className="text-muted-foreground">Target Tons</span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Downtime Analysis by Category">
          <div className="text-center mb-4">
            <p className="text-3xl font-bold text-foreground">{kpis.downtimeSummary.totalHours} Hours</p>
            <p className="text-sm text-muted-foreground">Total Hours Lost</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={downtimeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}h`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {downtimeData.map((entry, index) => (
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
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </DashboardCard>
      </div>

      <DashboardCard title="IoT Equipment Status">
        <div className="space-y-4">
          {iotMetrics.map((metric) => (
            <div
              key={metric.name}
              className="p-4 rounded-lg bg-muted/30 border border-border"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Factory className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">{metric.name}</p>
                    <p className="text-xs text-muted-foreground">{metric.value}</p>
                  </div>
                </div>
                {metric.status === "normal" ? (
                  <Badge className="bg-success/20 text-success border-success/40">
                    Normal
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-warning text-warning">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Warning
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      Temperature
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {metric.temp}°C
                    </span>
                  </div>
                  <Progress
                    value={(metric.temp / 200) * 100}
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      Pressure
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {metric.pressure}%
                    </span>
                  </div>
                  <Progress value={metric.pressure} className="h-2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

    </div>
  );
}
