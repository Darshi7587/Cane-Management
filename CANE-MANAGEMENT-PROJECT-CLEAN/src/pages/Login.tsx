import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Users, Truck, Shield, Briefcase, Factory, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') || 'farmer';

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState(defaultRole);

  const roles = [
    { value: 'farmer', label: 'Farmer', icon: Users, color: 'text-emerald-500' },
    { value: 'logistics', label: 'Logistics', icon: Truck, color: 'text-blue-500' },
    { value: 'admin', label: 'Admin', icon: Shield, color: 'text-purple-500' },
    { value: 'staff', label: 'Staff', icon: Briefcase, color: 'text-orange-500' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          role: selectedRole
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed. Please check your credentials.');
      }

      // Store tokens in localStorage
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Redirect based on role
        const roleRoutes: Record<string, string> = {
          farmer: '/farmer/dashboard',
          logistics: '/logistics/dashboard',
          admin: '/admin',
          staff: '/staff/dashboard'
        };

        const redirectPath = roleRoutes[data.user.role] || '/overview';
        navigate(redirectPath);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <Factory className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your SSIMP account</p>
        </div>

        {/* Role Selection Tabs */}
        <Card className="p-6">
          <Tabs defaultValue={selectedRole} onValueChange={setSelectedRole} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              {roles.map(role => {
                const Icon = role.icon;
                return (
                  <TabsTrigger key={role.value} value={role.value} className="gap-2">
                    <Icon className={`h-4 w-4 ${role.color}`} />
                    <span className="hidden sm:inline">{role.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {roles.map(role => (
              <TabsContent key={role.value} value={role.value}>
                <div className="mb-4">
                  <Badge variant="outline" className="gap-1">
                    <role.icon className={`h-3 w-3 ${role.color}`} />
                    {role.label} Login
                  </Badge>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <Button type="submit" className="w-full gap-2" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>

                {(role.value === 'farmer' || role.value === 'logistics') && (
                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{' '}
                      <Link
                        to={role.value === 'farmer' ? '/register-farmer' : '/register-logistics'}
                        className="text-primary hover:underline font-medium"
                      >
                        Register here
                      </Link>
                    </p>
                  </div>
                )}

                {(role.value === 'admin' || role.value === 'staff') && (
                  <div className="mt-6 text-center">
                    <p className="text-xs text-muted-foreground">
                      {role.label} accounts are created by system administrators
                    </p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </Card>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
