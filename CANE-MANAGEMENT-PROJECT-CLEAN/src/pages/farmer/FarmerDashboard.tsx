import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardCard } from '@/components/DashboardCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  Truck,
  IndianRupee,
  Leaf,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Settings,
  LogOut
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface FarmerData {
  name: string;
  email: string;
  digitalFarmerId: string;
  totalLand: number;
  seasonYield: number;
  pendingPayment: number;
  recentActivities: Array<{
    type: string;
    description: string;
    time?: string;
    date?: string;
    amount?: number;
  }>;
  upcomingPickups: Array<{
    date: string;
    time: string;
    vehicle: string;
    status: string;
  }>;
}

export default function FarmerDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [farmerData, setFarmerData] = useState<FarmerData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFarmerData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        console.log('⚠️ No token found, redirecting to login');
        setLoading(false);
        navigate('/login', { replace: true });
        return;
      }

      console.log('✅ Token found, fetching farmer profile...');

      // Fetch farmer profile
      const response = await fetch(`${API_BASE_URL}/farmers/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Response status:', response.status);

      if (response.status === 401) {
        // Token is invalid or expired - clear storage and redirect to login
        console.log('❌ Token invalid (401), clearing storage');
        localStorage.clear();
        setLoading(false);
        navigate('/login', { replace: true });
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`Failed to fetch farmer data: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Farmer data received:', data);
      
      // Set farmer data from API response
      setFarmerData({
        name: data.name || 'Farmer',
        email: data.email || '',
        digitalFarmerId: data.digitalFarmerId || 'N/A',
        totalLand: data.totalLand || 0,
        seasonYield: data.seasonYield || 0,
        pendingPayment: data.pendingPayment || 0,
        recentActivities: data.recentActivities || [],
        upcomingPickups: data.upcomingPickups || []
      });
    } catch (err) {
      console.error('Error fetching farmer data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchFarmerData();
  }, [fetchFarmerData]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Welcome, {farmerData?.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Digital Farmer ID: <span className="font-mono">{farmerData?.digitalFarmerId}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                Verified
              </Badge>
              <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Quick Stats */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Land</p>
                    <p className="text-3xl font-bold text-foreground">{farmerData?.totalLand} acres</p>
                  </div>
                  <MapPin className="h-12 w-12 text-emerald-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">This Season</p>
                    <p className="text-3xl font-bold text-foreground">{farmerData?.seasonYield} tons</p>
                  </div>
                  <TrendingUp className="h-12 w-12 text-blue-500 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Pending Payment</p>
                    <p className="text-3xl font-bold text-foreground">₹{(farmerData?.pendingPayment || 0).toLocaleString()}</p>
                  </div>
                  <IndianRupee className="h-12 w-12 text-orange-500 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Activities & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {farmerData?.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'yield' ? 'bg-blue-500/10 text-blue-500' :
                      activity.type === 'payment' ? 'bg-emerald-500/10 text-emerald-500' :
                      'bg-orange-500/10 text-orange-500'
                    }`}>
                      {activity.type === 'yield' ? <TrendingUp className="h-4 w-4" /> :
                       activity.type === 'payment' ? <IndianRupee className="h-4 w-4" /> :
                       <Truck className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{activity.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.date}
                        {activity.amount && activity.type !== 'payment' && ` (${activity.amount} tons)`}
                        {activity.amount && activity.type === 'payment' && ` (₹${activity.amount.toLocaleString()})`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks and operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  <span className="text-xs">Submit New Yield</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <IndianRupee className="h-6 w-6 text-primary" />
                  <span className="text-xs">Payment History</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Truck className="h-6 w-6 text-primary" />
                  <span className="text-xs">Schedule Pickup</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col gap-2">
                  <Leaf className="h-6 w-6 text-primary" />
                  <span className="text-xs">Sustainability Report</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Pickups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Pickups
            </CardTitle>
            <CardDescription>Scheduled collection dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {farmerData?.upcomingPickups.map((pickup, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Truck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{pickup.date}, {pickup.time}</p>
                      <p className="text-sm text-muted-foreground">Vehicle: {pickup.vehicle}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                    {pickup.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Navigation</CardTitle>
            <CardDescription>Access all farmer portal features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: MapPin, label: 'My Farms', path: '/farmer/farms' },
                { icon: TrendingUp, label: 'Submit Yields', path: '/farmer/yields' },
                { icon: IndianRupee, label: 'Payment History', path: '/farmer/payments' },
                { icon: Calendar, label: 'Pickup Schedule', path: '/farmer/pickups' },
                { icon: Leaf, label: 'Sustainability', path: '/farmer/sustainability' },
                { icon: FileText, label: 'Documents', path: '/farmer/documents' },
                { icon: Settings, label: 'Profile & Settings', path: '/farmer/settings' },
                { icon: AlertCircle, label: 'Help & Support', path: '/farmer/support' }
              ].map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-24 flex-col gap-2"
                  onClick={() => navigate(item.path)}
                >
                  <item.icon className="h-6 w-6 text-primary" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
