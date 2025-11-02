import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

const testCredentials = [
  { email: 'admin@ssimp.com', password: 'Admin@123' },
  { email: 'rajesh.kumar@farmer.com', password: 'Farmer@123' },
  { email: 'amit@fasttrack.com', password: 'Logistics@123' },
  { email: 'production@ssimp.com', password: 'Staff@123' },
  { email: 'quality@ssimp.com', password: 'Staff@123' },
  { email: 'hr@ssimp.com', password: 'Staff@123' },
  { email: 'support@ssimp.com', password: 'Staff@123' },
];

async function fixPasswords() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ssimp_cane_management');
    console.log('✅ Connected to MongoDB\n');

    console.log('🔧 Fixing user passwords...\n');

    for (const cred of testCredentials) {
      try {
        const user = await User.findOne({ email: cred.email });
        
        if (!user) {
          console.log(`⚠️  User not found: ${cred.email}`);
          continue;
        }

        // Set the plain password - the pre-save hook will hash it
        user.password = cred.password;
        await user.save();

        console.log(`✅ Fixed password for: ${cred.email}`);
      } catch (error) {
        console.error(`❌ Error fixing ${cred.email}:`, error.message);
      }
    }

    console.log('\n🎉 Done! All passwords have been reset.');
    console.log('\n📝 You can now login with these credentials:');
    testCredentials.forEach(cred => {
      console.log(`   ${cred.email} / ${cred.password}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

fixPasswords();
