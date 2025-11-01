import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LifeBuoy, AlertTriangle, CheckCircle2, Clock, Activity, 
  FileText, Calendar, Wrench, MessageSquare, BarChart3
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Ticket {
  id: string;
  ticketNumber: string;
  title: string;
  requester: string;
  department: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  createdAt: string;
}

interface MaintenanceTask {
  id: string;
  equipment: string;
  taskType: string;
  scheduledDate: string;
  priority: 'urgent' | 'scheduled' | 'routine';
  status: 'pending' | 'in-progress' | 'completed';
}

interface EquipmentAlert {
  id: string;
  equipment: string;
  alertType: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
}

export default function EnhancedSupportDashboard() {
  const navigate = useNavigate();
  const [staffName, setStaffName] = useState('Support Engineer');
  const [employeeId] = useState('SP12345');
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    openTickets: 12,
    resolvedToday: 8,
    avgResponseTime: '15 min'
  });

  const [activeTickets, setActiveTickets] = useState<Ticket[]>([
    {
      id: '1',
      ticketNumber: 'TKT-2024-1025-001',
      title: 'Crusher Unit 2 - Unusual Vibration',
      requester: 'Rajesh Kumar',
      department: 'Production',
      priority: 'critical',
      status: 'in-progress',
      createdAt: '15 min ago'
    },
    {
      id: '2',
      ticketNumber: 'TKT-2024-1025-002',
      title: 'Boiler Pressure Gauge Malfunction',
      requester: 'Priya Singh',
      department: 'Production',
      priority: 'high',
      status: 'open',
      createdAt: '45 min ago'
    },
    {
      id: '3',
      ticketNumber: 'TKT-2024-1025-003',
      title: 'Conveyor Belt Speed Issue',
      requester: 'Amit Sharma',
      department: 'Logistics',
      priority: 'medium',
      status: 'open',
      createdAt: '2 hours ago'
    },
    {
      id: '4',
      ticketNumber: 'TKT-2024-1024-045',
      title: 'Quality Testing Equipment Calibration',
      requester: 'Sneha Patel',
      department: 'Quality Control',
      priority: 'low',
      status: 'in-progress',
      createdAt: '1 day ago'
    }
  ]);

  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([
    {
      id: '1',
      equipment: 'Crusher Unit 1',
      taskType: 'Preventive Maintenance',
      scheduledDate: 'Today, 2:00 PM',
      priority: 'urgent',
      status: 'pending'
    },
    {
      id: '2',
      equipment: 'Boiler System',
      taskType: 'Safety Inspection',
      scheduledDate: 'Tomorrow, 10:00 AM',
      priority: 'scheduled',
      status: 'pending'
    },
    {
      id: '3',
      equipment: 'Conveyor System',
      taskType: 'Routine Check',
      scheduledDate: 'Nov 3, 9:00 AM',
      priority: 'routine',
      status: 'pending'
    }
  ]);

  const [equipmentAlerts, setEquipmentAlerts] = useState<EquipmentAlert[]>([
    {
      id: '1',
      equipment: 'Crusher Unit 2',
      alertType: 'critical',
      message: 'Temperature exceeding safe limits (95°C)',
      timestamp: '5 min ago'
    },
    {
      id: '2',
      equipment: 'Pump Station 3',
      alertType: 'warning',
      message: 'Pressure drop detected - requires inspection',
      timestamp: '20 min ago'
    },
    {
      id: '3',
      equipment: 'Boiler 1',
      alertType: 'info',
      message: 'Scheduled maintenance due in 2 days',
      timestamp: '1 hour ago'
    }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setStaffName(userData.name || 'Support Engineer');
      
      const response = await fetch(`${API_BASE_URL}/staff/support/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        // Update with real data
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const navigationItems = [
    { label: 'Ticket Queue', icon: MessageSquare, route: '/staff/support/tickets' },
    { label: 'Maintenance Log', icon: Wrench, route: '/staff/support/maintenance' },
    { label: 'Equipment Status', icon: Activity, route: '/staff/support/equipment' },
    { label: 'Knowledge Base', icon: FileText, route: '/staff/support/knowledge-base' },
    { label: 'Reports', icon: BarChart3, route: '/staff/support/reports' },
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
            <h1 className="text-3xl font-bold text-foreground mb-1">Support & Maintenance Dashboard</h1>
            <p className="text-muted-foreground">Welcome, <span className="font-medium">{staffName}</span></p>
            <p className="text-sm text-muted-foreground">Department: Technical Support | Employee ID: {employeeId}</p>
          </div>
          <Badge variant="default" className="h-8">
            <LifeBuoy className="h-4 w-4 mr-1" />
            On Duty
          </Badge>
        </div>

        {/* Support Metrics */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Today's Support Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Open Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{stats.openTickets}</p>
                    <p className="text-xs text-orange-600 mt-1">Requires attention</p>
                  </div>
                  <MessageSquare className="h-12 w-12 text-orange-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{stats.resolvedToday}</p>
                    <p className="text-xs text-green-600 mt-1">+3 from yesterday</p>
                  </div>
                  <CheckCircle2 className="h-12 w-12 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{stats.avgResponseTime}</p>
                    <p className="text-xs text-green-600 mt-1">Below target</p>
                  </div>
                  <Clock className="h-12 w-12 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Equipment Alerts */}
        <Card className="border-red-500/20 border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Equipment Alerts
            </CardTitle>
            <CardDescription>Critical equipment issues requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {equipmentAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                alert.alertType === 'critical' ? 'border-l-red-500 bg-red-500/5' :
                alert.alertType === 'warning' ? 'border-l-orange-500 bg-orange-500/5' :
                'border-l-blue-500 bg-blue-500/5'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${
                      alert.alertType === 'critical' ? 'text-red-500' :
                      alert.alertType === 'warning' ? 'text-orange-500' :
                      'text-blue-500'
                    }`}>
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{alert.equipment}</p>
                      <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                    </div>
                  </div>
                  <Badge variant={
                    alert.alertType === 'critical' ? 'destructive' :
                    alert.alertType === 'warning' ? 'secondary' :
                    'outline'
                  }>
                    {alert.alertType.toUpperCase()}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Tickets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Active Support Tickets
            </CardTitle>
            <CardDescription>Current tickets requiring resolution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activeTickets.map((ticket) => (
              <div key={ticket.id} className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground">{ticket.ticketNumber}</p>
                    <p className="text-sm text-foreground mt-1">{ticket.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {ticket.requester} • {ticket.department} • {ticket.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      ticket.priority === 'critical' ? 'destructive' :
                      ticket.priority === 'high' ? 'secondary' :
                      ticket.priority === 'medium' ? 'outline' :
                      'outline'
                    }>
                      {ticket.priority.toUpperCase()}
                    </Badge>
                    <Badge variant={
                      ticket.status === 'in-progress' ? 'default' :
                      ticket.status === 'resolved' ? 'secondary' :
                      'outline'
                    }>
                      {ticket.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="default">View Details</Button>
                  {ticket.status === 'open' && (
                    <Button size="sm" variant="outline">Assign to Me</Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Maintenance Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Maintenance
            </CardTitle>
            <CardDescription>Scheduled maintenance tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {maintenanceTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    task.priority === 'urgent' ? 'bg-red-500/10' :
                    task.priority === 'scheduled' ? 'bg-blue-500/10' :
                    'bg-green-500/10'
                  }`}>
                    <Wrench className={`h-5 w-5 ${
                      task.priority === 'urgent' ? 'text-red-500' :
                      task.priority === 'scheduled' ? 'text-blue-500' :
                      'text-green-500'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">{task.equipment} - {task.taskType}</p>
                    <p className="text-xs text-muted-foreground">Scheduled: {task.scheduledDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    task.priority === 'urgent' ? 'destructive' :
                    task.priority === 'scheduled' ? 'secondary' :
                    'outline'
                  }>
                    {task.priority.toUpperCase()}
                  </Badge>
                  <Button size="sm" variant="outline">Start</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/staff/support/tickets/new')}>
              <MessageSquare className="h-6 w-6" />
              <span>Create Ticket</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/staff/support/maintenance/schedule')}>
              <Calendar className="h-6 w-6" />
              <span>Schedule Maintenance</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/staff/support/equipment')}>
              <Activity className="h-6 w-6" />
              <span>Equipment Status</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/staff/support/reports')}>
              <BarChart3 className="h-6 w-6" />
              <span>Generate Report</span>
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
            <CardDescription>Access support & maintenance functions</CardDescription>
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
