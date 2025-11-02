/**
 * Script to create test users for all roles
 * Run this with: node scripts/createTestUsers.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema (inline for this script)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  role: { 
    type: String, 
    required: true,
    enum: ['farmer', 'logistics', 'admin', 'staff']
  },
  department: {
    type: String,
    enum: ['production', 'quality-control', 'hr', 'support']
  },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Test users to create
const testUsers = [
  {
    email: 'admin@ssimp.com',
    password: 'Admin@123',
    fullName: 'System Administrator',
    phone: '9876543210',
    role: 'admin',
    isVerified: true,
    isApproved: true,
    approvalStatus: 'approved'
  },
  {
    email: 'likhisgowda@gmail.com',
    password: 'Farmer@123',
    fullName: 'Likhi S Gowda',
    phone: '9876543211',
    role: 'farmer',
    isVerified: true,
    isApproved: true,
    approvalStatus: 'approved'
  },
  {
    email: 'farmer@test.com',
    password: 'Farmer@123',
    fullName: 'Test Farmer',
    phone: '9876543212',
    role: 'farmer',
    isVerified: true,
    isApproved: true,
    approvalStatus: 'approved'
  },
  {
    email: 'logistics@test.com',
    password: 'Logistics@123',
    fullName: 'Test Logistics Company',
    phone: '9876543213',
    role: 'logistics',
    isVerified: true,
    isApproved: true,
    approvalStatus: 'approved'
  },
  {
    email: 'staff@test.com',
    password: 'Staff@123',
    fullName: 'Test Staff Member',
    phone: '9876543214',
    role: 'staff',
    department: 'production',
    isVerified: true,
    isApproved: true,
    approvalStatus: 'approved'
  }
];

async function createTestUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssimp_cane_management');
    console.log('✅ Connected to MongoDB\n');

    console.log('👥 Creating test users...\n');

    for (const userData of testUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        
        if (existingUser) {
          console.log(`⚠️  User already exists: ${userData.email} (${userData.role})`);
          continue;
        }

        // Create user (password will be hashed by User model pre-save hook)
        const user = await User.create({
          ...userData
        });

        console.log(`✅ Created ${userData.role}: ${userData.email}`);
        console.log(`   Name: ${userData.fullName}`);
        console.log(`   Password: ${userData.password}`);
        console.log('');

      } catch (error) {
        console.error(`❌ Error creating ${userData.email}:`, error.message);
      }
    }

    console.log('\n📊 Summary:');
    const counts = await User.countDocuments();
    console.log(`Total users in database: ${counts}`);

    console.log('\n🎉 Done! You can now login with any of these accounts:');
    console.log('\n📝 Login Credentials:');
    console.log('═══════════════════════════════════════════════════════');
    testUsers.forEach(user => {
      console.log(`\n${user.role.toUpperCase()}:`);
      console.log(`  Email:    ${user.email}`);
      console.log(`  Password: ${user.password}`);
    });
    console.log('\n═══════════════════════════════════════════════════════');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
createTestUsers();
