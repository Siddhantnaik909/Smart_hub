const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config(); // Correctly load .env file BEFORE config
const { config } = require('./src/config/env');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } }); // Allow frontend domain
const PORT = process.env.PORT || 3000; // Unified Port

// Initialize Sockets
require('./src/sockets/gameSockets')(io);

// Middleware
app.use(cors());
app.use(express.json());

// --- Static File Serving ---
const publicPath = path.join(__dirname, '../frontend/public');
const componentsPath = path.join(__dirname, '../frontend/components');

// Root access
app.use(express.static(publicPath));
// Support for components folder
app.use('/components', express.static(componentsPath));
// Profile uploads access
app.use('/uploads', express.static(path.join(publicPath, 'uploads')));

// Static assets (Adjusted to avoid overriding frontend /css and /js)
app.use('/backend/css', express.static(path.join(__dirname, 'css')));
app.use('/backend/js', express.static(path.join(__dirname, 'js')));

// Connect to MongoDB
mongoose.connect(config.mongoUri)
    .then(() => {
        console.log('MongoDB Connected');
        app.locals.dbReady = mongoose.connection;
        app.locals.db = mongoose.connection.db; // Required for admin routes
    })
    .catch(err => console.error('MongoDB Connection Error:', err));

// --- API Routes ---
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./routes/admin'); // Linked admin functionality

// Public API for sidebar features (Fixes the ERR_CONNECTION_REFUSED)
app.get('/api/admin/client/features', (req, res) => {
    res.json([]); // Return empty for now to satisfy the fetch
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Root Redirect
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

server.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
