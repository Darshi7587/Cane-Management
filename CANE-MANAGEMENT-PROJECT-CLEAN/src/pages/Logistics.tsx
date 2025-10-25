import { DashboardCard } from "@/components/DashboardCard";
import { Truck, MapPin, Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const trucks = [
  {
    id: "T-2847",
    driver: "Ramesh Kumar",
    route: "Mandvi → Mill",
    caneWeight: "24.5 tons",
    distance: "12 km",
    eta: "15 min",
    status: "in-transit",
    progress: 75,
  },
  {
    id: "T-3192",
    driver: "Suresh Patel",
    route: "Surat → Mill",
    caneWeight: "26.2 tons",
    distance: "8 km",
    eta: "10 min",
    status: "in-transit",
    progress: 85,
  },
  {
    id: "T-4501",
    driver: "Mahesh Shah",
    route: "Bharuch → Mill",
    caneWeight: "23.8 tons",
    distance: "18 km",
    eta: "25 min",
    status: "delayed",
    progress: 45,
  },
  {
    id: "T-1923",
    driver: "Dinesh Mehta",
    route: "Navsari → Mill",
    caneWeight: "25.1 tons",
    distance: "2 km",
    eta: "5 min",
    status: "arriving",
    progress: 95,
  },
];

export default function Logistics() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Smart Logistics</h1>
        <p className="text-muted-foreground">
          Real-time tracking and route optimization
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Active Trucks"
          value="42"
          icon={<Truck className="h-8 w-8" />}
          trend={{ value: 8, label: "on route" }}
          variant="success"
        />
        <DashboardCard
          title="Today's Deliveries"
          value="187"
          icon={<MapPin className="h-8 w-8" />}
          trend={{ value: 12, label: "vs yesterday" }}
          variant="success"
        />
        <DashboardCard
          title="Avg Delivery Time"
          value="28 min"
          icon={<Clock className="h-8 w-8" />}
          trend={{ value: -15, label: "improvement" }}
          variant="success"
        />
        <DashboardCard
          title="Delayed Trucks"
          value="3"
          icon={<AlertCircle className="h-8 w-8" />}
          trend={{ value: -25, label: "vs last week" }}
          variant="warning"
        />
      </div>

      <DashboardCard title="Live Truck Tracking">
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Truck ID</TableHead>
                <TableHead className="font-semibold">Driver</TableHead>
                <TableHead className="font-semibold">Route</TableHead>
                <TableHead className="font-semibold">Cane Weight</TableHead>
                <TableHead className="font-semibold">Distance</TableHead>
                <TableHead className="font-semibold">ETA</TableHead>
                <TableHead className="font-semibold">Progress</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trucks.map((truck) => (
                <TableRow key={truck.id} className="border-border">
                  <TableCell className="font-mono text-primary">
                    {truck.id}
                  </TableCell>
                  <TableCell className="font-medium">{truck.driver}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {truck.route}
                  </TableCell>
                  <TableCell className="font-medium">{truck.caneWeight}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {truck.distance}
                  </TableCell>
                  <TableCell className="font-medium">{truck.eta}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={truck.progress} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground w-10">
                        {truck.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {truck.status === "in-transit" && (
                      <Badge className="bg-primary/20 text-primary border-primary/40">
                        In Transit
                      </Badge>
                    )}
                    {truck.status === "delayed" && (
                      <Badge variant="destructive">Delayed</Badge>
                    )}
                    {truck.status === "arriving" && (
                      <Badge className="bg-success/20 text-success border-success/40">
                        Arriving
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DashboardCard>
    </div>
  );
}
