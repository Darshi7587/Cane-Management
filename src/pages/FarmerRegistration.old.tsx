import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface FarmerFormData {
  name: string;
  email: string;
  mobileNumber: string;
  areaInAcres: number;
  landLocation: string;
  cropHistory: Array<{
    crop: string;
    year: number;
    quantity: number;
    unit: string;
  }>;
}

interface RegistrationResponse {
  success: boolean;
  message: string;
  errors?: Array<{
    msg: string;
    message: string;
    param: string;
  }>;
  farmer?: {
    _id: string;
    digitalFarmerId: string;
    blockchainWalletAddress: string;
    blockchainTransactionHash: string;
    blockchainVerified: boolean;
  };
  blockchain?: {
    registered: boolean;
    transactionHash: string;
  };
}

export default function FarmerRegistration() {
  const [formData, setFormData] = useState<FarmerFormData>({
    name: '',
    email: '',
    mobileNumber: '',
    areaInAcres: 0,
    landLocation: '',
    cropHistory: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationResponse | null>(null);

  /**
   * Handle form input changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'areaInAcres' ? parseFloat(value) || 0 : value
    }));
  };

  /**
   * Handle form submission
   * Sends farmer registration data to backend API
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Name is required');
      }
      if (!formData.mobileNumber.trim()) {
        throw new Error('Mobile number is required');
      }

      // Make API call to backend
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/farmers/register-farmer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          areaInAcres: formData.areaInAcres,
          landLocation: formData.landLocation,
          cropHistory: formData.cropHistory,
        }),
        credentials: 'include', // Include cookies for CORS
      });

      const data: RegistrationResponse = await response.json();

      if (!response.ok) {
        // Extract validation errors if present
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map((err) => err.msg || err.message).join(', ');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Registration failed');
      }

      // Success!
      setSuccess(true);
      setRegistrationData(data);
      setFormData({
        name: '',
        email: '',
        mobileNumber: '',
        areaInAcres: 0,
        landLocation: '',
        cropHistory: [],
      });

      console.log('✅ Farmer registered successfully:', data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      console.error('❌ Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle fetching farmer details
   */
  const handleViewFarmerDetails = async (farmerId: string) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/farmers/get-farmer/${farmerId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch farmer details');
      }

      const data = await response.json();
      console.log('📋 Farmer details:', data);
    } catch (err) {
      console.error('❌ Error fetching details:', err);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">🧑‍🌾 Farmer Registration</h1>
        <p className="text-muted-foreground">
          Register as a farmer and get your Digital Farmer ID with blockchain verification
        </p>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Registration Form</CardTitle>
            <CardDescription>
              Complete the form to receive your unique Digital Farmer ID
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Success Message */}
            {success && registrationData?.farmer && (
              <div className="mb-6 space-y-4">
                <Alert className="border-success/50 bg-success/10">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <AlertDescription className="text-foreground">
                    {registrationData.message}
                  </AlertDescription>
                </Alert>

                {/* Digital Farmer ID Display */}
                <Card className="border-success/50 bg-success/5">
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Digital Farmer ID</Label>
                        <p className="text-2xl font-bold text-success">
                          {registrationData.farmer.digitalFarmerId}
                        </p>
                      </div>

                      {registrationData.blockchain?.registered && (
                        <>
                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              Blockchain Status
                            </Label>
                            <p className="text-sm text-success font-medium">
                              ✅ Verified on Blockchain
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              Transaction Hash
                            </Label>
                            <p className="text-xs font-mono text-muted-foreground break-all">
                              {registrationData.blockchain.transactionHash}
                            </p>
                          </div>

                          <div>
                            <Label className="text-sm font-medium text-muted-foreground">
                              Wallet Address
                            </Label>
                            <p className="text-xs font-mono text-muted-foreground break-all">
                              {registrationData.farmer.blockchainWalletAddress}
                            </p>
                          </div>
                        </>
                      )}

                      <div className="pt-4 space-y-2">
                        <Button
                          className="w-full"
                          onClick={() => handleViewFarmerDetails(registrationData.farmer.digitalFarmerId)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setSuccess(false)}
                        >
                          Register Another Farmer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <Alert className="mb-6 border-destructive/50 bg-destructive/10">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-foreground">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Registration Form */}
            {!success && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Mobile Number Field */}
                <div>
                  <Label htmlFor="mobileNumber">Mobile Number *</Label>
                  <Input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    required
                    disabled={loading}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Used for communication and account recovery
                  </p>
                </div>

                {/* Email Field */}
                <div>
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    disabled={loading}
                  />
                </div>

                {/* Area in Acres */}
                <div>
                  <Label htmlFor="areaInAcres">Farm Size (Acres)</Label>
                  <Input
                    id="areaInAcres"
                    name="areaInAcres"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.areaInAcres}
                    onChange={handleInputChange}
                    placeholder="5.5"
                    disabled={loading}
                  />
                </div>

                {/* Land Location */}
                <div>
                  <Label htmlFor="landLocation">Land Location</Label>
                  <Input
                    id="landLocation"
                    name="landLocation"
                    type="text"
                    value={formData.landLocation}
                    onChange={handleInputChange}
                    placeholder="Village, District, State"
                    disabled={loading}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    '📝 Register Farmer'
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Your data will be securely stored and recorded on the blockchain for transparency
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * INTEGRATION STEPS
 * =================
 * 
 * 1. Copy this component to src/pages/FarmerRegistration.tsx
 * 
 * 2. Add route in your router (e.g., src/App.tsx):
 *    import FarmerRegistration from './pages/FarmerRegistration';
 *    
 *    <Route path="/register-farmer" element={<FarmerRegistration />} />
 * 
 * 3. Add link in navigation (e.g., Navbar.tsx):
 *    <Link to="/register-farmer">Register Farmer</Link>
 * 
 * 4. Ensure backend is running:
 *    npm run dev (in backend directory)
 * 
 * 5. Test the form submission
 * 
 * 
 * API ENDPOINTS
 * =============
 * 
 * POST /api/farmers/register-farmer
 * - Register a new farmer
 * - Returns: farmer details + blockchain transaction hash
 * 
 * GET /api/farmers/get-farmer/:id
 * - Get farmer details by ID, digital farmer ID, or mobile number
 * - Returns: complete farmer profile + blockchain verification
 * 
 * GET /api/farmers
 * - Get all farmers (with optional filters)
 * 
 * 
 * ERROR HANDLING
 * ==============
 * 
 * Common errors and solutions:
 * 
 * 1. "Farmer with this mobile number already registered"
 *    - User already has an account
 *    - Show "Forgot Digital ID?" or "Update Profile" option
 * 
 * 2. "Invalid mobile number format"
 *    - Mobile number doesn't match expected format
 *    - Show format hint to user
 * 
 * 3. "Blockchain registration failed"
 *    - Network error or insufficient gas
 *    - Farmer still registered in database
 *    - Show warning but allow continuation
 * 
 * 
 * BLOCKCHAIN FEATURES
 * ===================
 * 
 * ✅ Features implemented:
 * - Generate unique Digital Farmer ID (FARM-YYYY-XXXX)
 * - Create tamper-proof hash of farmer details
 * - Register on blockchain with wallet generation
 * - Store transaction hash for traceability
 * - Support for blockchain verification
 * 
 * 🔐 Security features:
 * - SHA-256 hashing of farmer data
 * - Private key management
 * - Transaction signing before broadcast
 * - Input validation on both client and server
 * - CORS protection
 */
