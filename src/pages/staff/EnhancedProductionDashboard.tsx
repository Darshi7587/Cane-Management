import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Factory, CheckCircle2, AlertCircle, Clock, TrendingUp,
  Activity, FileText, Package, Settings, Hammer, AlertTriangle
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ProductionBatch {
  id: string;
  batchNumber: string;
  stage: string;
  progress: number;
  startTime: string;
}

interface Equipment {
  id: string;
  name: string;
  status: 'operational' | 'maintenance' | 'offline';
  lastMaintenance: string;
}

export default function EnhancedProductionDashboard() {
  const navigate = useNavigate();
  const [staffName, setStaffName] = useState('Production Manager');
  const [employeeId] = useState('PR12345');
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    activeBatches: 3,
    completedToday: 5,
    qualityPass: 92
  });

  const [batches, setBatches] = useState<ProductionBatch[]>([
    { id: '1', batchNumber: 'PB-2024-1025-01', stage: 'Crushing', progress: 60, startTime: '08:00 AM' },
    { id: '2', batchNumber: 'PB-2024-1025-02', stage: 'Boiling', progress: 30, startTime: '09:30 AM' },
    { id: '3', batchNumber: 'PB-2024-1025-03', stage: 'Crystallization', progress: 85, startTime: '07:15 AM' }
  ]);

  const [equipment, setEquipment] = useState<Equipment[]>([
    { id: '1', name: 'Crusher Unit 1', status: 'operational', lastMaintenance: '2 days ago' },
    { id: '2', name: 'Crusher Unit 2', status: 'maintenance', lastMaintenance: '1 week ago' },
    { id: '3', name: 'Boiler 1', status: 'operational', lastMaintenance: '3 days ago' },
    { id: '4', name: 'Boiler 2', status: 'operational', lastMaintenance: '1 day ago' }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setStaffName(userData.name || 'Production Manager');
      
      // Fetch from API
      const response = await fetch(`${API_BASE_URL}/staff/production/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Update with real data when available
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const navigationItems = [
    { label: 'Production Batches', icon: Factory, route: '/staff/production/batches' },
    { label: 'Quality Control', icon: CheckCircle2, route: '/staff/production/quality' },
    { label: 'Inventory Management', icon: Package, route: '/staff/production/inventory' },
    { label: 'Equipment Monitoring', icon: Settings, route: '/staff/production/equipment' },
    { label: 'Production Reports', icon: FileText, route: '/staff/production/reports' },
    { label: 'My Profile', icon: Activity, route: '/profile' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Activity className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Production Dashboard</h1>
            <p className="text-muted-foreground">Welcome, <span className="font-medium">{staffName}</span></p>
            <p className="text-sm text-muted-foreground">Department: Production | Employee ID: {employeeId}</p>
          </div>
          <Badge variant="default" className="h-8">
            <Activity className="h-4 w-4 mr-1" />
            On Duty
          </Badge>
        </div>

        {/* Today's Production Stats */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Today's Production</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Batches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{stats.activeBatches}</p>
                    <p className="text-xs text-muted-foreground mt-1">Currently processing</p>
                  </div>
                  <Factory className="h-12 w-12 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{stats.completedToday}</p>
                    <p className="text-xs text-green-600 mt-1">+2 from yesterday</p>
                  </div>
                  <CheckCircle2 className="h-12 w-12 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-emerald-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Quality Pass Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{stats.qualityPass}%</p>
                    <p className="text-xs text-muted-foreground mt-1">Above target</p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-emerald-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Active Production Batches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5 text-primary" />
              Active Production Batches
            </CardTitle>
            <CardDescription>Real-time batch monitoring and progress tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {batches.map((batch, index) => (
              <div key={batch.id} className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{index + 1}. Batch #{batch.batchNumber}</p>
                    <p className="text-sm text-muted-foreground">Started: {batch.startTime}</p>
                  </div>
                  <Badge variant={batch.progress > 80 ? 'default' : 'secondary'}>
                    {batch.stage}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{batch.progress}%</span>
                  </div>
                  <Progress value={batch.progress} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Equipment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Equipment Status
            </CardTitle>
            <CardDescription>Monitor equipment health and maintenance schedule</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {equipment.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    item.status === 'operational' ? 'bg-green-500/10' :
                    item.status === 'maintenance' ? 'bg-orange-500/10' :
                    'bg-red-500/10'
                  }`}>
                    {item.status === 'operational' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : item.status === 'maintenance' ? (
                      <Hammer className="h-5 w-5 text-orange-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Last maintenance: {item.lastMaintenance}</p>
                  </div>
                </div>
                <Badge variant={
                  item.status === 'operational' ? 'default' :
                  item.status === 'maintenance' ? 'secondary' :
                  'destructive'
                }>
                  {item.status === 'operational' ? 'Operational ✓' :
                   item.status === 'maintenance' ? 'Maintenance Required ⚠' :
                   'Offline'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/staff/production/new-batch')}>
              <Factory className="h-6 w-6" />
              <span>Create New Batch</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/staff/production/quality-check')}>
              <CheckCircle2 className="h-6 w-6" />
              <span>Record Quality Check</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/staff/production/inventory')}>
              <Package className="h-6 w-6" />
              <span>View Inventory</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/staff/production/reports')}>
              <FileText className="h-6 w-6" />
              <span>Generate Report</span>
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
            <CardDescription>Access production management functions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {navigationItems.map((item) => (
                <Button
                  key={item.label}
                  variant="outline"
                  className="justify-start h-auto py-3"
                  onClick={() => navigate(item.route)}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
