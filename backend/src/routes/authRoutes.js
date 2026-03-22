const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { config } = require('../config/env');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Configure Multer for profile uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../../frontend/public/uploads/profiles');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Only images are allowed (jpg, jpeg, png, webp)"));
    }
});
// Helper to get DB collection
const getUsers = (req) => req.app.locals.dbReady.collection('users');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, username } = req.body;

        if (!req.app.locals.dbReady) {
            return res.status(503).json({ message: 'System initializing, please wait...' });
        }
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const users = getUsers(req);

        // Check if user exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate username: Use provided username, or derive from email, or fallback to timestamp
        let finalUsername = username;
        if (!finalUsername) {
            finalUsername = email.split('@')[0] || `user${Date.now()}`;
        }

        // Create user
        const result = await users.insertOne({
            name,
            email,
            username: finalUsername,
            password: hashedPassword,
            role: 'user', // Default to user
            preferences: { unitWeight: 'kg', theme: 'light' },
            friends: [], // Persistent network
            socialSettings: { publicProfile: true, allowFriendRequests: true },
            createdAt: new Date()
        });

        // Create Token
        const token = jwt.sign(
            { user: { id: result.insertedId, role: 'user', username: finalUsername } },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: { id: result.insertedId, name, email, role: 'user', username: finalUsername, preferences: { unitWeight: 'kg', theme: 'light' } }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const users = getUsers(req);

        // Check user
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create Token
        const token = jwt.sign(
            { user: { id: user._id, role: user.role, username: user.username || user.email } },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, username: user.username, preferences: user.preferences || { unitWeight: 'kg', theme: 'light' } } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/auth/profile (Update self)
router.put('/profile', async (req, res) => {
    try {
        const { name, photo, id, username, email, password } = req.body;
        if (!id) return res.status(400).json({ message: 'User ID required' });

        const users = getUsers(req);

        const updateData = {};
        if (name) updateData.name = name;
        if (photo !== undefined) updateData.photo = photo;
        if (req.body.preferences) {
            updateData.preferences = req.body.preferences;
        }

        const objId = new ObjectId(id);

        // New Features: Check and update username and email
        if (username) {
            const existingUser = await users.findOne({ username, _id: { $ne: objId } });
            if (existingUser) return res.status(400).json({ message: 'Username already taken' });
            updateData.username = username;
        }

        if (email) {
            const existingEmail = await users.findOne({ email, _id: { $ne: objId } });
            if (existingEmail) return res.status(400).json({ message: 'Email already in use' });
            updateData.email = email;
        }

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        await users.updateOne({ _id: objId }, { $set: updateData });

        const updatedUser = await users.findOne({ _id: objId });
        
        // Refresh token to reflect any username/email updates in the session
        const token = jwt.sign(
            { user: { id: updatedUser._id, role: updatedUser.role, username: updatedUser.username || updatedUser.email } },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        res.json({ message: 'Profile updated successfully', token, user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role, username: updatedUser.username, photo: updatedUser.photo, preferences: updatedUser.preferences } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/auth/upload-profile
router.post('/upload-profile', (req, res) => {
    upload.single('profilePhoto')(req, res, (err) => {
        if (err) {
            console.error('Multer upload error:', err);
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
            }
            return res.status(400).json({ message: err.message || 'File upload error' });
        }

        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded. Please select an image.' });
            }

            const photoUrl = `/uploads/profiles/${req.file.filename}`;
            res.json({ photoUrl });
        } catch (error) {
            console.error('Upload route error:', error);
            res.status(500).json({ message: 'Upload failed' });
        }
    });
});

// --- SOCIAL & FRIENDS ---
const { authRequired } = require('../middleware/auth');

// GET /api/auth/friends
router.get('/friends', authRequired, async (req, res) => {
    try {
        const users = getUsers(req);
        const userId = req.user.id;
        const me = await users.findOne({ _id: new ObjectId(userId) });
        if (!me) return res.status(404).json({ message: 'User not found' });

        const friendIds = (me.friends || []).map(id => {
            try { return new ObjectId(id); } catch(e) { return null; }
        }).filter(id => id !== null);

        const friends = await users.find({
            _id: { $in: friendIds }
        }, { projection: { password: 0 } }).toArray();

        res.json(friends);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Social retrieval failed' });
    }
});

// POST /api/auth/friends/add
router.post('/friends/add', authRequired, async (req, res) => {
    try {
        const { targetId } = req.body;
        if (!targetId) return res.status(400).json({ message: 'Friend ID required' });

        const cleanTargetId = String(targetId).trim();

        // Validate ObjectId format (must be exactly 24 hex chars)
        if (!/^[a-f\d]{24}$/i.test(cleanTargetId)) {
            return res.status(400).json({ message: 'Invalid ID format. Please paste the full Hub ID (24 characters).' });
        }

        const users = getUsers(req);
        const meId = new ObjectId(req.user.id);

        let friendObjId;
        try {
            friendObjId = new ObjectId(cleanTargetId);
        } catch (e) {
            return res.status(400).json({ message: 'Invalid Hub ID. Please double-check and try again.' });
        }

        if (meId.equals(friendObjId)) {
            return res.status(400).json({ message: 'You cannot add yourself.' });
        }

        const friend = await users.findOne({ _id: friendObjId });
        if (!friend) {
            return res.status(404).json({ message: 'No user found with that Hub ID. Make sure you copied the full ID correctly.' });
        }

        // Check if already friends
        const meUser = await users.findOne({ _id: meId });
        const alreadyFriends = (meUser.friends || []).some(fid => String(fid) === cleanTargetId);
        if (alreadyFriends) {
            return res.status(400).json({ message: `${friend.name} is already in your Smart Network.` });
        }

        // Store as string consistently for easy lookup
        await users.updateOne({ _id: meId }, { $addToSet: { friends: cleanTargetId } });
        await users.updateOne({ _id: friendObjId }, { $addToSet: { friends: String(meId) } });

        res.json({
            message: 'Smart Network Linked!',
            friend: { id: friend._id, name: friend.name, username: friend.username, photo: friend.photo }
        });
    } catch (e) {
        console.error('Friend add error:', e);
        res.status(500).json({ message: 'Could not add friend. Please try again.' });
    }
});

// GET /api/auth/user/:id - Lookup user by ID (for admin or friend preview)
router.get('/user/:id', authRequired, async (req, res) => {
    try {
        const cleanId = String(req.params.id).trim();
        if (!/^[a-f\d]{24}$/i.test(cleanId)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        const users = getUsers(req);
        const user = await users.findOne({ _id: new ObjectId(cleanId) }, { projection: { password: 0 } });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (e) {
        res.status(500).json({ message: 'Lookup failed' });
    }
});

// --- MESSAGING & NOTIFICATIONS ---
const MESSAGES_FILE = path.join(__dirname, '../../data/messages.json');

async function readMessages() {
    try {
        const data = await fs.promises.readFile(MESSAGES_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return { notifications: [], chats: [] };
    }
}

async function writeMessages(messages) {
    await fs.promises.mkdir(path.dirname(MESSAGES_FILE), { recursive: true });
    await fs.promises.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

// GET /api/auth/notifications - User gets their own notifications + global ones
router.get('/notifications', authRequired, async (req, res) => {
    try {
        const msgs = await readMessages();
        const myId = req.user.id;
        const myNotifs = msgs.notifications.filter(n => n.targetUserId === 'all' || n.targetUserId === myId);
        res.json(myNotifs.reverse());
    } catch (e) {
        res.status(500).json({ message: 'Could not fetch notifications' });
    }
});

// GET /api/auth/messages/chat/:userId - Get chat history with another user
router.get('/messages/chat/:userId', authRequired, async (req, res) => {
    try {
        const myId = req.user.id;
        const targetId = String(req.params.userId).trim();
        const msgs = await readMessages();
        const history = msgs.chats.filter(c => 
            (c.fromId === myId && c.toUserId === targetId) || 
            (c.fromId === targetId && c.toUserId === myId)
        );
        res.json(history);
    } catch (e) {
        res.status(500).json({ message: 'Could not fetch chat history' });
    }
});

// POST /api/auth/messages/chat - Send a chat message or reply
router.post('/messages/chat', authRequired, async (req, res) => {
    try {
        const { toUserId, message } = req.body;
        if (!toUserId || !message) return res.status(400).json({ message: 'Missing recipient or message' });

        const myId = req.user.id;
        const cleanId = String(toUserId).trim();

        // Verify recipient
        const db = getUsers(req);
        let targetUser = await db.findOne({ _id: new ObjectId(cleanId) }, { projection: { name: 1, email: 1 } });
        if (!targetUser) return res.status(404).json({ message: 'Recipient not found' });

        // Get my details for the sender info
        const meUser = await db.findOne({ _id: new ObjectId(myId) }, { projection: { name: 1, email: 1 } });

        const msgs = await readMessages();
        const chatMsg = {
            id: Date.now().toString(),
            type: 'chat',
            from: meUser.name || meUser.email,
            fromId: myId,
            toUserId: cleanId,
            toUserName: targetUser.name || targetUser.email,
            message,
            timestamp: new Date().toISOString(),
            read: false
        };
        msgs.chats.push(chatMsg);
        await writeMessages(msgs);

        // Real-time delivery
        const io = req.app.locals.io;
        if (io) {
            io.to(`user_${cleanId}`).emit('chatMessage', chatMsg);
        }

        res.json({ message: 'Sent', chat: chatMsg });
    } catch (e) {
        console.error('Send message error:', e);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

module.exports = router;