import { DashboardCard } from "@/components/DashboardCard";
import { Zap, Battery, Leaf, TrendingUp, AlertTriangle } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { fetchPowerMetrics } from "@/data/mock-api";

const powerGenerationData = [
  { time: "00:00", power: 42, efficiency: 82 },
  { time: "02:00", power: 45, efficiency: 84 },
  { time: "04:00", power: 48, efficiency: 86 },
  { time: "06:00", power: 52, efficiency: 88 },
  { time: "08:00", power: 58, efficiency: 91 },
  { time: "10:00", power: 62, efficiency: 93 },
  { time: "12:00", power: 65, efficiency: 94 },
  { time: "14:00", power: 63, efficiency: 92 },
  { time: "16:00", power: 60, efficiency: 90 },
  { time: "18:00", power: 55, efficiency: 88 },
  { time: "20:00", power: 50, efficiency: 85 },
  { time: "22:00", power: 46, efficiency: 83 },
];

const sustainabilityData = [
  { metric: "CO₂ Saved", value: 87, fill: "hsl(168, 100%, 39%)" },
  { metric: "Water Recycled", value: 72, fill: "hsl(43, 100%, 50%)" },
  { metric: "Bagasse Used", value: 94, fill: "hsl(210, 15%, 65%)" },
];

const turbines = [
  { id: "Turbine 1", status: "optimal", output: 25.5, temp: 485, pressure: 88, rpm: 3000 },
  { id: "Turbine 2", status: "optimal", output: 22.8, temp: 478, pressure: 86, rpm: 2980 },
  { id: "Turbine 3", status: "warning", output: 18.2, temp: 495, pressure: 82, rpm: 2950 },
];

export default function PowerPlant() {
  const { data: powerMetrics, isLoading } = useQuery({
    queryKey: ['powerMetrics'],
    queryFn: fetchPowerMetrics,
    staleTime: 5000,
    refetchInterval: 5000,
  });

  if (isLoading || !powerMetrics) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">Loading power plant data...</div>
      </div>
    );
  }

  const powerData = [
    { name: 'Generated', value: powerMetrics.generatedMW, fill: 'hsl(168, 100%, 39%)' },
    { name: 'Consumed', value: powerMetrics.consumedMW, fill: 'hsl(43, 100%, 50%)' },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Power Generation Plant
        </h1>
        <p className="text-muted-foreground">
          Cogeneration monitoring and sustainability metrics
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Generated MW"
          value={`${powerMetrics.generatedMW} MW`}
          icon={<Zap className="h-8 w-8" />}
          variant="success"
        >
          <div className="mt-2 text-sm text-muted-foreground">
            Total power generated
          </div>
        </DashboardCard>
        <DashboardCard
          title="Net Export MW"
          value={`${powerMetrics.netExportMW} MW`}
          icon={<Battery className="h-8 w-8" />}
          variant="success"
        >
          <div className="mt-2 text-sm text-muted-foreground">
            Exported to grid
          </div>
        </DashboardCard>
        <DashboardCard
          title="CO₂ Offset"
          value="1,245 T"
          icon={<Leaf className="h-8 w-8" />}
          trend={{ value: 8, label: "this month" }}
          variant="success"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardCard title="Power Generation Overview">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={powerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 45%, 25%)" />
              <XAxis
                dataKey="name"
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
              <Bar dataKey="value" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Generated</span>
              <span className="text-foreground font-medium">{powerMetrics.generatedMW} MW</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Consumed</span>
              <span className="text-foreground font-medium">{powerMetrics.consumedMW} MW</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Net Export</span>
              <span className="text-success font-medium">{powerMetrics.netExportMW} MW</span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Sustainability Metrics">
          <ResponsiveContainer width="100%" height={280}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="90%"
              barSize={20}
              data={sustainabilityData}
            >
              <RadialBar
                label={{ position: "insideStart", fill: "#fff" }}
                background
                dataKey="value"
              />
              <Legend
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{ fontSize: "12px" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(210, 55%, 14%)",
                  border: "1px solid hsl(210, 45%, 25%)",
                  borderRadius: "8px",
                }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2 text-sm">
            {sustainabilityData.map((item) => (
              <div key={item.metric} className="flex items-center justify-between">
                <span className="text-muted-foreground">{item.metric}</span>
                <span className="text-foreground font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Turbine Performance">
        <div className="space-y-4">
          {turbines.map((turbine) => (
            <div
              key={turbine.id}
              className="p-4 rounded-lg bg-muted/30 border border-border"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">{turbine.id}</p>
                    <p className="text-xs text-muted-foreground">
                      {turbine.output} MW Output
                    </p>
                  </div>
                </div>
                {turbine.status === "optimal" ? (
                  <Badge className="bg-success/20 text-success border-success/40">
                    Optimal
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-warning text-warning">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Warning
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      Temperature
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {turbine.temp}°C
                    </span>
                  </div>
                  <Progress
                    value={(turbine.temp / 600) * 100}
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      Pressure
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {turbine.pressure}%
                    </span>
                  </div>
                  <Progress value={turbine.pressure} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">RPM</span>
                    <span className="text-xs font-medium text-foreground">
                      {turbine.rpm}
                    </span>
                  </div>
                  <Progress
                    value={(turbine.rpm / 3000) * 100}
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
