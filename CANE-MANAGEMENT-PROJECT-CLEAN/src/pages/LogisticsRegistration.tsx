import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Truck,
  User,
  Building2,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Loader2
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface LogisticsFormData {
  // Page 1: Personal Info
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobileNumber: string;
  alternateMobile: string;
  dateOfBirth: string;
  
  // Page 2: Company/Fleet Info
  companyName: string;
  registrationNumber: string;
  gstNumber: string;
  panNumber: string;
  companyType: string;
  officeAddress: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  numberOfVehicles: number;
  vehicleTypes: string[];
  coverageArea: string[];
  yearsInBusiness: number;
  
  // Page 3: Documents & Bank
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  relationship: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeSLA: boolean;
}

const initialFormData: LogisticsFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  mobileNumber: '',
  alternateMobile: '',
  dateOfBirth: '',
  companyName: '',
  registrationNumber: '',
  gstNumber: '',
  panNumber: '',
  companyType: '',
  officeAddress: '',
  city: '',
  district: '',
  state: '',
  pincode: '',
  numberOfVehicles: 0,
  vehicleTypes: [],
  coverageArea: [],
  yearsInBusiness: 0,
  accountHolderName: '',
  bankName: '',
  accountNumber: '',
  ifscCode: '',
  branchName: '',
  emergencyContactName: '',
  emergencyContactNumber: '',
  relationship: '',
  agreeTerms: false,
  agreePrivacy: false,
  agreeSLA: false
};

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const vehicleTypeOptions = [
  'Small Trucks (< 5 tons)',
  'Medium Trucks (5-10 tons)',
  'Large Trucks (> 10 tons)',
  'Trailers'
];

export default function LogisticsRegistration() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<LogisticsFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const progress = (currentPage / 3) * 100;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleVehicleTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      vehicleTypes: prev.vehicleTypes.includes(type)
        ? prev.vehicleTypes.filter(t => t !== type)
        : [...prev.vehicleTypes, type]
    }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const validatePage1 = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.mobileNumber) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!/^[0-9]{10}$/.test(formData.mobileNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      return false;
    }
    return true;
  };

  const validatePage2 = () => {
    if (!formData.companyName || !formData.registrationNumber || !formData.gstNumber || 
        !formData.panNumber || !formData.companyType || !formData.state) {
      setError('Please fill in all required fields');
      return false;
    }
    if (formData.vehicleTypes.length === 0) {
      setError('Please select at least one vehicle type');
      return false;
    }
    return true;
  };

  const validatePage3 = () => {
    if (!formData.accountHolderName || !formData.bankName || !formData.accountNumber || 
        !formData.ifscCode || !formData.emergencyContactName || !formData.emergencyContactNumber) {
      setError('Please fill in all required fields');
      return false;
    }
    if (!formData.agreeTerms || !formData.agreePrivacy || !formData.agreeSLA) {
      setError('Please agree to all terms and conditions');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentPage === 1 && validatePage1()) {
      setCurrentPage(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentPage === 2 && validatePage2()) {
      setCurrentPage(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePage3()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          role: 'logistics'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess(true);
      console.log('✅ Logistics partner registered:', data);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login?role=logistics');
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      console.error('❌ Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-lg w-full p-8 text-center">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-foreground">Registration Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Your application has been submitted successfully. Please verify your email and wait for admin approval.
          </p>
          <Alert className="bg-primary/10 border-primary/20">
            <AlertDescription className="text-sm">
              You will receive an email notification once your account is approved by the administrator.
            </AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/login')} className="mt-6">
            Go to Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Logistics Partner Registration</h1>
          <p className="text-muted-foreground">Complete the 3-step registration process</p>
        </div>

        {/* Progress Bar */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant={currentPage >= 1 ? 'default' : 'outline'}>
                <User className="h-3 w-3 mr-1" />
                Personal
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant={currentPage >= 2 ? 'default' : 'outline'}>
                <Building2 className="h-3 w-3 mr-1" />
                Company
              </Badge>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <Badge variant={currentPage >= 3 ? 'default' : 'outline'}>
                <FileText className="h-3 w-3 mr-1" />
                Documents
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">Step {currentPage} of 3</span>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* Form */}
        <Card className="p-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Page 1: Personal Information */}
            {currentPage === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mobileNumber">Mobile Number *</Label>
                    <Input
                      id="mobileNumber"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alternateMobile">Alternate Mobile</Label>
                    <Input
                      id="alternateMobile"
                      name="alternateMobile"
                      value={formData.alternateMobile}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      maxLength={10}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4">Account Security</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Min. 8 characters"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Re-enter password"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Page 2: Company/Fleet Information */}
            {currentPage === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    Company & Fleet Information
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="companyName">Company/Business Name *</Label>
                    <Input
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      placeholder="ABC Transport Company"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">Business Registration Number *</Label>
                    <Input
                      id="registrationNumber"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      placeholder="REG-123456"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number *</Label>
                    <Input
                      id="gstNumber"
                      name="gstNumber"
                      value={formData.gstNumber}
                      onChange={handleInputChange}
                      placeholder="22AAAAA0000A1Z5"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="panNumber">PAN Number *</Label>
                    <Input
                      id="panNumber"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleInputChange}
                      placeholder="ABCDE1234F"
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyType">Company Type *</Label>
                    <Select value={formData.companyType} onValueChange={(val) => handleSelectChange('companyType', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual Transporter</SelectItem>
                        <SelectItem value="company">Transport Company</SelectItem>
                        <SelectItem value="firm">Logistics Firm</SelectItem>
                        <SelectItem value="fleet">Fleet Owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold mb-4">Office Address</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="officeAddress">Street Address *</Label>
                      <Textarea
                        id="officeAddress"
                        name="officeAddress"
                        value={formData.officeAddress}
                        onChange={handleInputChange}
                        placeholder="Building, Street, Area"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="district">District *</Label>
                      <Input
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select value={formData.state} onValueChange={(val) => handleSelectChange('state', val)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map(state => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="400001"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold mb-4">Fleet Information</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="numberOfVehicles">Number of Vehicles *</Label>
                      <Input
                        id="numberOfVehicles"
                        name="numberOfVehicles"
                        type="number"
                        value={formData.numberOfVehicles}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yearsInBusiness">Years in Business *</Label>
                      <Input
                        id="yearsInBusiness"
                        name="yearsInBusiness"
                        type="number"
                        value={formData.yearsInBusiness}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Vehicle Types * (select all that apply)</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {vehicleTypeOptions.map(type => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={formData.vehicleTypes.includes(type)}
                            onCheckedChange={() => handleVehicleTypeToggle(type)}
                          />
                          <label
                            htmlFor={type}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {type}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Page 3: Documents & Bank Details */}
            {currentPage === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Bank Account & Emergency Contact
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                    <Input
                      id="accountHolderName"
                      name="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input
                      id="bankName"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="State Bank of India"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input
                      id="accountNumber"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code *</Label>
                    <Input
                      id="ifscCode"
                      name="ifscCode"
                      value={formData.ifscCode}
                      onChange={handleInputChange}
                      placeholder="SBIN0001234"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="branchName">Branch Name</Label>
                    <Input
                      id="branchName"
                      name="branchName"
                      value={formData.branchName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactName">Contact Person Name *</Label>
                      <Input
                        id="emergencyContactName"
                        name="emergencyContactName"
                        value={formData.emergencyContactName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactNumber">Contact Number *</Label>
                      <Input
                        id="emergencyContactNumber"
                        name="emergencyContactNumber"
                        value={formData.emergencyContactNumber}
                        onChange={handleInputChange}
                        maxLength={10}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <Input
                        id="relationship"
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleInputChange}
                        placeholder="Spouse, Parent, etc."
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold mb-4">Agreements</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeTerms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => handleCheckboxChange('agreeTerms', checked as boolean)}
                      />
                      <label htmlFor="agreeTerms" className="text-sm leading-tight cursor-pointer">
                        I agree to the <span className="text-primary">Terms & Conditions</span> *
                      </label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreePrivacy"
                        checked={formData.agreePrivacy}
                        onCheckedChange={(checked) => handleCheckboxChange('agreePrivacy', checked as boolean)}
                      />
                      <label htmlFor="agreePrivacy" className="text-sm leading-tight cursor-pointer">
                        I agree to the <span className="text-primary">Privacy Policy</span> *
                      </label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="agreeSLA"
                        checked={formData.agreeSLA}
                        onCheckedChange={(checked) => handleCheckboxChange('agreeSLA', checked as boolean)}
                      />
                      <label htmlFor="agreeSLA" className="text-sm leading-tight cursor-pointer">
                        I agree to the <span className="text-primary">Service Level Agreement</span> *
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={currentPage === 1 ? () => navigate('/') : handleBack}
                disabled={loading}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {currentPage === 1 ? 'Cancel' : 'Back'}
              </Button>

              {currentPage < 3 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button type="submit" disabled={loading} className="gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Submit Registration
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
