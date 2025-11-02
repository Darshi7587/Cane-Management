import { DashboardCard } from '@/components/DashboardCard';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';

const monthlyProduction = [
  { month: 'Jan', production: 45000, target: 42000 },
  { month: 'Feb', production: 48000, target: 42000 },
  { month: 'Mar', production: 52000, target: 42000 },
  { month: 'Apr', production: 49000, target: 42000 },
  { month: 'May', production: 51000, target: 42000 },
  { month: 'Jun', production: 48250, target: 42000 },
];

const departmentEfficiency = [
  { name: 'Production', value: 92 },
  { name: 'Logistics', value: 85 },
  { name: 'Power Plant', value: 88 },
  { name: 'Distillery', value: 90 },
];

const revenueData = [
  { month: 'Jan', sugar: 2.8, ethanol: 0.9, power: 0.5 },
  { month: 'Feb', sugar: 3.1, ethanol: 1.0, power: 0.6 },
  { month: 'Mar', sugar: 3.4, ethanol: 1.1, power: 0.7 },
  { month: 'Apr', sugar: 3.2, ethanol: 1.0, power: 0.6 },
  { month: 'May', sugar: 3.3, ethanol: 1.1, power: 0.6 },
  { month: 'Jun', sugar: 3.5, ethanol: 1.2, power: 0.7 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Analytics() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics and performance insights
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Overall Efficiency"
          icon={<Activity className="h-8 w-8" />}
          variant="default"
        >
          <div className="space-y-2">
            <div className="text-3xl font-bold text-foreground">89.2%</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-success">+3.2% from last month</span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Total Revenue"
          icon={<DollarSign className="h-8 w-8" />}
          variant="success"
        >
          <div className="space-y-2">
            <div className="text-3xl font-bold text-foreground">₹5.4 Cr</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-success">+8.5% from last month</span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Production Rate"
          icon={<Activity className="h-8 w-8" />}
          variant="default"
        >
          <div className="space-y-2">
            <div className="text-3xl font-bold text-foreground">610 TCH</div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm text-success">Above target</span>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard
          title="Cost per Ton"
          icon={<DollarSign className="h-8 w-8" />}
          variant="default"
        >
          <div className="space-y-2">
            <div className="text-3xl font-bold text-foreground">₹3,250</div>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-success" />
              <span className="text-sm text-success">-2.1% cost reduction</span>
            </div>
          </div>
        </DashboardCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Production Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyProduction}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="production" fill="#10b981" name="Production (Tons)" />
              <Bar dataKey="target" fill="#6366f1" name="Target (Tons)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Department Efficiency</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentEfficiency}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {departmentEfficiency.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Breakdown (Crores ₹)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sugar" stroke="#10b981" name="Sugar" strokeWidth={2} />
            <Line type="monotone" dataKey="ethanol" stroke="#6366f1" name="Ethanol" strokeWidth={2} />
            <Line type="monotone" dataKey="power" stroke="#f59e0b" name="Power" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
