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
        const { name, email, password } = req.body;
        const users = getUsers(req);

        // Check if user exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await users.insertOne({
            name,
            email,
            password: hashedPassword,
            role: 'admin', // Default to admin for personal test use
            createdAt: new Date()
        });

        // Create Token
        const token = jwt.sign(
            { user: { id: result.insertedId, role: 'admin' } },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: { id: result.insertedId, name, email, role: 'admin' }
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

        // Force upgrade all older accounts to 'admin' role seamlessly
        if (user.role !== 'admin') {
            await users.updateOne({ _id: user._id }, { $set: { role: 'admin' } });
            user.role = 'admin';
        }

        // Create Token
        const token = jwt.sign(
            { user: { id: user._id, role: user.role } },
            config.jwtSecret,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/auth/profile (Update self)
router.put('/profile', async (req, res) => {
    try {
        const { name, photo, id } = req.body;
        if (!id) return res.status(400).json({ message: 'User ID required' });

        const users = getUsers(req);

        const updateData = {};
        if (name) updateData.name = name;
        if (photo !== undefined) updateData.photo = photo;

        const objId = new ObjectId(id);
        await users.updateOne({ _id: objId }, { $set: updateData });

        const updatedUser = await users.findOne({ _id: objId });
        res.json({ user: { id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role, photo: updatedUser.photo } });
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

module.exports = router;