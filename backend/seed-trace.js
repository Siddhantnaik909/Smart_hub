const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config(); // Load .env variables

async function seedTraceData() {
    // Use Atlas in production, Local in development
    const isProd = process.env.NODE_ENV === "production";
    const uri = isProd ? (process.env.MONGO_ATLAS_URI || process.env.MONGO_URI) : (process.env.MONGO_LOCAL_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/smarthub");
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('smarthub');
        const users = db.collection('users');

        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const testUsers = [
            {
                name: "Rohan Sharma (Test Node)",
                email: "rohan.s@internal.hub",
                username: "rohan_trace",
                password: hashedPassword,
                role: "user",
                mobile: "+919876543210",
                lastIp: "106.213.177.104", // Reliance Jio India
                lastLogin: new Date(),
                photo: "https://ui-avatars.com/api/?name=Rohan+Sharma&background=0284c7&color=fff",
                preferences: { theme: 'light' }
            },
            {
                name: "Sarah Miller (US Node)",
                email: "sarah.m@internal.hub",
                username: "sarah_trace",
                password: hashedPassword,
                role: "user",
                mobile: "+15550123456",
                lastIp: "72.210.63.120", // Cox Communications USA
                lastLogin: new Date(),
                photo: "https://ui-avatars.com/api/?name=Sarah+Miller&background=e11d48&color=fff",
                preferences: { theme: 'dark' }
            }
        ];

        for (const u of testUsers) {
            await users.updateOne(
                { mobile: u.mobile },
                { $set: u },
                { upsert: true }
            );
        }

        console.log("Trace Seed Data Injected Successfully!");
    } finally {
        await client.close();
    }
}

seedTraceData();
