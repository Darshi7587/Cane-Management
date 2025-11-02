import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Briefcase, Factory, Loader2, AlertCircle, ArrowLeft, Lock, Mail, Building2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const DEPARTMENTS = [
  { value: 'production', label: 'Production', icon: '⚙️' },
  { value: 'quality', label: 'Quality Control', icon: '✓' },
  { value: 'hr', label: 'Human Resources', icon: '👥' },
  { value: 'support', label: 'Support/Maintenance', icon: '🔧' }
];

export default function StaffLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    password: '',
    department: '',
    rememberMe: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(null);
  };

  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({ ...prev, department: value }));
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate department selection
      if (!formData.department) {
        throw new Error('Please select your department');
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.employeeId,
          password: formData.password,
          role: 'staff',
          department: formData.department
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed. Please check your credentials.');
      }

      // Verify department assignment matches
      if (data.user.department && data.user.department !== formData.department) {
        throw new Error('Department mismatch. Please contact HR.');
      }

      // Store tokens and user data
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Log login activity
        console.log('Staff login successful:', {
          userId: data.user._id,
          department: formData.department,
          timestamp: new Date().toISOString()
        });

        // Redirect based on department
        const departmentRoutes: Record<string, string> = {
          production: '/staff/production',
          quality: '/staff/quality',
          hr: '/staff/hr',
          support: '/staff/support'
        };

        const redirectPath = departmentRoutes[formData.department] || '/staff/dashboard';
        navigate(redirectPath);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Staff login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedDepartment = DEPARTMENTS.find(d => d.value === formData.department);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back to Home */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Staff Login</h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Factory className="h-4 w-4" />
            SSIMP - Department Access
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-border/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Department-Based Access
            </CardTitle>
            <CardDescription>
              Login with your employee credentials and department
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Employee ID / Email */}
              <div className="space-y-2">
                <Label htmlFor="employeeId" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Employee ID / Email Address *
                </Label>
                <Input
                  id="employeeId"
                  name="employeeId"
                  type="text"
                  placeholder="EMP001 or staff@ssimp.com"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  required
                  autoComplete="username"
                  className="bg-background"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password *
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  autoComplete="current-password"
                  className="bg-background"
                />
              </div>

              {/* Department Selection */}
              <div className="space-y-2">
                <Label htmlFor="department" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Department *
                </Label>
                <Select value={formData.department} onValueChange={handleDepartmentChange}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        <span className="flex items-center gap-2">
                          <span>{dept.icon}</span>
                          <span>{dept.label}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedDepartment && (
                  <p className="text-xs text-muted-foreground">
                    You will be redirected to {selectedDepartment.label} Dashboard
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                    }
                  />
                  <label
                    htmlFor="rememberMe"
                    className="text-sm text-muted-foreground cursor-pointer select-none"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full gap-2"
                size="lg"
                disabled={loading || !formData.department}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Briefcase className="h-4 w-4" />
                    Login to Dashboard
                  </>
                )}
              </Button>
            </form>

            {/* Department Access Info */}
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold text-foreground mb-2">Department Access Levels:</p>
              <div className="space-y-1">
                {DEPARTMENTS.map((dept) => (
                  <div key={dept.value} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="mt-0.5">{dept.icon}</span>
                    <span>
                      <strong>{dept.label}:</strong>{' '}
                      {dept.value === 'production' && 'Batch management, equipment monitoring'}
                      {dept.value === 'quality' && 'Testing, compliance, certifications'}
                      {dept.value === 'hr' && 'Employee records, payroll, attendance'}
                      {dept.value === 'support' && 'Maintenance, helpdesk, repairs'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                <AlertCircle className="h-3 w-3 inline mr-1" />
                Staff accounts are managed by HR department
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Not a staff member?{' '}
            <Link to="/" className="text-primary hover:underline font-medium">
              Choose different role
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
