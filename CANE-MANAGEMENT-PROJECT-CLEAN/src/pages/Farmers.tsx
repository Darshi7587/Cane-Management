import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardCard } from '@/components/DashboardCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users, Search, Filter, TrendingUp, MapPin, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface RegisteredFarmer {
  _id: string;
  digitalFarmerId: string;
  name: string;
  email: string;
  mobileNumber: string;
  areaInAcres: number;
  landLocation: string;
  status: string;
  netPayable?: number;
  blockchainWalletAddress?: string;
  blockchainVerified?: boolean;
  registrationDate: string;
  lastDeliveryDate?: string;
}

export default function Farmers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch registered farmers with auto-refresh
  const { data: farmersData, isLoading, error, refetch } = useQuery({
    queryKey: ['farmers', statusFilter],
    queryFn: async () => {
      const url = statusFilter === 'all' 
        ? `${API_BASE_URL}/farmers`
        : `${API_BASE_URL}/farmers?status=${statusFilter}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch farmers');
      }
      return response.json();
    },
    refetchInterval: 3000,
    staleTime: 2000
  });

  const farmers: RegisteredFarmer[] = farmersData?.farmers || [];

  // Filter farmers by search term
  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.digitalFarmerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    farmer.mobileNumber.includes(searchTerm)
  );

  // Calculate statistics
  const totalFarmers = farmers.length;
  const activeFarmers = farmers.filter(f => f.status === 'Active').length;
  const totalAcres = farmers.reduce((sum, f) => sum + (f.areaInAcres || 0), 0);
  const totalPayable = farmers.reduce((sum, f) => sum + (f.netPayable || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'inactive':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      case 'paid':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2 text-foreground">Registered Farmers</h1>
        <p className="text-muted-foreground">
          Manage and monitor all registered farmers in the system
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Farmers"
          value={totalFarmers.toString()}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardCard
          title="Active Farmers"
          value={activeFarmers.toString()}
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <DashboardCard
          title="Total Land Area"
          value={`${totalAcres.toFixed(1)} acres`}
          icon={MapPin}
          trend={{ value: 5, isPositive: true }}
        />
        <DashboardCard
          title="Total Payable"
          value={`₹${(totalPayable / 100000).toFixed(1)}L`}
          icon={TrendingUp}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, Digital ID, or mobile number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => refetch()}>
              Refresh
            </Button>
          </div>
        </div>
      </Card>

      {/* Farmers Table */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Farmer List</h2>
          <Badge variant="outline" className="gap-1">
            <Users className="h-3 w-3" />
            {filteredFarmers.length} farmers
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">Failed to load farmers. Please try again.</p>
            <Button onClick={() => refetch()} className="mt-4">Retry</Button>
          </div>
        ) : filteredFarmers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No farmers found matching your criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Digital ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Land Area</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Blockchain</TableHead>
                  <TableHead className="text-right">Net Payable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFarmers.map((farmer) => (
                  <TableRow key={farmer._id}>
                    <TableCell className="font-mono text-sm">
                      {farmer.digitalFarmerId || 'N/A'}
                    </TableCell>
                    <TableCell className="font-medium">{farmer.name}</TableCell>
                    <TableCell>{farmer.mobileNumber}</TableCell>
                    <TableCell>{farmer.areaInAcres} acres</TableCell>
                    <TableCell className="text-muted-foreground">
                      {farmer.landLocation || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(farmer.status)}>
                        {farmer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {farmer.blockchainVerified ? (
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          ✓ Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ₹{farmer.netPayable?.toLocaleString() || '0'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}
