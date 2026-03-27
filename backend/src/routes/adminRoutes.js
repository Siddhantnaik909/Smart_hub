const express = require('express');
const router = express.Router();
const UIState = require('../models/UIState');

// GET /api/admin/settings — Fetch global UI state settings
router.get('/settings', async (req, res) => {
    try {
        const state = await UIState.findOne({ key: 'global' });
        res.json(state || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching settings' });
    }
});

// POST /api/admin/settings — Update global UI state settings
router.post('/settings', async (req, res) => {
    try {
        await UIState.updateOne(
            { key: 'global' },
            { $set: req.body },
            { upsert: true, setDefaultsOnInsert: true }
        );
        res.json({ message: 'Settings updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating settings' });
    }
});

module.exports = router;