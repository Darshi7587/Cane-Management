import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, UserCheck, UserPlus, TrendingUp, Activity, 
  FileText, Calendar, DollarSign, Briefcase, BarChart3
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Application {
  id: string;
  applicantName: string;
  position: string;
  department: string;
  status: 'pending' | 'interview' | 'shortlisted' | 'rejected';
  appliedDate: string;
}

interface AttendanceRecord {
  date: string;
  present: number;
  absent: number;
  onLeave: number;
  total: number;
}

export default function EnhancedHRDashboard() {
  const navigate = useNavigate();
  const [staffName, setStaffName] = useState('HR Manager');
  const [employeeId] = useState('HR12345');
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalEmployees: 247,
    attendanceRate: 96.5,
    openPositions: 5
  });

  const [recentApplications, setRecentApplications] = useState<Application[]>([
    {
      id: '1',
      applicantName: 'Rahul Verma',
      position: 'Production Supervisor',
      department: 'Production',
      status: 'pending',
      appliedDate: '2 days ago'
    },
    {
      id: '2',
      applicantName: 'Priya Singh',
      position: 'Quality Analyst',
      department: 'Quality Control',
      status: 'interview',
      appliedDate: '3 days ago'
    },
    {
      id: '3',
      applicantName: 'Amit Kumar',
      position: 'Logistics Coordinator',
      department: 'Logistics',
      status: 'shortlisted',
      appliedDate: '5 days ago'
    },
    {
      id: '4',
      applicantName: 'Sneha Patel',
      position: 'HR Assistant',
      department: 'Human Resources',
      status: 'pending',
      appliedDate: '1 week ago'
    }
  ]);

  const [attendanceToday, setAttendanceToday] = useState<AttendanceRecord>({
    date: 'November 1, 2024',
    present: 238,
    absent: 3,
    onLeave: 6,
    total: 247
  });

  const [upcomingPayroll] = useState({
    period: 'October 2024',
    employeesCount: 247,
    totalAmount: '₹45,67,890',
    processingDate: 'November 5, 2024'
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setStaffName(userData.name || 'HR Manager');
      
      const response = await fetch(`${API_BASE_URL}/staff/hr/dashboard`, {
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
    { label: 'Employee Directory', icon: Users, route: '/staff/hr/employees' },
    { label: 'Recruitment', icon: UserPlus, route: '/staff/hr/recruitment' },
    { label: 'Attendance', icon: Calendar, route: '/staff/hr/attendance' },
    { label: 'Payroll', icon: DollarSign, route: '/staff/hr/payroll' },
    { label: 'Training', icon: Briefcase, route: '/staff/hr/training' },
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
            <h1 className="text-3xl font-bold text-foreground mb-1">Human Resources Dashboard</h1>
            <p className="text-muted-foreground">Welcome, <span className="font-medium">{staffName}</span></p>
            <p className="text-sm text-muted-foreground">Department: Human Resources | Employee ID: {employeeId}</p>
          </div>
          <Badge variant="default" className="h-8">
            <UserCheck className="h-4 w-4 mr-1" />
            On Duty
          </Badge>
        </div>

        {/* HR Metrics */}
        <div>
          <h2 className="text-xl font-semibold mb-4">HR Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{stats.totalEmployees}</p>
                    <p className="text-xs text-green-600 mt-1">+8 this month</p>
                  </div>
                  <Users className="h-12 w-12 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Attendance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{stats.attendanceRate}%</p>
                    <p className="text-xs text-green-600 mt-1">Above target</p>
                  </div>
                  <UserCheck className="h-12 w-12 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Open Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{stats.openPositions}</p>
                    <p className="text-xs text-orange-600 mt-1">Actively hiring</p>
                  </div>
                  <UserPlus className="h-12 w-12 text-orange-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Recent Job Applications
            </CardTitle>
            <CardDescription>Latest applications requiring review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{app.applicantName}</p>
                    <p className="text-sm text-muted-foreground">{app.position} • {app.department}</p>
                    <p className="text-xs text-muted-foreground">Applied: {app.appliedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    app.status === 'shortlisted' ? 'default' :
                    app.status === 'interview' ? 'secondary' :
                    app.status === 'pending' ? 'outline' :
                    'destructive'
                  }>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                  <Button size="sm" variant="outline">Review</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Attendance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Today's Attendance
              </CardTitle>
              <CardDescription>{attendanceToday.date}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Present</span>
                </div>
                <span className="text-2xl font-bold text-green-600">{attendanceToday.present}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-red-600" />
                  <span className="font-medium">Absent</span>
                </div>
                <span className="text-2xl font-bold text-red-600">{attendanceToday.absent}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">On Leave</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">{attendanceToday.onLeave}</span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Attendance Rate</span>
                  <span className="text-lg font-semibold text-foreground">
                    {((attendanceToday.present / attendanceToday.total) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payroll Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Upcoming Payroll
              </CardTitle>
              <CardDescription>Next payroll processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200/20">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Period</span>
                    <span className="font-medium">{upcomingPayroll.period}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Employees</span>
                    <span className="font-medium">{upcomingPayroll.employeesCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Amount</span>
                    <span className="text-xl font-bold text-green-600">{upcomingPayroll.totalAmount}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-green-200/20">
                    <span className="text-sm text-muted-foreground">Processing Date</span>
                    <span className="font-semibold text-foreground">{upcomingPayroll.processingDate}</span>
                  </div>
                </div>
              </div>
              <Button className="w-full" variant="default">
                <DollarSign className="h-4 w-4 mr-2" />
                Process Payroll
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/staff/hr/recruitment')}>
              <UserPlus className="h-6 w-6" />
              <span>Post Job</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/staff/hr/attendance/mark')}>
              <Calendar className="h-6 w-6" />
              <span>Mark Attendance</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/staff/hr/payroll')}>
              <DollarSign className="h-6 w-6" />
              <span>Payroll</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/staff/hr/reports')}>
              <BarChart3 className="h-6 w-6" />
              <span>Reports</span>
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
            <CardDescription>Access HR management functions</CardDescription>
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
