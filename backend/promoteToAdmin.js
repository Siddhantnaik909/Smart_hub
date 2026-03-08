require('dotenv').config();
const mongoose = require('mongoose');
const { config } = require('./src/config/env');

// Get email from command line argument
const email = process.argv[2];

if (!email) {
    console.log("Usage: node promoteToAdmin.js <email_address>");
    process.exit(1);
}

mongoose.connect(config.mongoUri)
    .then(async () => {
        console.log('Connected to MongoDB...');
        const db = mongoose.connection.db;
        
        const result = await db.collection('users').updateOne(
            { email: email },
            { $set: { role: 'admin' } }
        );

        if (result.matchedCount === 0) {
            console.log(`User with email '${email}' not found.`);
        } else {
            console.log(`Success! User '${email}' is now an admin.`);
        }
        process.exit(0);
    })
    .catch(err => {
        console.error("Error:", err);
        process.exit(1);
    });