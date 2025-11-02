import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, XCircle, Clock, TrendingUp, Activity, 
  FileText, TestTube, AlertTriangle, ClipboardCheck, BarChart3
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface TestResult {
  id: string;
  testNumber: string;
  batchNumber: string;
  testType: string;
  result: 'Pass' | 'Fail' | 'Pending';
  timestamp: string;
  parameters: {
    name: string;
    value: string;
    status: 'pass' | 'fail';
  }[];
}

interface PendingTest {
  id: string;
  batchNumber: string;
  testType: string;
  priority: 'high' | 'medium' | 'low';
  scheduledTime: string;
}

export default function EnhancedQualityDashboard() {
  const navigate = useNavigate();
  const [staffName, setStaffName] = useState('Quality Controller');
  const [employeeId] = useState('QC12345');
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    testsCompleted: 24,
    testsPending: 8,
    complianceRate: 94.5
  });

  const [recentTests, setRecentTests] = useState<TestResult[]>([
    {
      id: '1',
      testNumber: 'QT-2024-1025-001',
      batchNumber: 'PB-2024-1025-01',
      testType: 'Sugar Content Analysis',
      result: 'Pass',
      timestamp: '10 min ago',
      parameters: [
        { name: 'Brix Level', value: '18.5°', status: 'pass' },
        { name: 'Purity', value: '96.2%', status: 'pass' }
      ]
    },
    {
      id: '2',
      testNumber: 'QT-2024-1025-002',
      batchNumber: 'PB-2024-1025-02',
      testType: 'Moisture Content',
      result: 'Pass',
      timestamp: '25 min ago',
      parameters: [
        { name: 'Moisture %', value: '0.5%', status: 'pass' }
      ]
    },
    {
      id: '3',
      testNumber: 'QT-2024-1025-003',
      batchNumber: 'PB-2024-1024-15',
      testType: 'Color Grade Test',
      result: 'Fail',
      timestamp: '1 hour ago',
      parameters: [
        { name: 'Color Index', value: '450 IU', status: 'fail' },
        { name: 'Turbidity', value: 'High', status: 'fail' }
      ]
    }
  ]);

  const [pendingTests, setPendingTests] = useState<PendingTest[]>([
    { id: '1', batchNumber: 'PB-2024-1025-03', testType: 'Final Quality Check', priority: 'high', scheduledTime: 'Now' },
    { id: '2', batchNumber: 'PB-2024-1025-04', testType: 'Mid-Process Test', priority: 'medium', scheduledTime: '30 min' },
    { id: '3', batchNumber: 'PB-2024-1025-05', testType: 'Initial Screening', priority: 'low', scheduledTime: '2 hours' }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setStaffName(userData.name || 'Quality Controller');
      
      const response = await fetch(`${API_BASE_URL}/staff/quality/dashboard`, {
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
    { label: 'Quality Tests', icon: TestTube, route: '/staff/quality/tests' },
    { label: 'Test Results', icon: ClipboardCheck, route: '/staff/quality/results' },
    { label: 'Compliance Reports', icon: FileText, route: '/staff/quality/compliance' },
    { label: 'Standards & SOPs', icon: FileText, route: '/staff/quality/standards' },
    { label: 'Analytics', icon: BarChart3, route: '/staff/quality/analytics' },
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
            <h1 className="text-3xl font-bold text-foreground mb-1">Quality Control Dashboard</h1>
            <p className="text-muted-foreground">Welcome, <span className="font-medium">{staffName}</span></p>
            <p className="text-sm text-muted-foreground">Department: Quality Control | Employee ID: {employeeId}</p>
          </div>
          <Badge variant="default" className="h-8">
            <ClipboardCheck className="h-4 w-4 mr-1" />
            On Duty
          </Badge>
        </div>

        {/* Today's Quality Stats */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Today's Quality Control</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tests Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{stats.testsCompleted}</p>
                    <p className="text-xs text-muted-foreground mt-1">Today</p>
                  </div>
                  <CheckCircle2 className="h-12 w-12 text-green-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tests Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{stats.testsPending}</p>
                    <p className="text-xs text-orange-600 mt-1">Requires attention</p>
                  </div>
                  <Clock className="h-12 w-12 text-orange-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold">{stats.complianceRate}%</p>
                    <p className="text-xs text-green-600 mt-1">Above target</p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Test Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-primary" />
              Recent Test Results
            </CardTitle>
            <CardDescription>Latest quality control test outcomes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTests.map((test) => (
              <div key={test.id} className="p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{test.testNumber}</p>
                    <p className="text-sm text-muted-foreground">Batch: {test.batchNumber} • {test.testType}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{test.timestamp}</span>
                    <Badge variant={
                      test.result === 'Pass' ? 'default' :
                      test.result === 'Fail' ? 'destructive' :
                      'secondary'
                    }>
                      {test.result === 'Pass' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                      {test.result === 'Fail' && <XCircle className="h-3 w-3 mr-1" />}
                      {test.result}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {test.parameters.map((param, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/30 text-sm">
                      <span className="text-muted-foreground">{param.name}:</span>
                      <span className={`font-medium ${param.status === 'pass' ? 'text-green-600' : 'text-red-600'}`}>
                        {param.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Pending Tests
            </CardTitle>
            <CardDescription>Scheduled quality control tests awaiting execution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingTests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    test.priority === 'high' ? 'bg-red-500/10' :
                    test.priority === 'medium' ? 'bg-orange-500/10' :
                    'bg-blue-500/10'
                  }`}>
                    <TestTube className={`h-5 w-5 ${
                      test.priority === 'high' ? 'text-red-500' :
                      test.priority === 'medium' ? 'text-orange-500' :
                      'text-blue-500'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">{test.batchNumber} - {test.testType}</p>
                    <p className="text-xs text-muted-foreground">Scheduled: {test.scheduledTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    test.priority === 'high' ? 'destructive' :
                    test.priority === 'medium' ? 'secondary' :
                    'outline'
                  }>
                    {test.priority.toUpperCase()}
                  </Badge>
                  <Button size="sm" variant="outline">Start Test</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/staff/quality/new-test')}>
              <TestTube className="h-6 w-6" />
              <span>New Test</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/staff/quality/results')}>
              <ClipboardCheck className="h-6 w-6" />
              <span>View Results</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/staff/quality/compliance')}>
              <FileText className="h-6 w-6" />
              <span>Compliance Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2" onClick={() => navigate('/staff/quality/analytics')}>
              <BarChart3 className="h-6 w-6" />
              <span>Analytics</span>
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle>Navigation</CardTitle>
            <CardDescription>Access quality control functions</CardDescription>
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
