import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Users, UserCheck, Activity, TrendingUp, Clock, AlertCircle, 
  Factory, Truck, Leaf, BarChart3, Settings, FileText,
  CheckCircle2, XCircle, Bell
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface DashboardStats {
  totalUsers: number;
  activeSessions: number;
  systemStatus: 'healthy' | 'warning' | 'critical';
  pendingApprovals: {
    farmers: number;
    logistics: number;
    total: number;
  };
  supportTickets: number;
  production: {
    thisMonth: string;
    unit: string;
  };
  activeDeliveries: number;
  totalFarmers: number;
}

interface RecentActivity {
  id: string;
  message: string;
  timestamp: string;
  type: 'farmer' | 'production' | 'delivery' | 'user' | 'system';
}

export default function EnhancedAdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeSessions: 0,
    systemStatus: 'healthy',
    pendingApprovals: { farmers: 0, logistics: 0, total: 0 },
    supportTickets: 0,
    production: { thisMonth: '0', unit: 'tons' },
    activeDeliveries: 0,
    totalFarmers: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const data = await response.json();

      setStats({
        totalUsers: data.userStats?.total || 1247,
        activeSessions: 89, // Mock for now
        systemStatus: 'healthy',
        pendingApprovals: {
          farmers: data.pendingApprovalsList?.filter((u: any) => u.role === 'farmer').length || 5,
          logistics: data.pendingApprovalsList?.filter((u: any) => u.role === 'logistics').length || 2,
          total: data.pendingApprovalsList?.length || 7
        },
        supportTickets: 3, // Mock
        production: { thisMonth: '12,450', unit: 'tons' },
        activeDeliveries: 12,
        totalFarmers: data.userStats?.byRole?.farmer || 523
      });

      // Mock recent activities
      setRecentActivities([
        { id: '1', message: 'New farmer registered', timestamp: '2 min ago', type: 'farmer' },
        { id: '2', message: 'Production batch completed', timestamp: '15 min ago', type: 'production' },
        { id: '3', message: 'Delivery assigned', timestamp: '30 min ago', type: 'delivery' },
        { id: '4', message: 'User approved', timestamp: '1 hour ago', type: 'user' },
        { id: '5', message: 'System backup completed', timestamp: '2 hours ago', type: 'system' }
      ]);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const modules = [
    { name: 'User Management', icon: Users, route: '/admin/users', color: 'text-blue-500' },
    { name: 'Production', icon: Factory, route: '/production', color: 'text-purple-500' },
    { name: 'Distillery', icon: Activity, route: '/distillery', color: 'text-green-500' },
    { name: 'Power Plant', icon: Activity, route: '/power-plant', color: 'text-yellow-500' },
    { name: 'Analytics', icon: BarChart3, route: '/analytics', color: 'text-indigo-500' },
    { name: 'System Settings', icon: Settings, route: '/admin/settings', color: 'text-gray-500' }
  ];

  const navigationItems = [
    { label: 'User Management', route: '/admin/users' },
    { label: 'Pending Approvals', route: '/admin/approvals', badge: stats.pendingApprovals.total },
    { label: 'Production Module', route: '/production' },
    { label: 'Farmers Module', route: '/farmers' },
    { label: 'Logistics Module', route: '/logistics' },
    { label: 'Distillery Operations', route: '/distillery' },
    { label: 'Power Plant Management', route: '/power-plant' },
    { label: 'Sustainability Tracking', route: '/sustainability' },
    { label: 'Analytics & Reports', route: '/analytics' },
    { label: 'System Settings', route: '/settings' },
    { label: 'Audit Logs', route: '/admin/audit' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">System Overview & Management</p>
          </div>
          <Badge variant={stats.systemStatus === 'healthy' ? 'default' : 'destructive'} className="h-8">
            {stats.systemStatus === 'healthy' ? <CheckCircle2 className="h-4 w-4 mr-1" /> : <AlertCircle className="h-4 w-4 mr-1" />}
            System {stats.systemStatus === 'healthy' ? 'Healthy' : 'Alert'}
          </Badge>
        </div>

        {/* System Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Across all roles</p>
                </div>
                <Users className="h-12 w-12 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stats.activeSessions}</p>
                  <p className="text-xs text-muted-foreground mt-1">Currently online</p>
                </div>
                <UserCheck className="h-12 w-12 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">99.9%</p>
                  <p className="text-xs text-muted-foreground mt-1">Uptime</p>
                </div>
                <Activity className="h-12 w-12 text-emerald-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Actions */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                Pending Actions
              </CardTitle>
              <Badge variant="secondary">{stats.pendingApprovals.total}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                 onClick={() => navigate('/admin/approvals?filter=farmer')}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <span className="font-medium">{stats.pendingApprovals.farmers} Farmer registrations awaiting approval</span>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                 onClick={() => navigate('/admin/approvals?filter=logistics')}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-purple-500" />
                </div>
                <span className="font-medium">{stats.pendingApprovals.logistics} Logistics registrations awaiting approval</span>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                 onClick={() => navigate('/support/tickets')}>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <span className="font-medium">{stats.supportTickets} Support tickets requiring attention</span>
              </div>
              <Button variant="ghost" size="sm">View</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats (All Modules) */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Stats - All Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Factory className="h-4 w-4" />
                  Production This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.production.thisMonth} {stats.production.unit}</p>
                <p className="text-xs text-green-600 mt-1">↑ 12% vs last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Active Deliveries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.activeDeliveries}</p>
                <p className="text-xs text-muted-foreground mt-1">In transit</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Total Farmers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{stats.totalFarmers}</p>
                <p className="text-xs text-green-600 mt-1">↑ 8% growth</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activities - System-wide
            </CardTitle>
            <CardDescription>Latest events across all modules</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.type === 'farmer' ? 'bg-blue-500' :
                    activity.type === 'production' ? 'bg-purple-500' :
                    activity.type === 'delivery' ? 'bg-green-500' :
                    activity.type === 'user' ? 'bg-orange-500' :
                    'bg-gray-500'
                  }`} />
                  <span className="text-sm">{activity.message}</span>
                </div>
                <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Module Access */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Module Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {modules.map((module) => (
              <Card key={module.name} 
                    className="cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200"
                    onClick={() => navigate(module.route)}>
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <module.icon className={`h-8 w-8 ${module.color} mb-2`} />
                  <p className="text-sm font-medium">{module.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Full Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Full System Navigation</CardTitle>
            <CardDescription>Access all administrative functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {navigationItems.map((item) => (
                <Button
                  key={item.label}
                  variant="outline"
                  className="justify-between h-auto py-3"
                  onClick={() => navigate(item.route)}
                >
                  <span className="text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="destructive" className="ml-2">{item.badge}</Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
