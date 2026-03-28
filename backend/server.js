const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const https = require('https');
const cors = require('cors');
const { Server } = require('socket.io');
require('dotenv').config(); // Correctly load .env file BEFORE config
const { config } = require('./src/config/env');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } }); // Allow frontend domain
const PORT = process.env.PORT || 3000; // Unified Port
app.locals.io = io; // Attach io to app.locals for use in routes

// Initialize Sockets
require('./src/sockets/gameSockets')(io);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


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
const adminRoutes = require('./routes/admin'); 
const catalogRoutes = require('./src/routes/catalogRoutes'); 
const historyRoutes = require('./src/routes/historyRoutes'); 
const uiRoutes = require('./src/routes/uiRoutes');
const connectorRoutes = require('./src/routes/connectorRoutes');
const gameRoutes = require('./src/routes/gameRoutes');
const contactRoutes = require('./src/routes/contactRoutes');

// Public API for sidebar features (Fixes the ERR_CONNECTION_REFUSED)
app.get('/api/admin/client/features', (req, res) => {
    res.json([]); // Return empty for now to satisfy the fetch
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/ui', uiRoutes);
app.use('/api/connectors', connectorRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/contact', contactRoutes);

// --- RDAP/Whois Proxy (Bypass CORS) ---
app.get('/api/proxy/rdap', (req, res) => {
    const { target, mode } = req.query;
    if (!target) return res.status(400).json({ error: 'Target is required' });

    const fetchRdap = (url, depth = 0) => {
        if (depth > 5) return res.status(500).json({ error: 'Too many redirects' });

        const options = {
            headers: { 'User-Agent': 'Mozilla/5.0 (SmartHub Lookup Tool)' }
        };

        https.get(url, options, (response) => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                return fetchRdap(response.headers.location, depth + 1);
            }

            if (response.statusCode !== 200) {
                return res.status(response.statusCode).json({ error: `RDAP Server returned ${response.statusCode} for ${url}` });
            }

            let data = '';
            response.on('data', (chunk) => data += chunk);
            response.on('end', () => {
                try {
                    res.json(JSON.parse(data));
                } catch (e) {
                    res.status(500).json({ error: 'Failed to parse RDAP response' });
                }
            });
        }).on('error', (err) => {
            res.status(500).json({ error: err.message });
        });
    };

    const initialUrl = mode === 'network' ? `https://rdap.org/ip/${target}` : `https://rdap.org/domain/${target}`;
    fetchRdap(initialUrl);
});


// Root Redirect
app.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

server.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
