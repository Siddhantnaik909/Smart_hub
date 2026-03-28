const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const MESSAGES_FILE = path.join(__dirname, '../../../data/messages.json');

async function readMessages() {
    try {
        const data = await fs.readFile(MESSAGES_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return { notifications: [], chats: [], contactMessages: [] };
    }
}

async function writeMessages(messages) {
    const dir = path.dirname(MESSAGES_FILE);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2));
}

// POST /api/contact - Public endpoint for contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const msgs = await readMessages();
        if (!msgs.contactMessages) msgs.contactMessages = [];

        const newContact = {
            id: Date.now().toString(),
            name,
            email,
            message,
            timestamp: new Date().toISOString(),
            read: false
        };

        msgs.contactMessages.push(newContact);
        await writeMessages(msgs);

        res.status(201).json({ message: 'Message submitted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
