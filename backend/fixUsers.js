require('dotenv').config();
const mongoose = require('mongoose');
const { config } = require('./src/config/env');

console.log("Connecting to database to fix users...");

mongoose.connect(config.mongoUri)
    .then(async () => {
        const db = mongoose.connection.db;
        const usersCollection = db.collection('users');

        // Find users with missing or null username
        const usersToFix = await usersCollection.find({
            $or: [{ username: { $exists: false } }, { username: null }]
        }).toArray();

        console.log(`Found ${usersToFix.length} users to fix.`);

        for (const user of usersToFix) {
            // Generate a username from email or ID
            const newUsername = user.email ? user.email.split('@')[0] : `user_${user._id}`;
            
            // Update the user
            await usersCollection.updateOne(
                { _id: user._id },
                { $set: { username: newUsername } }
            );
            console.log(`Fixed user: ${user.email} -> username: ${newUsername}`);
        }

        console.log("All users fixed.");
        process.exit(0);
    })
    .catch(err => {
        console.error("Error:", err);
        process.exit(1);
    });