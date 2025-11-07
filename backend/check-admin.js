import mongoose from 'mongoose';
import { User } from './src/models/user.model.js';
import { config } from './src/config/index.js';

const checkAdmin = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB\n');

    // Check for admin@marketserverprice.com
    const admin1 = await User.findOne({ email: 'admin@marketserverprice.com' });
    console.log('admin@marketserverprice.com:', admin1 ? {
      name: admin1.name,
      email: admin1.email,
      role: admin1.role,
      id: admin1._id
    } : 'NOT FOUND');

    // Check for admin@market.com
    const admin2 = await User.findOne({ email: 'admin@market.com' });
    console.log('\nadmin@market.com:', admin2 ? {
      name: admin2.name,
      email: admin2.email,
      role: admin2.role,
      id: admin2._id
    } : 'NOT FOUND');

    // List all users with admin role
    const allAdmins = await User.find({ role: 'admin' });
    console.log('\n=== ALL ADMIN USERS ===');
    allAdmins.forEach(admin => {
      console.log(`- ${admin.email} (${admin.name}) - Role: ${admin.role}`);
    });

    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

checkAdmin();
