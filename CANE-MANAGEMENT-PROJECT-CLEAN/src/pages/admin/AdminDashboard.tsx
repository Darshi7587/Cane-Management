import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardCard } from '@/components/DashboardCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';
import {
  Users,
  Truck,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Activity,
  Loader2,
  AlertCircle,
  UserCheck,
  UserX
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface PendingUser {
  _id: string;
  name: string;
  email: string;
  mobileNumber: string;
  role: 'farmer' | 'logistics' | 'admin' | 'staff';
  status: string;
  createdAt: string;
  isEmailVerified: boolean;
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Get auth token
  const token = localStorage.getItem('accessToken');

  // Fetch pending approvals
  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ['pending-approvals'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/pending-approvals`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch pending approvals');
      return response.json();
    },
    refetchInterval: 5000, // Auto-refresh every 5 seconds
    enabled: !!token
  });

  // Fetch all users statistics
  const { data: statsData } = useQuery({
    queryKey: ['user-stats'],
    queryFn: async () => {
      // This would be a new endpoint to get user statistics
      return {
        totalUsers: 1247,
        activeUsers: 1156,
        pendingApprovals: pendingData?.count || 0,
        systemUptime: '99.9%'
      };
    },
    refetchInterval: 10000
  });

  const pendingUsers: PendingUser[] = pendingData?.users || [];

  // Approve user mutation
  const approveMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/approve/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Approval failed');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      setActionLoading(null);
    },
    onError: (error) => {
      console.error('Approval error:', error);
      setActionLoading(null);
    }
  });

  // Reject user mutation
  const rejectMutation = useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason: string }) => {
      const response = await fetch(`${API_BASE_URL}/auth/reject/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Rejection failed');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-approvals'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
      setRejectDialogOpen(false);
      setSelectedUser(null);
      setRejectionReason('');
      setActionLoading(null);
    },
    onError: (error) => {
      console.error('Rejection error:', error);
      setActionLoading(null);
    }
  });

  const handleApprove = (user: PendingUser) => {
    setActionLoading(user._id);
    approveMutation.mutate(user._id);
  };

  const handleReject = (user: PendingUser) => {
    setSelectedUser(user);
    setRejectDialogOpen(true);
  };

  const confirmReject = () => {
    if (!selectedUser || !rejectionReason.trim()) return;
    setActionLoading(selectedUser._id);
    rejectMutation.mutate({
      userId: selectedUser._id,
      reason: rejectionReason
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'farmer':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'logistics':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'admin':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'staff':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'farmer':
        return Users;
      case 'logistics':
        return Truck;
      case 'admin':
        return Shield;
      default:
        return Users;
    }
  };

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 text-foreground flex items-center gap-3">
            <Shield className="h-10 w-10 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            System overview and user management
          </p>
        </div>
        <Badge variant="outline" className="gap-2 px-4 py-2">
          <Activity className="h-4 w-4 text-primary animate-pulse" />
          System Active
        </Badge>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Total Users"
          value={statsData?.totalUsers.toString() || '0'}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardCard
          title="Active Users"
          value={statsData?.activeUsers.toString() || '0'}
          icon={UserCheck}
          trend={{ value: 8, isPositive: true }}
        />
        <DashboardCard
          title="Pending Approvals"
          value={pendingUsers.length.toString()}
          icon={Clock}
          trend={{ value: pendingUsers.length, isPositive: false }}
        />
        <DashboardCard
          title="System Uptime"
          value={statsData?.systemUptime || '99.9%'}
          icon={TrendingUp}
          trend={{ value: 0.1, isPositive: true }}
        />
      </div>

      {/* Pending Approvals Section */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-foreground flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Pending User Approvals
          </h2>
          <p className="text-muted-foreground">
            Review and approve or reject new user registrations
          </p>
        </div>

        {pendingLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : pendingUsers.length === 0 ? (
          <Alert className="bg-primary/10 border-primary/20">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertDescription className="text-foreground">
              No pending approvals at the moment. All users are up to date!
            </AlertDescription>
          </Alert>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user) => {
                  const RoleIcon = getRoleIcon(user.role);
                  return (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.mobileNumber}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          <RoleIcon className="h-3 w-3 mr-1" />
                          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {user.isEmailVerified ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-yellow-500">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(user)}
                            disabled={actionLoading === user._id}
                            className="gap-1"
                          >
                            {actionLoading === user._id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(user)}
                            disabled={actionLoading === user._id}
                            className="gap-1"
                          >
                            <XCircle className="h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Rejection Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <UserX className="h-5 w-5" />
              Reject User Registration
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedUser?.name}'s registration.
              This will be sent to the user via email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Enter rejection reason..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
            {selectedUser && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>{selectedUser.name}</strong> ({selectedUser.email}) will be notified of this rejection.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectDialogOpen(false);
                setSelectedUser(null);
                setRejectionReason('');
              }}
              disabled={actionLoading === selectedUser?._id}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmReject}
              disabled={!rejectionReason.trim() || actionLoading === selectedUser?._id}
              className="gap-2"
            >
              {actionLoading === selectedUser?._id ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4" />
                  Confirm Rejection
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
