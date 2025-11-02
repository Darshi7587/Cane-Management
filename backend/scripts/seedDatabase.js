import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Define User Schema (matching your auth system)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true,
    enum: ['farmer', 'logistics', 'admin', 'staff']
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'inactive', 'rejected'],
    default: 'pending'
  },
  mobileNumber: String,
  isEmailVerified: { type: Boolean, default: false },
  department: String, // for staff
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Define Farmer Schema
const farmerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  digitalFarmerId: String,
  name: String,
  email: String,
  mobileNumber: String,
  dateOfBirth: Date,
  gender: String,
  
  // Farm Details
  farmName: String,
  farmRegistrationNumber: String,
  areaInAcres: Number,
  address: {
    street: String,
    village: String,
    district: String,
    state: String,
    pinCode: String
  },
  gpsCoordinates: {
    latitude: Number,
    longitude: Number
  },
  farmType: String,
  caneVariety: String,
  averageYield: Number,
  soilType: String,
  irrigationType: [String],
  
  // Bank Details
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    branchName: String,
    accountHolderName: String
  },
  
  // Status
  status: { type: String, default: 'Active' },
  netPayable: { type: Number, default: 0 },
  blockchainWalletAddress: String,
  blockchainVerified: { type: Boolean, default: false },
  
  registrationDate: { type: Date, default: Date.now },
  lastDeliveryDate: Date,
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Farmer = mongoose.model('Farmer', farmerSchema);

// Define LogisticsPartner Schema
const logisticsPartnerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: String,
  contactPerson: String,
  email: { type: String, unique: true },
  mobileNumber: String,
  
  // Company Details
  gstNumber: String,
  panNumber: String,
  address: {
    street: String,
    city: String,
    state: String,
    pinCode: String
  },
  
  // Fleet Details
  fleetSize: Number,
  vehicleTypes: [String],
  
  status: { type: String, default: 'active' },
  activeDeliveries: { type: Number, default: 0 },
  completedDeliveries: { type: Number, default: 0 },
  rating: { type: Number, default: 4.5 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const LogisticsPartner = mongoose.model('LogisticsPartner', logisticsPartnerSchema);

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Farmer.deleteMany({});
    await LogisticsPartner.deleteMany({});
    console.log('✅ Cleared existing data\n');

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    const farmerPassword = await bcrypt.hash('Farmer@123', 12);
    const logisticsPassword = await bcrypt.hash('Logistics@123', 12);
    const staffPassword = await bcrypt.hash('Staff@123', 12);

    // ==================== CREATE ADMIN USER ====================
    console.log('👑 Creating Admin User...');
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@ssimp.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      mobileNumber: '+91-9876543210',
      isEmailVerified: true
    });
    console.log('✅ Admin created:', adminUser.email);
    console.log('   Password: Admin@123\n');

    // ==================== CREATE SAMPLE FARMERS ====================
    console.log('🌾 Creating Sample Farmers...');
    
    const farmers = [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@farmer.com',
        mobileNumber: '+91-9876543201',
        farmName: 'Kumar Sugarcane Farm',
        areaInAcres: 25.5,
        village: 'Kanakapura',
        district: 'Ramanagara',
        state: 'Karnataka',
        caneVariety: 'Co 86032',
        status: 'Active'
      },
      {
        name: 'Lakshmi Devi',
        email: 'lakshmi.devi@farmer.com',
        mobileNumber: '+91-9876543202',
        farmName: 'Devi Organic Farm',
        areaInAcres: 18.2,
        village: 'Mandya',
        district: 'Mandya',
        state: 'Karnataka',
        caneVariety: 'Co 0238',
        status: 'Active'
      },
      {
        name: 'Suresh Patil',
        email: 'suresh.patil@farmer.com',
        mobileNumber: '+91-9876543203',
        farmName: 'Patil Agro Farms',
        areaInAcres: 42.0,
        village: 'Belgaum',
        district: 'Belgaum',
        state: 'Karnataka',
        caneVariety: 'CoC 671',
        status: 'Active'
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@farmer.com',
        mobileNumber: '+91-9876543204',
        farmName: 'Sharma Cane Estates',
        areaInAcres: 35.8,
        village: 'Mysore',
        district: 'Mysore',
        state: 'Karnataka',
        caneVariety: 'Co 94008',
        status: 'Active'
      },
      {
        name: 'Venkatesh Reddy',
        email: 'venkatesh.reddy@farmer.com',
        mobileNumber: '+91-9876543205',
        farmName: 'Reddy Plantations',
        areaInAcres: 52.3,
        village: 'Chikkaballapur',
        district: 'Chikkaballapur',
        state: 'Karnataka',
        caneVariety: 'Co 0118',
        status: 'Active'
      }
    ];

    for (const farmerData of farmers) {
      // Create user
      const user = await User.create({
        name: farmerData.name,
        email: farmerData.email,
        password: farmerPassword,
        role: 'farmer',
        status: 'active',
        mobileNumber: farmerData.mobileNumber,
        isEmailVerified: true
      });

      // Create farmer profile
      await Farmer.create({
        userId: user._id,
        digitalFarmerId: `SSIMP-F-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        name: farmerData.name,
        email: farmerData.email,
        mobileNumber: farmerData.mobileNumber,
        dateOfBirth: new Date('1980-01-15'),
        gender: 'Male',
        farmName: farmerData.farmName,
        farmRegistrationNumber: `FR-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
        areaInAcres: farmerData.areaInAcres,
        address: {
          village: farmerData.village,
          district: farmerData.district,
          state: farmerData.state,
          pinCode: '560001'
        },
        gpsCoordinates: {
          latitude: 12.9716 + Math.random() * 0.5,
          longitude: 77.5946 + Math.random() * 0.5
        },
        farmType: 'Owned',
        caneVariety: farmerData.caneVariety,
        averageYield: 80 + Math.random() * 40,
        soilType: 'Red Loamy',
        irrigationType: ['Drip Irrigation', 'Sprinkler'],
        bankDetails: {
          accountNumber: `XXXX${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          ifscCode: 'SBIN0001234',
          bankName: 'State Bank of India',
          branchName: 'Bangalore Main',
          accountHolderName: farmerData.name
        },
        status: farmerData.status,
        netPayable: Math.floor(Math.random() * 500000) + 100000,
        blockchainVerified: Math.random() > 0.5,
        registrationDate: new Date(),
        lastDeliveryDate: new Date()
      });

      console.log(`   ✓ ${farmerData.name} (${farmerData.email})`);
    }
    console.log(`✅ Created ${farmers.length} farmers\n`);

    // ==================== CREATE SAMPLE LOGISTICS PARTNERS ====================
    console.log('🚛 Creating Sample Logistics Partners...');
    
    const logisticsPartners = [
      {
        companyName: 'FastTrack Logistics',
        contactPerson: 'Amit Singh',
        email: 'amit@fasttrack.com',
        mobileNumber: '+91-9876543301',
        gstNumber: 'GST123456789',
        fleetSize: 15,
        completedDeliveries: 450
      },
      {
        companyName: 'Express Transport Co',
        contactPerson: 'Sanjay Verma',
        email: 'sanjay@express.com',
        mobileNumber: '+91-9876543302',
        gstNumber: 'GST987654321',
        fleetSize: 22,
        completedDeliveries: 680
      },
      {
        companyName: 'Quick Cargo Services',
        contactPerson: 'Rahul Gupta',
        email: 'rahul@quickcargo.com',
        mobileNumber: '+91-9876543303',
        gstNumber: 'GST456789123',
        fleetSize: 10,
        completedDeliveries: 320
      }
    ];

    for (const logisticsData of logisticsPartners) {
      // Create user
      const user = await User.create({
        name: logisticsData.contactPerson,
        email: logisticsData.email,
        password: logisticsPassword,
        role: 'logistics',
        status: 'active',
        mobileNumber: logisticsData.mobileNumber,
        isEmailVerified: true
      });

      // Create logistics partner profile
      await LogisticsPartner.create({
        userId: user._id,
        companyName: logisticsData.companyName,
        contactPerson: logisticsData.contactPerson,
        email: logisticsData.email,
        mobileNumber: logisticsData.mobileNumber,
        gstNumber: logisticsData.gstNumber,
        panNumber: `PAN${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
        address: {
          street: '123 Transport Nagar',
          city: 'Bangalore',
          state: 'Karnataka',
          pinCode: '560001'
        },
        fleetSize: logisticsData.fleetSize,
        vehicleTypes: ['Truck', 'Mini Truck', 'Tempo'],
        status: 'Active',
        activeDeliveries: Math.floor(Math.random() * 5),
        completedDeliveries: logisticsData.completedDeliveries,
        rating: 4.2 + Math.random() * 0.7
      });

      console.log(`   ✓ ${logisticsData.companyName} (${logisticsData.email})`);
    }
    console.log(`✅ Created ${logisticsPartners.length} logistics partners\n`);

    // ==================== CREATE SAMPLE STAFF USERS ====================
    console.log('👥 Creating Sample Staff Users...');
    
    const staffUsers = [
      { name: 'Production Manager', email: 'production@ssimp.com', department: 'production' },
      { name: 'Quality Controller', email: 'quality@ssimp.com', department: 'quality' },
      { name: 'HR Manager', email: 'hr@ssimp.com', department: 'hr' },
      { name: 'Support Engineer', email: 'support@ssimp.com', department: 'support' }
    ];

    for (const staffData of staffUsers) {
      await User.create({
        name: staffData.name,
        email: staffData.email,
        password: staffPassword,
        role: 'staff',
        department: staffData.department,
        status: 'active',
        mobileNumber: `+91-98765433${String(Math.floor(Math.random() * 100)).padStart(2, '0')}`,
        isEmailVerified: true
      });
      console.log(`   ✓ ${staffData.name} (${staffData.email})`);
    }
    console.log(`✅ Created ${staffUsers.length} staff users\n`);

    // ==================== SUMMARY ====================
    console.log('═══════════════════════════════════════════════════════════');
    console.log('🎉 DATABASE SEEDING COMPLETED SUCCESSFULLY!\n');
    console.log('📊 Summary:');
    console.log(`   • Admin Users: 1`);
    console.log(`   • Farmers: ${farmers.length}`);
    console.log(`   • Logistics Partners: ${logisticsPartners.length}`);
    console.log(`   • Staff Users: ${staffUsers.length}`);
    console.log(`   • Total Users: ${1 + farmers.length + logisticsPartners.length + staffUsers.length}\n`);
    
    console.log('🔑 Login Credentials:\n');
    console.log('   ADMIN:');
    console.log('   📧 Email: admin@ssimp.com');
    console.log('   🔒 Password: Admin@123\n');
    
    console.log('   FARMER (sample):');
    console.log('   📧 Email: rajesh.kumar@farmer.com');
    console.log('   🔒 Password: Farmer@123\n');
    
    console.log('   LOGISTICS (sample):');
    console.log('   📧 Email: amit@fasttrack.com');
    console.log('   🔒 Password: Logistics@123\n');
    
    console.log('   STAFF (sample):');
    console.log('   📧 Email: production@ssimp.com');
    console.log('   🔒 Password: Staff@123\n');
    
    console.log('═══════════════════════════════════════════════════════════');
    
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedDatabase();
