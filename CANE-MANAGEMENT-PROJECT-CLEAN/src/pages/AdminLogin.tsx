import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Factory, Loader2, AlertCircle, ArrowLeft, Lock, Mail } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    otp: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Initial login
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: 'admin'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Login failed. Please check your credentials.');
      }

      // Check if 2FA is required
      if (data.requires2FA) {
        setShowTwoFactor(true);
        setLoading(false);
        return;
      }

      // Store tokens and redirect
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Log login activity
        console.log('Admin login successful:', {
          userId: data.user._id,
          timestamp: new Date().toISOString()
        });

        navigate('/admin');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP. Please try again.');
      }

      // Store tokens and redirect
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/admin');
    } catch (err) {
      console.error('2FA verification error:', err);
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/resend-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email })
      });
      alert('OTP resent successfully!');
    } catch (err) {
      console.error('Resend OTP error:', err);
    }
  };

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
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Admin Login</h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Factory className="h-4 w-4" />
            SSIMP - System Administration
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-border/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              {showTwoFactor ? 'Two-Factor Authentication' : 'Administrator Access'}
            </CardTitle>
            <CardDescription>
              {showTwoFactor 
                ? 'Enter the 6-digit OTP sent to your registered email/phone'
                : 'Full system access with administrative privileges'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!showTwoFactor ? (
              // Login Form
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@ssimp.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    autoComplete="email"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password *
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your admin password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    autoComplete="current-password"
                    className="bg-background"
                  />
                </div>

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

                <Button
                  type="submit"
                  className="w-full gap-2"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      Login to Dashboard
                    </>
                  )}
                </Button>
              </form>
            ) : (
              // Two-Factor Authentication Form
              <form onSubmit={handleTwoFactorVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter 6-digit OTP *</Label>
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="000000"
                    value={formData.otp}
                    onChange={handleInputChange}
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    className="bg-background text-center text-2xl tracking-widest font-mono"
                  />
                  <p className="text-sm text-muted-foreground text-center">
                    OTP sent to {formData.email}
                  </p>
                </div>

                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendOTP}
                  className="w-full"
                >
                  Didn't receive code? Resend
                </Button>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  size="lg"
                  disabled={loading || formData.otp.length !== 6}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      Verify & Continue
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowTwoFactor(false)}
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </form>
            )}

            {/* Footer Note */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border/50">
              <p className="text-xs text-muted-foreground text-center">
                <AlertCircle className="h-3 w-3 inline mr-1" />
                Admin accounts are created by system administrators only
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Not an admin?{' '}
            <Link to="/" className="text-primary hover:underline font-medium">
              Choose different role
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
