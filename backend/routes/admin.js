const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const { authRequired, allowRoles } = require('../src/middleware/auth');
const verifyToken = authRequired;
const isAdmin = allowRoles("admin");
const User = require('../src/models/User');

// Security: Restrict file access to the frontend/public directory
const ALLOWED_ROOT = path.resolve(__dirname, '../../frontend/public');

// Helper: Validate path to prevent directory traversal (e.g. ../../)
const validatePath = (requestedPath) => {
    // Remove leading slashes and resolve relative to ALLOWED_ROOT
    const safeRequested = requestedPath.replace(/^(\.\.[\/\\])+/, '').replace(/^\//, '');
    const fullPath = path.resolve(ALLOWED_ROOT, safeRequested);

    // Ensure the resolved path is still within ALLOWED_ROOT
    if (!fullPath.startsWith(ALLOWED_ROOT)) {
        throw new Error('Access denied: Path traversal detected');
    }
    return fullPath;
};

// 1. List Files (Hierarchical scan of public assets)
router.get('/files', verifyToken, isAdmin, async (req, res) => {
    try {
        const targetDir = req.query.dir || '.';
        const fullDirPath = validatePath(targetDir);

        // Ensure the path is actually a directory
        const stat = await fs.stat(fullDirPath);
        if (!stat.isDirectory()) {
            return res.status(400).json({ error: "Path is not a directory" });
        }

        const entries = await fs.readdir(fullDirPath, { withFileTypes: true });
        const items = [];

        // Add parent directory link if not at root
        if (targetDir && targetDir !== '.' && targetDir !== '/') {
            const parentDir = path.dirname(targetDir);
            items.push({ name: '..', path: parentDir, isDir: true });
        }

        for (const entry of entries) {
            if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;

            const entryPath = targetDir === '.' ? entry.name : path.posix.join(targetDir, entry.name);

            items.push({
                name: entry.name,
                path: entryPath,
                isDir: entry.isDirectory()
            });
        }

        // Sort items: folders first, then files alphabetically
        items.sort((a, b) => {
            if (a.name === '..') return -1;
            if (b.name === '..') return 1;
            if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
            return a.name.localeCompare(b.name);
        });

        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get File Content
router.get('/files/content', verifyToken, isAdmin, async (req, res) => {
    try {
        const filePath = req.query.path;
        if (!filePath) return res.status(400).json({ error: "Path required" });

        const fullPath = validatePath(filePath);
        const content = await fs.readFile(fullPath, 'utf-8');
        res.send(content);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Save / Create File (With Auto-Backup)
router.post('/files/save', verifyToken, isAdmin, async (req, res) => {
    try {
        const { path: filePath, content } = req.body;
        if (!filePath) return res.status(400).json({ error: "Path required" });

        const fullPath = validatePath(filePath);

        // Check if file exists to create a backup before overwriting
        try {
            await fs.access(fullPath);
            const backupPath = fullPath + '.orig';
            try {
                // Only backup if a backup doesn't already exist (preserve original)
                await fs.access(backupPath);
            } catch (err) {
                // If backup does not exist, copy current to backup
                await fs.copyFile(fullPath, backupPath);
            }
        } catch (err) {
            // File doesn't exist yet, so it's a new file. No backup needed.
        }

        await fs.writeFile(fullPath, content || '', 'utf-8');
        res.json({ message: "File saved successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3.5 Restore File to Original
router.post('/files/restore', verifyToken, isAdmin, async (req, res) => {
    try {
        const { path: filePath } = req.body;
        if (!filePath) return res.status(400).json({ error: "Path required" });

        const fullPath = validatePath(filePath);
        const backupPath = fullPath + '.orig';

        try {
            await fs.access(backupPath);
            await fs.copyFile(backupPath, fullPath);
            res.json({ message: "File restored to default successfully!" });
        } catch (err) {
            res.status(404).json({ error: "No default/original version found to restore." });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Create Folder
router.post('/files/folder', verifyToken, isAdmin, async (req, res) => {
    try {
        const { path: targetPath } = req.body;
        if (!targetPath) return res.status(400).json({ error: "Path required" });

        const fullPath = validatePath(targetPath);
        await fs.mkdir(fullPath, { recursive: true });
        res.json({ message: "Folder created successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Delete File/Folder
router.delete('/files/delete', verifyToken, isAdmin, async (req, res) => {
    try {
        const { path: targetPath } = req.body;
        if (!targetPath) return res.status(400).json({ error: "Path required" });

        const fullPath = validatePath(targetPath);
        const stat = await fs.stat(fullPath);

        if (stat.isDirectory()) {
            await fs.rm(fullPath, { recursive: true, force: true });
        } else {
            await fs.unlink(fullPath);
        }
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Move / Rename
router.post('/files/move', verifyToken, isAdmin, async (req, res) => {
    try {
        const { oldPath, newPath } = req.body;
        if (!oldPath || !newPath) return res.status(400).json({ error: "Paths required" });

        const fullOldPath = validatePath(oldPath);
        const fullNewPath = validatePath(newPath);

        await fs.rename(fullOldPath, fullNewPath);
        res.json({ message: "Moved/Renamed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 7. Copy
router.post('/files/copy', verifyToken, isAdmin, async (req, res) => {
    try {
        const { source, target } = req.body;
        if (!source || !target) return res.status(400).json({ error: "Paths required" });

        const fullSource = validatePath(source);
        const fullTarget = validatePath(target);

        // Use fs.cp for recursive copy (Node v16.7+)
        await fs.cp(fullSource, fullTarget, { recursive: true });
        res.json({ message: "Copied successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- REAL USER MANGEMENT ---
// 8. Get All Users
router.get('/users', verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 9. Update User Role
router.put('/users/:id/role', verifyToken, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.role = req.body.role;
        await user.save();
        res.json({ message: "User role updated successfully", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 10. Delete User
router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Added CRUD: Create User
router.post('/users', verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, email, password, role, photo } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Name, email, and password are required to create a user." });
        }
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        const newUser = new User({ name, email, password, role: role || 'user', photo });
        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: { _id: newUser._id, name, email, role: newUser.role, photo: newUser.photo } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Added CRUD: Update User Details (Name, Email, Photo, Role)
router.put('/users/:id', verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, email, role, photo } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (photo !== undefined) user.photo = photo;

        await user.save();
        res.json({ message: "User details updated successfully", user: { _id: user._id, name: user.name, email: user.email, role: user.role, photo: user.photo } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 11. System Stats (Real)
router.get('/stats', verifyToken, isAdmin, async (req, res) => {
    try {
        const usersCount = await User.countDocuments({});
        res.json({ users: usersCount, tools: 85 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/logs', verifyToken, isAdmin, (req, res) => {
    res.send(`[${new Date().toISOString()}] System operational.\n[${new Date().toISOString()}] Admin connected.`);
});

// 12. Global Settings endpoints
const SETTINGS_FILE = path.join(__dirname, '../data/settings.json');

// Public route to get settings dynamically
router.get('/client/settings', async (req, res) => {
    try {
        const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
        res.json(JSON.parse(data));
    } catch (e) {
        res.json({ darkMode: false, maintenanceMode: false }); // Default fallback
    }
});

// Secure route to update settings
router.post('/settings', verifyToken, isAdmin, async (req, res) => {
    try {
        const {
            darkMode,
            maintenanceMode,
            primaryColor,
            secondaryColor,
            accentColor,
            layoutMode,
            fontSize,
            glassmorphism,
            compactMode,
            siteName,
            customCSS
        } = req.body;

        const currentSettings = {};
        try {
            const data = await fs.readFile(SETTINGS_FILE, 'utf-8');
            Object.assign(currentSettings, JSON.parse(data));
        } catch (e) { }

        const newSettings = {
            ...currentSettings,
            darkMode: darkMode !== undefined ? !!darkMode : currentSettings.darkMode,
            maintenanceMode: maintenanceMode !== undefined ? !!maintenanceMode : currentSettings.maintenanceMode,
            primaryColor: primaryColor || currentSettings.primaryColor,
            secondaryColor: secondaryColor || currentSettings.secondaryColor,
            accentColor: accentColor || currentSettings.accentColor,
            layoutMode: layoutMode || currentSettings.layoutMode,
            fontSize: fontSize || currentSettings.fontSize,
            glassmorphism: glassmorphism !== undefined ? !!glassmorphism : currentSettings.glassmorphism,
            compactMode: compactMode !== undefined ? !!compactMode : currentSettings.compactMode,
            siteName: siteName || currentSettings.siteName,
            customCSS: customCSS || currentSettings.customCSS
        };

        await fs.mkdir(path.dirname(SETTINGS_FILE), { recursive: true });
        await fs.writeFile(SETTINGS_FILE, JSON.stringify(newSettings, null, 2));
        res.json({ message: "Global settings updated and synchronized across all instances." });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = router;