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
