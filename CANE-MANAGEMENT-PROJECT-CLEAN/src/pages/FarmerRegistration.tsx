import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Factory, User, MapPin, FileText, AlertCircle, Loader2, CheckCircle2, ArrowLeft, ArrowRight, Upload } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const CANE_VARIETIES = [
  'Co 86032', 'Co 0238', 'CoC 671', 'Co 94008', 'Co 0118', 'CoJ 64', 'CoLk 94184'
];

const SECURITY_QUESTIONS = [
  { value: 'mother_maiden', label: "What is your mother's maiden name?" },
  { value: 'first_pet', label: "What was your first pet's name?" },
  { value: 'birth_city', label: 'In what city were you born?' },
  { value: 'favorite_teacher', label: 'Who was your favorite teacher?' },
  { value: 'childhood_friend', label: 'What is the name of your childhood best friend?' }
];

interface FarmerFormData {
  // Page 1: Personal Information
  fullName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  gender: string;
  profilePhoto?: File;

  // Page 2: Farm Information
  farmName: string;
  farmRegistrationNumber: string;
  totalLandArea: string;
  streetAddress: string;
  village: string;
  district: string;
  state: string;
  pinCode: string;
  latitude: string;
  longitude: string;
  farmType: string;
  caneVariety: string;
  averageAnnualYield: string;
  irrigationTypes: string[];

  // Page 3: Documents & Bank Details
  governmentId?: File;
  landDocuments?: File;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  password: string;
  confirmPassword: string;
  securityQuestion: string;
  securityAnswer: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
  agreeDataProcessing: boolean;
}

export default function FarmerRegistration() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<FarmerFormData>({
    fullName: '',
    email: '',
    mobileNumber: '',
    dateOfBirth: '',
    gender: '',
    farmName: '',
    farmRegistrationNumber: '',
    totalLandArea: '',
    streetAddress: '',
    village: '',
    district: '',
    state: '',
    pinCode: '',
    latitude: '',
    longitude: '',
    farmType: '',
    caneVariety: '',
    averageAnnualYield: '',
    irrigationTypes: [],
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branchName: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeDataProcessing: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleCheckboxChange = (type: string, checked: boolean) => {
    if (type === 'terms') {
      setFormData(prev => ({ ...prev, agreeTerms: checked }));
    } else if (type === 'privacy') {
      setFormData(prev => ({ ...prev, agreePrivacy: checked }));
    } else if (type === 'data') {
      setFormData(prev => ({ ...prev, agreeDataProcessing: checked }));
    } else {
      // Irrigation types
      setFormData(prev => ({
        ...prev,
        irrigationTypes: checked
          ? [...prev.irrigationTypes, type]
          : prev.irrigationTypes.filter(t => t !== type)
      }));
    }
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }));
    }
  };

  const validatePage1 = () => {
    if (!formData.fullName.trim()) return 'Full name is required';
    if (formData.fullName.length < 3) return 'Full name must be at least 3 characters';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    if (!formData.mobileNumber.trim()) return 'Mobile number is required';
    if (!/^\d{10}$/.test(formData.mobileNumber)) return 'Mobile number must be exactly 10 digits';
    if (!formData.dateOfBirth) return 'Date of birth is required';
    
    const today = new Date();
    const birthDate = new Date(formData.dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      if (age - 1 < 18) return 'You must be at least 18 years old to register';
    } else if (age < 18) {
      return 'You must be at least 18 years old to register';
    }
    
    return null;
  };

  const validatePage2 = () => {
    if (!formData.farmName.trim()) return 'Farm name is required';
    if (!formData.farmRegistrationNumber.trim()) return 'Farm registration number is required';
    if (!formData.totalLandArea) return 'Total land area is required';
    if (parseFloat(formData.totalLandArea) <= 0) return 'Land area must be greater than 0';
    if (!formData.streetAddress.trim()) return 'Street address is required';
    if (!formData.district.trim()) return 'District is required';
    if (!formData.state) return 'State is required';
    if (!formData.pinCode.trim()) return 'PIN code is required';
    if (!/^\d{6}$/.test(formData.pinCode)) return 'PIN code must be exactly 6 digits';
    if (!formData.farmType) return 'Farm type is required';
    if (!formData.caneVariety) return 'Cane variety is required';
    if (formData.irrigationTypes.length === 0) return 'Please select at least one irrigation type';
    
    return null;
  };

  const validatePage3 = () => {
    if (!formData.accountHolderName.trim()) return 'Account holder name is required';
    if (!formData.bankName.trim()) return 'Bank name is required';
    if (!formData.accountNumber.trim()) return 'Account number is required';
    if (formData.accountNumber.length < 9 || formData.accountNumber.length > 18) {
      return 'Account number must be between 9-18 digits';
    }
    if (!formData.ifscCode.trim()) return 'IFSC code is required';
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.toUpperCase())) {
      return 'Invalid IFSC code format (e.g., SBIN0001234)';
    }
    if (!formData.password) return 'Password is required';
    if (formData.password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      return 'Password must contain uppercase, lowercase, number, and special character (@$!%*?&)';
    }
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    if (!formData.securityQuestion) return 'Security question is required';
    if (!formData.securityAnswer.trim()) return 'Security answer is required';
    if (!formData.agreeTerms) return 'You must agree to Terms & Conditions';
    if (!formData.agreePrivacy) return 'You must agree to Privacy Policy';
    
    return null;
  };

  const handleNext = () => {
    let validationError = null;
    
    if (currentPage === 1) validationError = validatePage1();
    else if (currentPage === 2) validationError = validatePage2();
    
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setError(null);
    setCurrentPage(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setCurrentPage(prev => prev - 1);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validatePage3();
    if (validationError) {
      setError(validationError);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const submitData = {
        role: 'farmer',
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender || undefined,
        farmerData: {
          farmName: formData.farmName,
          farmRegistrationNumber: formData.farmRegistrationNumber,
          totalLandArea: parseFloat(formData.totalLandArea),
          farmType: formData.farmType,
          address: {
            street: formData.streetAddress,
            village: formData.village || undefined,
            district: formData.district,
            state: formData.state,
            pinCode: formData.pinCode,
            gpsCoordinates: {
              latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
              longitude: formData.longitude ? parseFloat(formData.longitude) : undefined
            }
          },
          cropInfo: {
            primaryCrop: 'Sugar Cane',
            caneVariety: formData.caneVariety,
            averageAnnualYield: formData.averageAnnualYield ? parseFloat(formData.averageAnnualYield) : undefined,
            irrigationTypes: formData.irrigationTypes
          },
          bankDetails: {
            accountHolderName: formData.accountHolderName,
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            ifscCode: formData.ifscCode.toUpperCase(),
            branchName: formData.branchName || undefined
          }
        },
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer
      };

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Registration failed');
      }

      setSuccess(true);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (currentPage / 3) * 100;

  // Success Screen
  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 text-foreground">EMAIL VERIFICATION SENT</h2>
          <p className="text-muted-foreground mb-6">
            Check your email for verification link to activate your account
          </p>
          <div className="space-y-3">
            <Alert className="bg-primary/5 border-primary/20 text-left">
              <AlertDescription className="text-sm">
                <strong>Next Steps:</strong>
                <ol className="mt-2 space-y-1 ml-4 list-decimal">
                  <li>Click the verification link in your email</li>
                  <li>Your account will be under review</li>
                  <li>Admin will approve your registration</li>
                  <li>You'll receive approval email</li>
                  <li>Then you can login and start using SSIMP</li>
                </ol>
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate('/login?role=farmer')} className="w-full">
              Go to Login
            </Button>
            <Button variant="outline" onClick={() => navigate('/')} className="w-full">
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-4">
            <Factory className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Farmer Registration</h1>
          <p className="text-muted-foreground">Join SSIMP and digitize your farming operations</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant={currentPage >= 1 ? "default" : "outline"} className="gap-1">
                <User className="h-3 w-3" />
                <span className="hidden sm:inline">Personal</span>
              </Badge>
              <div className={`h-0.5 w-8 sm:w-12 ${currentPage >= 2 ? 'bg-primary' : 'bg-border'}`} />
              <Badge variant={currentPage >= 2 ? "default" : "outline"} className="gap-1">
                <MapPin className="h-3 w-3" />
                <span className="hidden sm:inline">Farm</span>
              </Badge>
              <div className={`h-0.5 w-8 sm:w-12 ${currentPage >= 3 ? 'bg-primary' : 'bg-border'}`} />
              <Badge variant={currentPage >= 3 ? "default" : "outline"} className="gap-1">
                <FileText className="h-3 w-3" />
                <span className="hidden sm:inline">Documents</span>
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground font-medium">
              {currentPage}/3
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Form Card */}
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* PAGE 1: PERSONAL INFORMATION */}
            {currentPage === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1 text-foreground flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </h2>
                  <div className="h-px bg-border my-4" />
                </div>

                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="mobileNumber">Phone Number *</Label>
                      <Input
                        id="mobileNumber"
                        name="mobileNumber"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">Must be 18+ years old</p>
                    </div>

                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="profilePhoto">Profile Photo (optional)</Label>
                    <div className="mt-2">
                      <Input
                        id="profilePhoto"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'profilePhoto')}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF (max 5MB)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PAGE 2: FARM INFORMATION */}
            {currentPage === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1 text-foreground flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Farm Information
                  </h2>
                  <div className="h-px bg-border my-4" />
                </div>

                <div className="grid gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="farmName">Farm Name *</Label>
                      <Input
                        id="farmName"
                        name="farmName"
                        value={formData.farmName}
                        onChange={handleInputChange}
                        placeholder="e.g., Green Valley Farm"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="farmRegistrationNumber">Farm Registration Number *</Label>
                      <Input
                        id="farmRegistrationNumber"
                        name="farmRegistrationNumber"
                        value={formData.farmRegistrationNumber}
                        onChange={handleInputChange}
                        placeholder="e.g., FM-KA-2024-12345"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="totalLandArea">Total Land Area (in acres) *</Label>
                    <Input
                      id="totalLandArea"
                      name="totalLandArea"
                      type="number"
                      step="0.01"
                      value={formData.totalLandArea}
                      onChange={handleInputChange}
                      placeholder="e.g., 25.50"
                      required
                    />
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm mb-3 text-foreground">Farm Address *</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="streetAddress">Street Address *</Label>
                        <Input
                          id="streetAddress"
                          name="streetAddress"
                          value={formData.streetAddress}
                          onChange={handleInputChange}
                          placeholder="Plot No., Street Name"
                          required
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="village">Village/Town</Label>
                          <Input
                            id="village"
                            name="village"
                            value={formData.village}
                            onChange={handleInputChange}
                            placeholder="Village name (optional)"
                          />
                        </div>

                        <div>
                          <Label htmlFor="district">District *</Label>
                          <Input
                            id="district"
                            name="district"
                            value={formData.district}
                            onChange={handleInputChange}
                            placeholder="District name"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Select value={formData.state} onValueChange={(value) => handleSelectChange('state', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              {INDIAN_STATES.map(state => (
                                <SelectItem key={state} value={state}>{state}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="pinCode">PIN Code *</Label>
                          <Input
                            id="pinCode"
                            name="pinCode"
                            value={formData.pinCode}
                            onChange={handleInputChange}
                            placeholder="6-digit PIN code"
                            maxLength={6}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm mb-3 text-foreground">GPS Coordinates (optional)</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          name="latitude"
                          type="number"
                          step="any"
                          value={formData.latitude}
                          onChange={handleInputChange}
                          placeholder="e.g., 12.5266"
                        />
                      </div>

                      <div>
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          name="longitude"
                          type="number"
                          step="any"
                          value={formData.longitude}
                          onChange={handleInputChange}
                          placeholder="e.g., 76.8980"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Farm Type *</Label>
                    <RadioGroup value={formData.farmType} onValueChange={(value) => handleSelectChange('farmType', value)}>
                      <div className="grid sm:grid-cols-3 gap-3">
                        <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50">
                          <RadioGroupItem value="owned" id="owned" />
                          <Label htmlFor="owned" className="cursor-pointer flex-1">☐ Owned</Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50">
                          <RadioGroupItem value="leased" id="leased" />
                          <Label htmlFor="leased" className="cursor-pointer flex-1">☐ Leased</Label>
                        </div>
                        <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50">
                          <RadioGroupItem value="cooperative" id="cooperative" />
                          <Label htmlFor="cooperative" className="cursor-pointer flex-1">☐ Cooperative</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm mb-3 text-foreground">Crop Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label>Primary Crop</Label>
                        <Input value="Sugar Cane (default)" disabled className="bg-muted" />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="caneVariety">Cane Variety *</Label>
                          <Select value={formData.caneVariety} onValueChange={(value) => handleSelectChange('caneVariety', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select variety" />
                            </SelectTrigger>
                            <SelectContent>
                              {CANE_VARIETIES.map(variety => (
                                <SelectItem key={variety} value={variety}>{variety}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="averageAnnualYield">Average Annual Yield (tons)</Label>
                          <Input
                            id="averageAnnualYield"
                            name="averageAnnualYield"
                            type="number"
                            step="0.1"
                            value={formData.averageAnnualYield}
                            onChange={handleInputChange}
                            placeholder="e.g., 450"
                          />
                        </div>
                      </div>

                      <div>
                        <Label className="mb-3 block">Irrigation Type * (Select at least one)</Label>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {['Drip Irrigation', 'Sprinkler', 'Flood/Surface', 'Rainfed'].map(type => (
                            <div key={type} className="flex items-center space-x-2 border rounded-lg p-3">
                              <Checkbox
                                id={type}
                                checked={formData.irrigationTypes.includes(type)}
                                onCheckedChange={(checked) => handleCheckboxChange(type, checked as boolean)}
                              />
                              <label htmlFor={type} className="text-sm cursor-pointer flex-1">
                                ☐ {type}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PAGE 3: DOCUMENTS & VERIFICATION */}
            {currentPage === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-1 text-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Documents & Verification
                  </h2>
                  <div className="h-px bg-border my-4" />
                </div>

                <div className="space-y-6">
                  {/* Documents Upload */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3 text-foreground">Document Upload</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="governmentId">Government ID Proof * (Upload)</Label>
                        <p className="text-xs text-muted-foreground mb-2">Aadhaar / Voter ID / Driving License</p>
                        <Input
                          id="governmentId"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, 'governmentId')}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground mt-1">PDF, JPG or PNG (max 5MB)</p>
                      </div>

                      <div>
                        <Label htmlFor="landDocuments">Farm Ownership Documents * (Upload)</Label>
                        <p className="text-xs text-muted-foreground mb-2">Land Records / Lease Agreement</p>
                        <Input
                          id="landDocuments"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e, 'landDocuments')}
                          className="cursor-pointer"
                        />
                        <p className="text-xs text-muted-foreground mt-1">PDF, JPG or PNG (max 10MB)</p>
                      </div>
                    </div>
                  </div>

                  {/* Bank Account Details */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3 text-foreground">Bank Account Details</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                        <Input
                          id="accountHolderName"
                          name="accountHolderName"
                          value={formData.accountHolderName}
                          onChange={handleInputChange}
                          placeholder="As per bank records"
                          required
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="bankName">Bank Name *</Label>
                          <Input
                            id="bankName"
                            name="bankName"
                            value={formData.bankName}
                            onChange={handleInputChange}
                            placeholder="e.g., State Bank of India"
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="accountNumber">Account Number *</Label>
                          <Input
                            id="accountNumber"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleInputChange}
                            placeholder="9-18 digits"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ifscCode">IFSC Code *</Label>
                          <Input
                            id="ifscCode"
                            name="ifscCode"
                            value={formData.ifscCode}
                            onChange={handleInputChange}
                            placeholder="e.g., SBIN0001234"
                            maxLength={11}
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="branchName">Branch Name</Label>
                          <Input
                            id="branchName"
                            name="branchName"
                            value={formData.branchName}
                            onChange={handleInputChange}
                            placeholder="Branch name (optional)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Security */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3 text-foreground">Account Security</h3>
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="password">Password * (min 8 characters)</Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Create password"
                            required
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Must include uppercase, lowercase, number, and special character
                          </p>
                        </div>

                        <div>
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

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="securityQuestion">Security Question *</Label>
                          <Select value={formData.securityQuestion} onValueChange={(value) => handleSelectChange('securityQuestion', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a question" />
                            </SelectTrigger>
                            <SelectContent>
                              {SECURITY_QUESTIONS.map(q => (
                                <SelectItem key={q.value} value={q.value}>{q.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="securityAnswer">Security Answer *</Label>
                          <Input
                            id="securityAnswer"
                            name="securityAnswer"
                            value={formData.securityAnswer}
                            onChange={handleInputChange}
                            placeholder="Your answer"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agreements */}
                  <div>
                    <h3 className="font-semibold text-sm mb-3 text-foreground">Agreements</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-2 border rounded-lg p-3">
                        <Checkbox
                          id="agreeTerms"
                          checked={formData.agreeTerms}
                          onCheckedChange={(checked) => handleCheckboxChange('terms', checked as boolean)}
                        />
                        <label htmlFor="agreeTerms" className="text-sm cursor-pointer leading-relaxed flex-1">
                          ☐ I agree to <span className="text-primary underline font-medium">Terms & Conditions</span> *
                        </label>
                      </div>

                      <div className="flex items-start space-x-2 border rounded-lg p-3">
                        <Checkbox
                          id="agreePrivacy"
                          checked={formData.agreePrivacy}
                          onCheckedChange={(checked) => handleCheckboxChange('privacy', checked as boolean)}
                        />
                        <label htmlFor="agreePrivacy" className="text-sm cursor-pointer leading-relaxed flex-1">
                          ☐ I agree to <span className="text-primary underline font-medium">Privacy Policy</span> *
                        </label>
                      </div>

                      <div className="flex items-start space-x-2 border rounded-lg p-3">
                        <Checkbox
                          id="agreeDataProcessing"
                          checked={formData.agreeDataProcessing}
                          onCheckedChange={(checked) => handleCheckboxChange('data', checked as boolean)}
                        />
                        <label htmlFor="agreeDataProcessing" className="text-sm cursor-pointer leading-relaxed flex-1">
                          ☐ I consent to data processing
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              <div>
                {currentPage > 1 && (
                  <Button type="button" variant="outline" onClick={handleBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Back</span>
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {currentPage === 1 && (
                  <Link to="/login?role=farmer">
                    <Button type="button" variant="ghost" size="sm" className="text-xs sm:text-sm">
                      Already registered?
                    </Button>
                  </Link>
                )}

                {currentPage < 3 ? (
                  <Button type="button" onClick={handleNext} className="gap-2">
                    <span className="hidden sm:inline">
                      Next: {currentPage === 1 ? 'Farm Details' : 'Documents'}
                    </span>
                    <span className="sm:hidden">Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={loading} className="gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="hidden sm:inline">Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Submit Registration</span>
                        <span className="sm:hidden">Submit</span>
                        <CheckCircle2 className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Card>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
