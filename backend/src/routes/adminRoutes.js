const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting'); // Assuming you have a Setting model

router.get('/settings', async (req, res) => {
    try {
        const settings = await Setting.findOne({}); // Assuming only one settings document
        res.json(settings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching settings' });
    }
});

router.post('/settings', async (req, res) => {
    try {
        //const settings = await Setting.findOne({});
        //settings.set(req.body);
        //await settings.save();

        //Upsert is generally safer here, but depends if you initialize a document first
        await Setting.updateOne({}, req.body, { upsert: true, setDefaultsOnInsert: true, });
        res.json({ message: 'Settings updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating settings' });
    }
});


module.exports = router;