require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_hub';

mongoose.connect(mongoUri)
    .then(async () => {
        console.log('Connected to MongoDB for seeding...');
        
        const db = mongoose.connection.db;
        const users = db.collection('users');

        // Check if admin exists
        const adminExists = await users.findOne({ email: 'admin@smarthub.com' });
        
        if (adminExists) {
            console.log('Admin user already exists.');
        } else {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await users.insertOne({
                name: 'System Admin',
                email: 'admin@smarthub.com',
                password: hashedPassword,
                role: 'admin',
                createdAt: new Date()
            });
            console.log('Admin user created: admin@smarthub.com / admin123');
        }

        process.exit(0);
    })
    .catch(err => {
        console.error('Seeding error:', err);
        process.exit(1);
    });