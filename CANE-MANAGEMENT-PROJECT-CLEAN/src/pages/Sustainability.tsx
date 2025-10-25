import { DashboardCard } from "@/components/DashboardCard";
import { Leaf, Droplet, Zap, Recycle, TrendingDown, AlertCircle } from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { fetchSustainability } from "@/data/mock-api";

const sustainabilityScore = [
  { name: "Score", value: 87, fill: "hsl(168, 100%, 39%)" },
];

const emissionsData = [
  { month: "Jan", co2: 1250, saved: 890 },
  { month: "Feb", co2: 1180, saved: 920 },
  { month: "Mar", co2: 1100, saved: 980 },
  { month: "Apr", co2: 1050, saved: 1020 },
  { month: "May", co2: 980, saved: 1100 },
  { month: "Jun", co2: 920, saved: 1180 },
];

const metrics = [
  {
    title: "Water Recycled",
    value: "78%",
    target: 85,
    current: 78,
    icon: <Droplet className="h-6 w-6" />,
    color: "hsl(210, 100%, 50%)",
  },
  {
    title: "Renewable Energy",
    value: "92%",
    target: 95,
    current: 92,
    icon: <Zap className="h-6 w-6" />,
    color: "hsl(168, 100%, 39%)",
  },
  {
    title: "Waste Recycled",
    value: "85%",
    target: 90,
    current: 85,
    icon: <Recycle className="h-6 w-6" />,
    color: "hsl(43, 100%, 50%)",
  },
];

export default function Sustainability() {
  const { data: sustainability, isLoading } = useQuery({
    queryKey: ['sustainability'],
    queryFn: fetchSustainability,
    staleTime: 5000,
    refetchInterval: 5000,
  });

  if (isLoading || !sustainability) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">Loading sustainability data...</div>
      </div>
    );
  }

  const waterDeviation = ((sustainability.waterConsumption.current - sustainability.waterConsumption.target) / sustainability.waterConsumption.target * 100).toFixed(1);
  const bodCompliant = sustainability.effluentQuality.bod <= sustainability.effluentQuality.bodLimit;
  const codCompliant = sustainability.effluentQuality.cod <= sustainability.effluentQuality.codLimit;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Sustainability Dashboard
        </h1>
        <p className="text-muted-foreground">
          AI-powered sustainability insights and recommendations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Sustainability Score"
          value="87/100"
          icon={<Leaf className="h-8 w-8" />}
          trend={{ value: 5, label: "vs last quarter" }}
          variant="success"
        />
        <DashboardCard
          title="CO₂ Saved"
          value="1,180 tons"
          icon={<TrendingDown className="h-8 w-8" />}
          trend={{ value: 12, label: "this month" }}
          variant="success"
        />
        <DashboardCard
          title="Water Saved"
          value="24.5M L"
          icon={<Droplet className="h-8 w-8" />}
          trend={{ value: 8, label: "vs target" }}
          variant="success"
        />
        <DashboardCard
          title="Green Energy"
          value="92%"
          icon={<Zap className="h-8 w-8" />}
          trend={{ value: 3, label: "renewable" }}
          variant="success"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardCard title="Overall Sustainability Score" className="lg:col-span-1">
          <ResponsiveContainer width="100%" height={200}>
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="100%"
              data={sustainabilityScore}
              startAngle={180}
              endAngle={0}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background
                dataKey="value"
                cornerRadius={10}
                fill="hsl(168, 100%, 39%)"
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <p className="text-4xl font-bold text-foreground">87</p>
            <p className="text-sm text-muted-foreground">out of 100</p>
            <Badge className="mt-2 bg-success/20 text-success border-success/40">
              Excellent
            </Badge>
          </div>
        </DashboardCard>

        <DashboardCard title="CO₂ Emissions vs Savings" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={emissionsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 45%, 25%)" />
              <XAxis
                dataKey="month"
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
                dataKey="co2"
                stroke="hsl(0, 100%, 63%)"
                strokeWidth={2}
                dot={{ fill: "hsl(0, 100%, 63%)" }}
              />
              <Line
                type="monotone"
                dataKey="saved"
                stroke="hsl(168, 100%, 39%)"
                strokeWidth={2}
                dot={{ fill: "hsl(168, 100%, 39%)" }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: "hsl(0, 100%, 63%)" }}
              />
              <span className="text-muted-foreground">CO₂ Emissions (tons)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">CO₂ Saved (tons)</span>
            </div>
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <DashboardCard title="Water Consumption Gauge">
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-foreground">
                {sustainability.waterConsumption.current}
              </p>
              <p className="text-sm text-muted-foreground">
                {sustainability.waterConsumption.unit}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current</span>
                <span className="text-foreground font-medium">
                  {sustainability.waterConsumption.current}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Target</span>
                <span className="text-foreground font-medium">
                  {sustainability.waterConsumption.target}
                </span>
              </div>
              <Progress
                value={(sustainability.waterConsumption.current / sustainability.waterConsumption.target) * 100}
                className="h-3"
              />
              <div className="flex items-center gap-2 mt-2">
                <Badge className={Number(waterDeviation) < 0 ? "bg-success/20 text-success border-success/40" : "bg-warning/20 text-warning border-warning/40"}>
                  {Number(waterDeviation) < 0 ? '✓ Below Target' : '⚠ Above Target'}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {Math.abs(Number(waterDeviation))}% deviation
                </span>
              </div>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Effluent Quality - BOD">
          <div className="space-y-4">
            <div className="text-center">
              <p className={`text-4xl font-bold ${bodCompliant ? 'text-success' : 'text-destructive'}`}>
                {sustainability.effluentQuality.bod}
              </p>
              <p className="text-sm text-muted-foreground">mg/L</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current BOD</span>
                <span className="text-foreground font-medium">
                  {sustainability.effluentQuality.bod} mg/L
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Limit</span>
                <span className="text-foreground font-medium">
                  {sustainability.effluentQuality.bodLimit} mg/L
                </span>
              </div>
              <Progress
                value={(sustainability.effluentQuality.bod / sustainability.effluentQuality.bodLimit) * 100}
                className="h-3"
              />
              <Badge className={bodCompliant ? "bg-success/20 text-success border-success/40" : "bg-destructive/20 text-destructive border-destructive/40"}>
                {bodCompliant ? (
                  <>✓ Within Limit</>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Above Limit
                  </>
                )}
              </Badge>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Effluent Quality - COD">
          <div className="space-y-4">
            <div className="text-center">
              <p className={`text-4xl font-bold ${codCompliant ? 'text-success' : 'text-destructive'}`}>
                {sustainability.effluentQuality.cod}
              </p>
              <p className="text-sm text-muted-foreground">mg/L</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current COD</span>
                <span className="text-foreground font-medium">
                  {sustainability.effluentQuality.cod} mg/L
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Limit</span>
                <span className="text-foreground font-medium">
                  {sustainability.effluentQuality.codLimit} mg/L
                </span>
              </div>
              <Progress
                value={(sustainability.effluentQuality.cod / sustainability.effluentQuality.codLimit) * 100}
                className="h-3"
              />
              <Badge className={codCompliant ? "bg-success/20 text-success border-success/40" : "bg-destructive/20 text-destructive border-destructive/40"}>
                {codCompliant ? (
                  <>✓ Within Limit</>
                ) : (
                  <>
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Above Limit
                  </>
                )}
              </Badge>
            </div>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Resource Efficiency Metrics">
        <div className="grid gap-6 md:grid-cols-3">
          {metrics.map((metric) => (
            <div
              key={metric.title}
              className="p-4 rounded-lg bg-muted/30 border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${metric.color}20` }}
                >
                  <div style={{ color: metric.color }}>{metric.icon}</div>
                </div>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
              </div>
              <p className="text-sm font-medium text-foreground mb-3">
                {metric.title}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="text-foreground font-medium">
                    {metric.current}% of {metric.target}%
                  </span>
                </div>
                <Progress
                  value={(metric.current / metric.target) * 100}
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>

      <DashboardCard title="AI Recommendations" variant="success">
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-success/10 border border-success/40">
            <p className="text-sm font-medium text-foreground mb-1">
              Optimize Boiler Operation Times
            </p>
            <p className="text-xs text-muted-foreground">
              Running boilers during off-peak hours can reduce emissions by 8% and save
              ₹2.4L monthly
            </p>
          </div>
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/40">
            <p className="text-sm font-medium text-foreground mb-1">
              Increase Water Recycling
            </p>
            <p className="text-xs text-muted-foreground">
              Installing additional filtration can boost water recycling from 78% to 85%,
              saving 1.8M liters monthly
            </p>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
