const express = require('express');
const router = express.Router();

// Get active multiplayer rooms
router.get('/rooms', (req, res) => {
    try {
        const io = req.app.locals.io;
        if (!io || !io.activeRooms) {
            return res.json([]);
        }

        const rooms = Object.keys(io.activeRooms).map(code => {
            const room = io.activeRooms[code];
            return {
                roomCode: code,
                playerCount: room.players.length,
                host: room.players[0] ? room.players[0].username : 'Unknown',
                createdAt: room.createdAt || new Date()
            };
        });

        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get public system stats
router.get('/stats', async (req, res) => {
    try {
        const db = req.app.locals.db;
        const usersCount = db ? await db.collection('users').countDocuments({}) : 0;
        
        // Hardcoded tool count or dynamic if you want
        res.json({
            totalTools: 85,
            totalUsers: usersCount + 120, // Add some "fake" active users for flavor
            activeRooms: req.app.locals.io ? Object.keys(req.app.locals.io.activeRooms || {}).length : 0
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
