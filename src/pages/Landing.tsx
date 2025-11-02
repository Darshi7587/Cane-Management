import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Truck,
  Shield,
  Briefcase,
  TrendingUp,
  Zap,
  Leaf,
  Factory,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Globe,
  Droplet
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Landing() {
  const [stats, setStats] = useState({
    farmers: 0,
    deliveries: 0,
    production: 0,
    efficiency: 0
  });

  // Animated counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        farmers: prev.farmers < 1247 ? prev.farmers + 25 : 1247,
        deliveries: prev.deliveries < 12450 ? prev.deliveries + 250 : 12450,
        production: prev.production < 95000 ? prev.production + 1900 : 95000,
        efficiency: prev.efficiency < 94.5 ? prev.efficiency + 1.9 : 94.5
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const roles = [
    {
      title: 'Farmer',
      icon: Users,
      description: 'Register your farm, track deliveries, receive instant payments via blockchain',
      features: [
        'Digital Farmer ID with blockchain verification',
        'Real-time payment tracking',
        'Yield submission & pickup scheduling',
        'Sustainability score tracking'
      ],
      color: 'from-emerald-500/20 to-emerald-600/20',
      borderColor: 'border-emerald-500/50',
      link: '/register-farmer'
    },
    {
      title: 'Logistics Partner',
      icon: Truck,
      description: 'Manage fleet, optimize routes, track deliveries in real-time with GPS',
      features: [
        'Live GPS tracking & route optimization',
        'Fleet management dashboard',
        'Driver assignment & performance',
        'Delivery history & analytics'
      ],
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-500/50',
      link: '/register-logistics'
    },
    {
      title: 'Admin',
      icon: Shield,
      description: 'Full system control, user approvals, analytics, and system monitoring',
      features: [
        'User approval & management',
        'System health monitoring',
        'Comprehensive analytics',
        'Audit logs & compliance'
      ],
      color: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-500/50',
      link: '/admin-login'
    },
    {
      title: 'Staff',
      icon: Briefcase,
      description: 'Department-specific access for Production, QC, HR, and Support teams',
      features: [
        'Department-based dashboards',
        'Production batch management',
        'Quality control & compliance',
        'HR & maintenance tracking'
      ],
      color: 'from-orange-500/20 to-orange-600/20',
      borderColor: 'border-orange-500/50',
      link: '/staff-login'
    }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: 'Real-Time Analytics',
      description: 'Live production metrics, yield forecasting, and market price predictions'
    },
    {
      icon: Zap,
      title: 'IoT Integration',
      description: 'Weighbridge automation, sensor monitoring, and instant payment processing'
    },
    {
      icon: Globe,
      title: 'Blockchain Verified',
      description: 'Immutable farmer records, transparent payments, tamper-proof transactions'
    },
    {
      icon: Leaf,
      title: 'Sustainability Tracking',
      description: 'Carbon footprint monitoring, water/energy efficiency, ESG compliance'
    },
    {
      icon: BarChart3,
      title: 'AI-Powered Insights',
      description: 'Disease detection, yield prediction, optimal harvest timing recommendations'
    },
    {
      icon: Droplet,
      title: 'Multi-Facility Management',
      description: 'Sugar mills, distilleries, power plants - all in one unified platform'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="container relative mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              🚀 Advanced Real-Time Sugar Industry Platform
            </Badge>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Factory className="h-16 w-16 text-primary" />
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                SSIMP
              </h1>
            </div>
            <p className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
              Smart Sugar Industry Management Platform
            </p>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              End-to-end digital transformation for sugar cane operations. From farm to factory,
              with blockchain verification, IoT automation, and AI-powered insights.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/register-farmer">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="gap-2">
                  Login to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            <Card className="p-6 text-center bg-card/50 backdrop-blur border-border/50">
              <Factory className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold text-foreground">{stats.farmers.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Registered Farmers</div>
            </Card>
            <Card className="p-6 text-center bg-card/50 backdrop-blur border-border/50">
              <Truck className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold text-foreground">{stats.deliveries.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Monthly Deliveries</div>
            </Card>
            <Card className="p-6 text-center bg-card/50 backdrop-blur border-border/50">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold text-foreground">{stats.production.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Tons Produced</div>
            </Card>
            <Card className="p-6 text-center bg-card/50 backdrop-blur border-border/50">
              <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold text-foreground">{stats.efficiency.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">System Efficiency</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Choose Your Role</h2>
          <p className="text-muted-foreground text-lg">
            Select the option that best describes your role in the sugar industry
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <Card
                key={index}
                className={`p-6 border-2 ${role.borderColor} bg-gradient-to-br ${role.color} hover:scale-105 transition-all duration-300 group cursor-pointer`}
              >
                <Link to={role.link}>
                  <div className="mb-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{role.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                  </div>

                  <ul className="space-y-2">
                    {role.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="w-full mt-6 gap-2 group-hover:gap-3 transition-all">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Platform Features</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive tools and automation for every aspect of sugar cane management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 bg-card/50 backdrop-blur border-border/50 hover:border-primary/50 transition-all">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border">
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Ready to Transform Your Operations?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of farmers, logistics partners, and sugar mills using SugarVerse
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register-farmer">
              <Button size="lg" className="gap-2">
                Register Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Login to Your Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-muted-foreground text-sm">
            <p>© 2025 SugarVerse - Smart Sugar Industry Management Platform</p>
            <p className="mt-2">Powered by Blockchain, IoT, and AI Technology</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
