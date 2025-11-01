import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Truck,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Settings,
  LogOut,
  TrendingUp,
  AlertTriangle,
  Navigation,
  FileText,
  Users,
  Calendar,
} from "lucide-react";

interface LogisticsData {
  companyName: string;
  email: string;
  contactPerson: string;
  fleetSize: number;
  activeVehicles: number;
  activeDeliveries: number;
  completedThisMonth: number;
  rating: number;
  recentDeliveries: Array<{
    id: string;
    vehicleNumber: string;
    destination: string;
    eta: string;
    status: string;
    lat?: number;
    lng?: number;
  }>;
  pendingPickups: Array<{
    id: string;
    farmerName: string;
    location: string;
    tons: number;
    urgency: string;
    requestDate: string;
  }>;
  fleetStatus: Array<{
    vehicleNumber: string;
    type: string;
    status: string;
    currentLocation: string;
  }>;
}

export default function LogisticsDashboard() {
  const navigate = useNavigate();
  const [logisticsData, setLogisticsData] = useState<LogisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchLogisticsData();
  }, []);

  const fetchLogisticsData = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/logistics/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch logistics data");
      }

      const data = await response.json();
      setLogisticsData(data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !logisticsData) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error || "Failed to load dashboard"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-100 p-3 rounded-lg">
                <Truck className="h-8 w-8 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{logisticsData.companyName}</h1>
                <p className="text-sm text-gray-600">
                  {logisticsData.contactPerson} • Rating: {logisticsData.rating.toFixed(1)} ⭐
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={() => navigate("/settings")}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Active Deliveries</p>
                  <p className="text-3xl font-bold mt-2">{logisticsData.activeDeliveries}</p>
                </div>
                <Package className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Completed This Month</p>
                  <p className="text-3xl font-bold mt-2">{logisticsData.completedThisMonth}</p>
                </div>
                <CheckCircle2 className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Fleet Status</p>
                  <p className="text-3xl font-bold mt-2">
                    {logisticsData.activeVehicles}/{logisticsData.fleetSize}
                  </p>
                  <p className="text-purple-200 text-xs mt-1">Active Vehicles</p>
                </div>
                <Truck className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Rating</p>
                  <p className="text-3xl font-bold mt-2">{logisticsData.rating.toFixed(1)}</p>
                  <p className="text-orange-200 text-xs mt-1">⭐⭐⭐⭐⭐</p>
                </div>
                <TrendingUp className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Live Map View */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                Live Delivery Tracking
              </CardTitle>
              <CardDescription>Real-time vehicle locations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">Interactive Map View</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {logisticsData.activeDeliveries} active deliveries
                  </p>
                  <Button variant="outline" size="sm" className="mt-4">
                    View Full Map
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Deliveries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-blue-600" />
                Active Deliveries
              </CardTitle>
              <CardDescription>Deliveries in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {logisticsData.recentDeliveries.length > 0 ? (
                  logisticsData.recentDeliveries.map((delivery) => (
                    <div
                      key={delivery.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded">
                          <Truck className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{delivery.vehicleNumber}</p>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {delivery.destination}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={delivery.status === "in-transit" ? "default" : "secondary"}
                        >
                          {delivery.status}
                        </Badge>
                        <p className="text-xs text-gray-600 mt-1 flex items-center justify-end">
                          <Clock className="h-3 w-3 mr-1" />
                          ETA: {delivery.eta}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">No active deliveries</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pending Pickup Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2 text-orange-600" />
                Pending Pickup Requests
              </CardTitle>
              <CardDescription>Awaiting assignment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {logisticsData.pendingPickups.length > 0 ? (
                  logisticsData.pendingPickups.map((pickup) => (
                    <div
                      key={pickup.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{pickup.farmerName}</p>
                        <p className="text-sm text-gray-600">{pickup.location}</p>
                        <p className="text-xs text-gray-500 mt-1">{pickup.tons} tons</p>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge
                          variant={pickup.urgency === "high" ? "destructive" : "secondary"}
                        >
                          {pickup.urgency}
                        </Badge>
                        <Button size="sm">Assign Vehicle</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">No pending pickups</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Fleet Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2 text-purple-600" />
                Fleet Status
              </CardTitle>
              <CardDescription>Vehicle availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {logisticsData.fleetStatus.length > 0 ? (
                  logisticsData.fleetStatus.map((vehicle, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{vehicle.vehicleNumber}</p>
                        <p className="text-sm text-gray-600">{vehicle.type}</p>
                        <p className="text-xs text-gray-500">{vehicle.currentLocation}</p>
                      </div>
                      <Badge
                        variant={
                          vehicle.status === "operational"
                            ? "default"
                            : vehicle.status === "in-transit"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {vehicle.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">No fleet data</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate("/logistics/assign-delivery")}
              >
                <Navigation className="h-6 w-6 mb-2 text-blue-600" />
                <span>Assign Delivery</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate("/logistics/fleet")}
              >
                <Truck className="h-6 w-6 mb-2 text-purple-600" />
                <span>View Fleet</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate("/logistics/route-planning")}
              >
                <MapPin className="h-6 w-6 mb-2 text-green-600" />
                <span>Plan Route</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => navigate("/logistics/reports")}
              >
                <FileText className="h-6 w-6 mb-2 text-orange-600" />
                <span>Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Package, label: "Active Deliveries", path: "/logistics/active-deliveries", color: "blue" },
            { icon: Truck, label: "Fleet Management", path: "/logistics/fleet", color: "purple" },
            { icon: Users, label: "Driver Management", path: "/logistics/drivers", color: "green" },
            { icon: Navigation, label: "Route Planning", path: "/logistics/route-planning", color: "orange" },
            { icon: Calendar, label: "Delivery History", path: "/logistics/history", color: "indigo" },
            { icon: FileText, label: "Reports", path: "/logistics/reports", color: "pink" },
            { icon: Settings, label: "Settings", path: "/logistics/settings", color: "gray" },
            { icon: TrendingUp, label: "Analytics", path: "/logistics/analytics", color: "emerald" },
          ].map((item, idx) => (
            <Card
              key={idx}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(item.path)}
            >
              <CardContent className="p-6 text-center">
                <item.icon className={`h-10 w-10 mx-auto mb-3 text-${item.color}-600`} />
                <p className="font-medium text-gray-900">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
