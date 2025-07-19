import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Member, Gym, Admin, Visit, Transaction } from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gym_management', {
      tls: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Visit.deleteMany({});
    await Transaction.deleteMany({});
    console.log('Cleared existing data');

    // Create Admin user
    const admin = new Admin({
      name: 'Super Admin',
      email: process.env.ADMIN_EMAIL || 'admin@fitflow.com',
      password: process.env.ADMIN_PASSWORD || 'admin123456',
      role: 'admin',
      permissions: ['manage_users', 'manage_gyms', 'view_reports', 'manage_transactions']
    });
    await admin.save();
    console.log('✅ Admin user created');

    // Create sample gyms
    const gyms = [
      {
        name: 'FitZone Downtown',
        email: 'fitzone@example.com',
        password: 'temp123456',
        gymCode: 'FZ001',
        location: {
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        facilities: ['Weight Training', 'Cardio', 'Swimming Pool', 'Sauna'],
        capacity: 200,
        phone: '(555) 123-4567'
      },
      {
        name: 'PowerHouse Gym',
        email: 'powerhouse@example.com',
        password: 'temp123456',
        gymCode: 'PH002',
        location: {
          address: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210'
        },
        facilities: ['Weight Training', 'Cardio', 'Group Classes', 'Personal Training'],
        capacity: 150,
        phone: '(555) 234-5678'
      },
      {
        name: 'Elite Fitness',
        email: 'elite@example.com',
        password: 'temp123456',
        gymCode: 'EF003',
        location: {
          address: '789 Pine St',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601'
        },
        facilities: ['Weight Training', 'Cardio', 'Yoga Studio', 'Rock Climbing'],
        capacity: 120,
        phone: '(555) 345-6789'
      },
      {
        name: 'Strength Studio',
        email: 'strength@example.com',
        password: 'temp123456',
        gymCode: 'SS004',
        location: {
          address: '321 Elm Dr',
          city: 'Houston',
          state: 'TX',
          zipCode: '77001'
        },
        facilities: ['Weight Training', 'Functional Training', 'Boxing'],
        capacity: 80,
        phone: '(555) 456-7890'
      },
      {
        name: 'Flex Gym',
        email: 'flex@example.com',
        password: 'temp123456',
        gymCode: 'FG005',
        location: {
          address: '654 Maple Ln',
          city: 'Miami',
          state: 'FL',
          zipCode: '33101'
        },
        facilities: ['Weight Training', 'Cardio', 'Swimming Pool', 'Basketball Court'],
        capacity: 180,
        phone: '(555) 567-8901'
      }
    ];

    const createdGyms = [];
    for (const gymData of gyms) {
      const gym = new Gym({ ...gymData, role: 'gym' });
      await gym.save();
      createdGyms.push(gym);
    }
    console.log('✅ Gyms created');

    // Create sample members
    const members = [
      {
        name: 'Alex Johnson',
        email: 'alex@example.com',
        password: 'member123456',
        phone: '(555) 111-1111',
        tokens: 15,
        subscription: {
          plan: 'monthly',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-31'),
          isActive: true
        }
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        password: 'member123456',
        phone: '(555) 222-2222',
        tokens: 287,
        subscription: {
          plan: 'yearly',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          isActive: true
        }
      },
      {
        name: 'Mike Chen',
        email: 'mike@example.com',
        password: 'member123456',
        phone: '(555) 333-3333',
        tokens: 3,
        subscription: {
          plan: 'weekly',
          startDate: new Date('2024-01-08'),
          endDate: new Date('2024-01-15'),
          isActive: true
        }
      },
      {
        name: 'Emma Davis',
        email: 'emma@example.com',
        password: 'member123456',
        phone: '(555) 444-4444',
        tokens: 22,
        subscription: {
          plan: 'monthly',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-31'),
          isActive: true
        }
      },
      {
        name: 'Tom Brown',
        email: 'tom@example.com',
        password: 'member123456',
        phone: '(555) 555-5555',
        tokens: 8,
        subscription: {
          plan: 'monthly',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-31'),
          isActive: true
        }
      },
      {
        name: 'Lisa Garcia',
        email: 'lisa@example.com',
        password: 'member123456',
        phone: '(555) 666-6666',
        tokens: 45,
        subscription: {
          plan: 'monthly',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-01-31'),
          isActive: true
        }
      },
      {
        name: 'David Miller',
        email: 'david@example.com',
        password: 'member123456',
        phone: '(555) 777-7777',
        tokens: 120,
        subscription: {
          plan: 'yearly',
          startDate: new Date('2024-01-01'),
          endDate: new Date('2024-12-31'),
          isActive: true
        }
      },
      {
        name: 'Amy Taylor',
        email: 'amy@example.com',
        password: 'member123456',
        phone: '(555) 888-8888',
        tokens: 2,
        subscription: {
          plan: 'weekly',
          startDate: new Date('2024-01-08'),
          endDate: new Date('2024-01-15'),
          isActive: true
        }
      }
    ];

    const createdMembers = [];
    for (const memberData of members) {
      const member = new Member({ ...memberData, role: 'member' });
      await member.save();
      createdMembers.push(member);
    }
    console.log(' Members created');

    // Create sample visits
    const visits = [];
    const visitDates = [
      new Date('2024-01-15'),
      new Date('2024-01-14'),
      new Date('2024-01-13'),
      new Date('2024-01-12'),
      new Date('2024-01-11'),
      new Date('2024-01-10'),
      new Date('2024-01-09'),
      new Date('2024-01-08'),
    ];

    for (const date of visitDates) {
      // Random visits for each day
      const numberOfVisits = Math.floor(Math.random() * 10) + 5; // 5-15 visits per day
      
      for (let i = 0; i < numberOfVisits; i++) {
        const randomMember = createdMembers[Math.floor(Math.random() * createdMembers.length)];
        const randomGym = createdGyms[Math.floor(Math.random() * createdGyms.length)];
        
        // Check if this member already visited this gym on this date
        const existingVisit = visits.find(v => 
          v.member.toString() === randomMember._id.toString() && 
          v.gym.toString() === randomGym._id.toString() &&
          v.date.toDateString() === date.toDateString()
        );
        
        if (!existingVisit) {
          const checkInTime = new Date(date);
          checkInTime.setHours(Math.floor(Math.random() * 14) + 6); // 6 AM to 8 PM
          checkInTime.setMinutes(Math.floor(Math.random() * 60));
          
          const visit = new Visit({
            member: randomMember._id,
            gym: randomGym._id,
            date: date,
            checkInTime: checkInTime,
            tokensUsed: 1
          });
          
          visits.push(visit);
        }
      }
    }

    await Visit.insertMany(visits);
    console.log(` ${visits.length} visits created`);

    // Create sample transactions
    const transactions = [];
    const planPrices = { weekly: 29.99, monthly: 99.99, yearly: 999.99 };
    const planTokens = { weekly: 7, monthly: 30, yearly: 365 };
    
    for (const member of createdMembers) {
      const plan = member.subscription?.plan;
      if (plan) {
        const transaction = new Transaction({
          member: member._id,
          type: 'purchase',
          plan: plan,
          amount: planPrices[plan as keyof typeof planPrices],
          tokens: planTokens[plan as keyof typeof planTokens],
          paymentMethod: 'mock',
          paymentStatus: 'completed',
          transactionId: uuidv4(),
          description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} subscription purchase`,
          createdAt: member.subscription?.startDate || new Date()
        });
        transactions.push(transaction);
      }
    }

    await Transaction.insertMany(transactions);
    console.log(` ${transactions.length} transactions created`);

    console.log('\n Seed data created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin:');
    console.log(`  Email: ${admin.email}`);
    console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'admin123456'}`);
    console.log('\nGyms:');
    createdGyms.forEach(gym => {
      console.log(`  ${gym.name} (${gym.gymCode}): ${gym.email} / temp123456`);
    });
    console.log('\nMembers:');
    createdMembers.forEach(member => {
      console.log(`  ${member.name}: ${member.email} / member123456`);
    });

  } catch (error) {
    console.error(' Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n Database connection closed');
    process.exit(0);
  }
};

// Run the seed function
seedData(); 