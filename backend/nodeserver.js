/* c:\Users\hp\OneDrive\Desktop\Project new create\my-project\backend\server.js */
const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'src/config/env.js') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Static File Serving Configuration ---

// 1. Serve Frontend HTML files (Root)
// This serves files from frontend/public at the root URL (e.g., localhost:5000/)
app.use(express.static(path.join(__dirname, '../frontend/public')));

// 2. Serve CSS files
// Maps /css requests to backend/css
app.use('/css', express.static(path.join(__dirname, 'css')));

// 3. Serve JS files
// Maps /js requests to backend/js
app.use('/js', express.static(path.join(__dirname, 'js')));

// 4. Serve Components (Navbar, etc.)
// Maps /components requests to frontend/components
app.use('/components', express.static(path.join(__dirname, '../frontend/components')));

// 5. Serve Uploads
// Maps /uploads requests to frontend/public/uploads (matching admin.js upload path)
app.use('/uploads', express.static(path.join(__dirname, '../frontend/public/uploads')));

// 6. Serve Public Directory explicitly (for ../public/css/ paths)
// Maps /public requests to frontend/public
app.use('/public', express.static(path.join(__dirname, '../frontend/public')));

// --- API Routes ---
// Uncomment these as you implement the route files
// app.use('/api/auth', require('./src/routes/authRoutes'));
// app.use('/api/catalog', require('./src/routes/catalogRoutes'));
// app.use('/api/connector', require('./src/routes/connectorRoutes'));
// app.use('/api/ui', require('./src/routes/uiRoutes'));
app.use('/api/admin', require('./routes/admin'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Static paths configured:`);
    console.log(`- Root: frontend/public`);
    console.log(`- /css: backend/css`);
    console.log(`- /js: backend/js`);
    console.log(`- /components: frontend/components`);
});