import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/userModel.js';
import connectDB from './config/db.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    // Clear existing users
    await User.deleteMany();

    // Create users one by one so pre-save hook runs
    const adminUser = new User({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '1234567890',
      address: {
        address: '123 Nutrition Street',
        city: 'Healthville',
        pincode: '100001',
        phoneNumber: '1234567890',
      },
    });

    const Subramanian = new User({
      name: 'Subramanian',
      email: 'subramanian@example.com',
      password: 'Client@123',
      role: 'client',
      phone: '9876543210',
      address: {
        address: '456 Wellness Avenue',
        city: 'FitCity',
        pincode: '200002',
        phoneNumber: '9876543210',
      },
    });
    const Prema = new User({
      name: 'Prema',
      email: 'prema@example.com',
      password: 'Client@123',
      role: 'client',
      phone: '9876543211',
      address: {
        address: '456 Wellness Avenue',
        city: 'FitCity',
        pincode: '200002',
        phoneNumber: '9876543211',
      },
    });
    const Ram = new User({
      name: 'Ram',
      email: 'ram@example.com',
      password: 'UnitManager@123',
      role: 'Unit Manager',
      phone: '9876543212',
      address: {
        address: '456 Nachiar 7th Cross Street, Parinagar',
        city: 'Karaikudi',
        pincode: '603106',
        phoneNumber: '9876543212',
      },
    });
    const Suresh = new User({
      name: 'Suresh',
      email: 'suresh@example.com',
      password: 'UnitManager@123',
      role: 'Unit Manager',
      phone: '9876543213',
      address: {
        address: '456 Nachiar 7th Cross Street, Parinagar',
        city: 'Karaikudi',
        pincode: '603106',
        phoneNumber: '9876543213',
      },
    });
    const Ramesh = new User({
      name: 'Ramesh',
      email: 'ramesh@example.com',
      password: 'UnitManager@123',
      role: 'Unit Manager',
      phone: '9876543214',
      address: {
        address: '456 Nachiar 7th Cross Street, Parinagar',
        city: 'Karaikudi',
        pincode: '603106',
        phoneNumber: '9876543214',
      },
    });
    const Babu = new User({
      name: 'Babu',
      email: 'babu@example.com',
      password: 'UnitManager@123',
      role: 'Unit Manager',
      phone: '9876543215',
      address: {
        address: '456 Nachiar 7th Cross Street, Parinagar',
        city: 'Karaikudi',
        pincode: '603106',
        phoneNumber: '9876543215',
      },
    });
    const Latha = new User({
      name: 'Latha',
      email: 'latha@example.com',
      password: 'UnitManager@123',
      role: 'Unit Manager',
      phone: '9876543216',
      address: {
        address: '456 Nachiar 7th Cross Street, Parinagar',
        city: 'Karaikudi',
        pincode: '603106',
        phoneNumber: '9876543216',
      },
    });
    

    await adminUser.save();
    await Subramanian.save();
    await Prema.save();
    await Ram.save();
    await Suresh.save();
    await Ramesh.save();
    await Babu.save();
    await Latha.save();
    

    console.log('✅ Users seeded successfully with hashed passwords!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error seeding users: ${error.message}`);
    process.exit(1);
  }
};

importData();
