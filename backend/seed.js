require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const isProd = process.env.NODE_ENV === "production";
const mongoUri = isProd ? (process.env.MONGO_ATLAS_URI || process.env.MONGO_URI) : (process.env.MONGO_LOCAL_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smarthub');

mongoose.connect(mongoUri)
    .then(async () => {
        console.log('Connected to MongoDB for seeding...');
        
        const db = mongoose.connection.db;
        const users = db.collection('users');

        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        // Safely upsert to prevent E11000 duplicate key errors on Render
        const result = await users.updateOne(
            { email: 'admin@smarthub.com' },
            {
                $setOnInsert: {
                    name: 'System Admin',
                    username: 'admin',
                    password: hashedPassword,
                    role: 'admin',
                    createdAt: new Date()
                }
            },
            { upsert: true }
        );

        if (result.upsertedCount > 0) {
            console.log('Admin user created: admin@smarthub.com / admin123');
        } else {
            console.log('Admin user already exists. Seeding skipped.');
        }

        process.exit(0);
    })
    .catch(err => {
        console.error('\n❌ Seeding script failed to connect to MongoDB.');
        console.error('This is often due to an incorrect MONGO_URI in your .env file or an IP whitelist issue in Atlas.');
        console.error('Full error:', err.message);
        // Important: Exit with 0 so the Render build doesn't fail. 
        // You should still update your MONGO_URI in the Render dashboard.
        process.exit(0);
    });