import { DashboardCard } from "@/components/DashboardCard";
import { Users, TrendingUp, DollarSign, Package, Shield, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { fetchFarmerPayments, fetchYieldForecast } from "@/data/mock-api";
import { useState } from "react";

interface RegisteredFarmer {
  _id: string;
  digitalFarmerId: string;
  name: string;
  mobileNumber: string;
  email?: string;
  areaInAcres?: number;
  landLocation?: string;
  blockchainVerified: boolean;
  blockchainWalletAddress?: string;
  blockchainTransactionHash?: string;
}

const farmers = [
  {
    id: "F-2847",
    name: "Rajesh Kumar",
    village: "Mandvi",
    totalCane: "1,248 tons",
    payment: "₹18,72,000",
    status: "verified",
    lastDelivery: "2 hours ago",
  },
  {
    id: "F-1923",
    name: "Amit Patel",
    village: "Surat",
    totalCane: "892 tons",
    payment: "₹13,38,000",
    status: "verified",
    lastDelivery: "5 hours ago",
  },
  {
    id: "F-3456",
    name: "Suresh Desai",
    village: "Bharuch",
    totalCane: "1,567 tons",
    payment: "₹23,50,500",
    status: "pending",
    lastDelivery: "1 day ago",
  },
  {
    id: "F-2190",
    name: "Mahesh Shah",
    village: "Navsari",
    totalCane: "723 tons",
    payment: "₹10,84,500",
    status: "verified",
    lastDelivery: "3 hours ago",
  },
  {
    id: "F-4501",
    name: "Dinesh Mehta",
    village: "Valsad",
    totalCane: "1,034 tons",
    payment: "₹15,51,000",
    status: "verified",
    lastDelivery: "8 hours ago",
  },
];

// Fetch registered farmers from backend
const fetchRegisteredFarmers = async () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const response = await fetch(`${API_BASE_URL}/farmers`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    credentials: 'include',
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch farmers');
  }
  
  return response.json();
};

export default function Farmers() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ['farmerPayments'],
    queryFn: fetchFarmerPayments,
    staleTime: 5000,
    refetchInterval: 5000,
  });

  const { data: yieldForecast, isLoading: forecastLoading } = useQuery({
    queryKey: ['yieldForecast'],
    queryFn: fetchYieldForecast,
    staleTime: 5000,
    refetchInterval: 5000,
  });

  // Fetch registered farmers with auto-refresh
  const { data: registeredFarmers, isLoading: farmersLoading } = useQuery({
    queryKey: ['registeredFarmers'],
    queryFn: fetchRegisteredFarmers,
    staleTime: 3000,
    refetchInterval: 3000, // Auto-refresh every 3 seconds
  });

  const filteredPayments = payments?.filter(payment => {
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    const matchesSearch = payment.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const deviation = yieldForecast 
    ? ((yieldForecast.actual - yieldForecast.forecast) / yieldForecast.forecast * 100).toFixed(1)
    : 0;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Farmer Management</h1>
        <p className="text-muted-foreground">
          Manage farmer registrations, deliveries, and payments
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Farmers"
          value="1,284"
          icon={<Users className="h-8 w-8" />}
          trend={{ value: 12, label: "new this month" }}
          variant="success"
        />
        <DashboardCard
          title="Yield Forecast vs Actual"
          icon={<Package className="h-8 w-8" />}
          variant={Number(deviation) >= 0 ? "success" : "default"}
        >
          {forecastLoading ? (
            <div className="animate-pulse">Loading...</div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">
                  {yieldForecast?.actual.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">{yieldForecast?.unit}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Forecast: {yieldForecast?.forecast.toLocaleString()} {yieldForecast?.unit}
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className={`h-4 w-4 ${Number(deviation) >= 0 ? 'text-success' : 'text-destructive'}`} />
                <span className={`text-sm font-medium ${Number(deviation) >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {deviation}% deviation
                </span>
              </div>
            </div>
          )}
        </DashboardCard>
        <DashboardCard
          title="Payments Processed"
          value="₹68.8 Cr"
          icon={<DollarSign className="h-8 w-8" />}
          trend={{ value: 15, label: "this quarter" }}
          variant="success"
        />
        <DashboardCard
          title="Verified Farmers"
          value="1,247"
          icon={<Shield className="h-8 w-8" />}
          trend={{ value: 97, label: "verification rate" }}
          variant="success"
        />
      </div>

      {/* Registered Farmers Section */}
      <DashboardCard title="Registered Farmers with Blockchain Verification">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Farmers registered with Digital ID and blockchain verification
            </p>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/register-farmer'}>
              <Users className="h-4 w-4 mr-2" />
              Register New Farmer
            </Button>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            {farmersLoading ? (
              <div className="p-8 text-center animate-pulse">Loading registered farmers...</div>
            ) : registeredFarmers && registeredFarmers.farmers && registeredFarmers.farmers.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold">Digital ID</TableHead>
                    <TableHead className="font-semibold">Name</TableHead>
                    <TableHead className="font-semibold">Mobile</TableHead>
                    <TableHead className="font-semibold">Land Area</TableHead>
                    <TableHead className="font-semibold">Location</TableHead>
                    <TableHead className="font-semibold">Blockchain</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registeredFarmers.farmers.map((farmer: RegisteredFarmer) => (
                    <TableRow key={farmer._id} className="border-border">
                      <TableCell className="font-mono text-primary font-medium">
                        {farmer.digitalFarmerId}
                      </TableCell>
                      <TableCell className="font-medium">{farmer.name}</TableCell>
                      <TableCell className="text-muted-foreground">{farmer.mobileNumber}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {farmer.areaInAcres ? `${farmer.areaInAcres} acres` : 'N/A'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {farmer.landLocation || 'N/A'}
                      </TableCell>
                      <TableCell>
                        {farmer.blockchainVerified ? (
                          <Badge className="bg-success/20 text-success border-success/40">
                            <Shield className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-warning text-warning">
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-primary/20 text-primary border-primary/40">
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">No farmers registered yet</p>
                <Button onClick={() => window.location.href = '/register-farmer'}>
                  Register First Farmer
                </Button>
              </div>
            )}
          </div>
        </div>
      </DashboardCard>

      <DashboardCard title="Farmer Payment Ledger">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search farmer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            {paymentsLoading ? (
              <div className="p-8 text-center animate-pulse">Loading payment data...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">Farmer Name</TableHead>
                    <TableHead className="font-semibold">Tonnage</TableHead>
                    <TableHead className="font-semibold">Quality Deduction</TableHead>
                    <TableHead className="font-semibold">Net Payable</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments?.map((payment) => (
                    <TableRow key={payment.id} className="border-border">
                      <TableCell className="font-mono text-primary">
                        #{payment.id}
                      </TableCell>
                      <TableCell className="font-medium">{payment.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {payment.tonnage.toFixed(1)} T
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {payment.qualityDeduction.toFixed(1)}%
                      </TableCell>
                      <TableCell className="font-medium text-success">
                        ₹{payment.netPayable.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {payment.status === "Paid" ? (
                          <Badge className="bg-success/20 text-success border-success/40">
                            <Shield className="h-3 w-3 mr-1" />
                            Paid
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-warning text-warning">
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
