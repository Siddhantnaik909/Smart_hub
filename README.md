# 🚀 SMART HUB — Unified Logic Suite

<div align="center">

![Smart Hub Banner](https://img.shields.io/badge/Smart%20Hub-Unified%20Logic%20Suite-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTEzIDloLTJWN2gydjJ6bTAgNGgtMnYtMmgydjJ6bTQtNGgtMlY3aDJ2MnptMCA0aC0ydi0yaDJ2MnpNOSA5SDdWN2gydjJ6bTAgNEg3di0yaDJ2MnptMTItNXY4YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yVjhhMiAyIDAgMCAxIDItMmgxNGEyIDIgMCAwIDEgMiAyeiIvPjwvc3ZnPg==)
![Version](https://img.shields.io/badge/version-3.2.0-blue?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%7C%20Local-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**A centralized hub consolidating 85+ specialized tools into one cohesive, high-performance interface.**

[Live Demo](#) · [Report Bug](https://github.com/Siddhantnaik909/Smart_hub/issues) · [Request Feature](https://github.com/Siddhantnaik909/Smart_hub/issues)

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Running Modes](#-running-modes)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

| Category | Highlights |
|----------|-----------|
| 🧮 **85+ Tools** | Construction, Finance, Health, Math, Electronics, Network, Cryptography, Student tools & more |
| 🎮 **Multiplayer Gaming** | Real-time Socket.io based game hub with matchmaking & room codes |
| 🎨 **Glassmorphism UI** | Modern dark theme with glass effects, smooth animations & micro-interactions |
| 📱 **Responsive Design** | Works on desktop, tablet & mobile with adaptive sidebar/navbar layouts |
| 🔐 **Auth System** | JWT-based authentication with role management (Admin/User) |
| 👤 **Profile Management** | Upload profile photos, update name, manage settings |
| 📊 **Admin Panel** | Full CRUD operations, user management, site settings & custom CSS injection |
| 📴 **Offline Support** | Components render without backend via embedded fallbacks + Service Worker (PWA) |
| 🎨 **Multi-Theme** | 6 accent colors, dark/light mode, compact UI, customizable layout positions |
| 📜 **History Tracking** | Local calculation history with date filtering & JSON export |

---

## 🛠️ Tech Stack

| Layer | Technology | Packages |
|-------|-----------|----------|
| **Frontend** | Vanilla JS (ES6+), HTML5, CSS3 | FontAwesome, Custom Glassmorphism System |
| **Backend** | Node.js, Express.js | `express`, `cors`, `helmet`, `morgan` |
| **Database** | MongoDB (Atlas or Local) | `mongoose` ODM |
| **Real-time** | WebSockets | `socket.io` |
| **Auth** | JWT + Bcrypt | `jsonwebtoken`, `bcryptjs` |
| **File Upload** | Multer | `multer` (profile photo uploads) |
| **Security** | Rate Limiting + Helmet | `express-rate-limit`, `helmet` |

---

## 📦 Prerequisites

Before you begin, make sure you have:

- **[Node.js](https://nodejs.org/)** v18 or higher installed
- **[MongoDB](https://www.mongodb.com/)** — either:
  - Local MongoDB Community Server, **OR**
  - A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **[Git](https://git-scm.com/)** for version control

> **Verify installation:**
> ```bash
> node --version   # Should show v18+
> npm --version    # Should show 9+
> git --version    # Should show git version
> ```

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Siddhantnaik909/Smart_hub.git
cd Smart_hub
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Go back to root
cd ..
```

### 3. Configure Environment Variables

```bash
# Copy the example config
cp backend/.env.example backend/.env
```

Now edit `backend/.env` with your settings:

```env
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/smart_hub

# For MongoDB Atlas (cloud):
# MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/smart_hub

# JWT Secret — CHANGE THIS to a strong random string!
JWT_SECRET=your_super_secret_key_here

# Server Port
PORT=3000
```

### 4. Start MongoDB (if using local)

```bash
# Windows
mongod

# macOS / Linux
sudo systemctl start mongod
# OR
mongod --dbpath /path/to/data
```

### 5. Run the Application

```bash
# From project root — starts the backend which also serves the frontend
npm start
```

### 6. Open in Browser

```
http://localhost:3000
```

🎉 **That's it! Smart Hub is running.**

---

## 📂 Project Structure

```
smart-hub/
├── 📄 .gitignore              # Git ignore rules
├── 📄 .env.example             # Environment template
├── 📄 package.json             # Root package (runs backend)
├── 📄 README.md                # This file
│
├── 📁 backend/                 # Express.js Server
│   ├── 📄 server.js            # Main entry point (serves everything)
│   ├── 📄 package.json         # Backend dependencies
│   ├── 📄 .env                 # Environment config (not in git)
│   ├── 📄 .env.example         # Environment template
│   ├── 📁 src/
│   │   ├── 📁 config/          # Environment & DB config
│   │   ├── 📁 middleware/      # Auth & validation middleware
│   │   ├── 📁 models/          # Mongoose schemas (User, etc.)
│   │   ├── 📁 routes/          # API routes (auth, admin)
│   │   ├── 📁 services/        # Business logic services
│   │   ├── 📁 sockets/         # Socket.io game logic
│   │   └── 📁 utils/           # Helper utilities
│   └── 📁 routes/              # Additional routes (admin CRUD)
│
├── 📁 frontend/                # Client-side Application
│   ├── 📁 components/          # Reusable HTML (sidebar, navbar, footer)
│   └── 📁 public/              # Static files served by Express
│       ├── 📄 index.html       # Dashboard (home page)
│       ├── 📄 login.html       # Login page
│       ├── 📄 signup.html      # Registration page
│       ├── 📄 settings.html    # User settings & multiplayer lobby
│       ├── 📄 about.html       # About page
│       ├── 📁 css/             # Stylesheets (style.css, custom.css)
│       ├── 📁 js/              # Frontend scripts
│       │   ├── 📄 script.js            # Main app logic
│       │   ├── 📄 component-loader.js  # Dynamic component loading
│       │   ├── 📄 multiplayerClient.js # Socket.io multiplayer SDK
│       │   └── 📄 buttons.js           # UI button handlers
│       ├── 📁 calculators/     # 85+ tool pages organized by category
│       │   ├── 📁 construction/
│       │   ├── 📁 finance/
│       │   ├── 📁 health-fitness/
│       │   ├── 📁 electronics/
│       │   ├── 📁 network/
│       │   ├── 📁 general-math/
│       │   ├── 📁 students/
│       │   ├── 📁 text-web/
│       │   ├── 📁 fun/
│       │   └── 📁 cryptography/
│       └── 📁 uploads/         # User-uploaded files (profile photos)
│           └── 📁 profiles/
```

---

## 🔄 Running Modes

Smart Hub supports **two modes** of operation:

### 🟢 Server Mode (Recommended)
```bash
npm start
# → Opens at http://localhost:3000
```
- Full functionality: auth, database, multiplayer, admin panel
- Components loaded from server via `fetch()`
- API endpoints fully functional

### 🟡 Static Mode (No Backend)
Simply **double-click any HTML file** in `frontend/public/` to open it in your browser.

- Components (sidebar, navbar, footer) render from **embedded fallbacks**
- All calculator tools work offline (client-side JS)
- No login, no database, no multiplayer (requires server)
- Great for quick access to tools without starting the backend

---

## 🔐 Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URI` | ✅ | `mongodb://localhost:27017/smart_hub` | MongoDB connection string |
| `JWT_SECRET` | ✅ | `dev-change-this-secret` | Secret key for JWT tokens |
| `PORT` | ❌ | `3000` | Server port number |

---

## 🚢 Deployment

### Deploy to Render (Free)

1. Push your code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && node server.js`
   - **Environment Variables:** Add `MONGO_URI` and `JWT_SECRET`

### Deploy to Railway / Heroku

```bash
# Set environment variables
railway variables set MONGO_URI=mongodb+srv://...
railway variables set JWT_SECRET=your_secret

# Deploy
railway up
```

---

## 🧪 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login & get JWT token | ❌ |
| `PUT` | `/api/auth/profile` | Update user profile | ✅ |
| `POST` | `/api/auth/upload-profile` | Upload profile photo | ✅ |
| `GET` | `/api/admin/stats` | Get admin statistics | ✅ Admin |
| `GET` | `/api/admin/users` | List all users | ✅ Admin |
| `PUT` | `/api/admin/users/:id` | Update user details | ✅ Admin |
| `DELETE` | `/api/admin/users/:id` | Delete user | ✅ Admin |

---

## 📱 Calculator Categories

<details>
<summary><b>🏗️ Construction (6 tools)</b></summary>

- Concrete Calculator
- Flooring Calculator
- Fuel Cost Calculator
- Ohm's Law (Construction)
- Paint Calculator
- Wall Stud Calculator
</details>

<details>
<summary><b>💰 Finance (13 tools)</b></summary>

- Car Loan · Compound Interest · Currency Converter · Discount Calculator
- General Loan · Loan EMI · Mortgage · ROI · Salary
- Savings Goal · Tax/GST · Tip Calculator
</details>

<details>
<summary><b>🏥 Health & Fitness (8 tools)</b></summary>

- BMI · BMR · Body Fat · Calorie Calculator · Calorie Tracker Pro
- Ovulation · Pregnancy Due Date · Water Intake
</details>

<details>
<summary><b>🔌 Electronics (5 tools)</b></summary>

- 555 Timer · Capacitor Code · LED Resistor · Ohm's Law · Resistor Color Code
</details>

<details>
<summary><b>🌐 Network (7 tools)</b></summary>

- DNS Lookup · IP Geolocation · Ping Test · Port Scanner
- Subnet Calculator · Traceroute · Whois Lookup
</details>

<details>
<summary><b>📐 General Math (8 tools)</b></summary>

- Average · Fractions · Math Toolkit · Percentage
- Programmer · Scientific · Standard · Password Generator
</details>

<details>
<summary><b>🎓 Students (8 tools)</b></summary>

- Geometry · GPA · Weighted Grade · Mensuration
- Pomodoro Timer · Quadratic Equation · Statistics · Unit Converter
</details>

<details>
<summary><b>📝 Text & Web (4 tools)</b></summary>

- Case Converter · Lorem Ipsum · Password Strength · Word Counter
</details>

<details>
<summary><b>🎮 Fun & Games (11 tools)</b></summary>

- Coin Flipper · Compatibility Test · Dice Roller · FLAMES
- Fortune Cookie · Love Calculator · Magic 8 Ball
- Number Guesser · Random Number · Rock Paper Scissors · Zodiac Sign
</details>

<details>
<summary><b>🔐 Cryptography (1 tool)</b></summary>

- MD5 Generator
</details>

---

## 🤝 Contributing

Contributions make the open-source community amazing! Here's how:

1. **Fork** the project
2. **Create** your feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m "Add amazing feature"`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 📬 Contact

**Siddhant Naik** — [@Siddhantnaik909](https://github.com/Siddhantnaik909)

Project Link: [https://github.com/Siddhantnaik909/Smart_hub](https://github.com/Siddhantnaik909/Smart_hub)

---

<div align="center">

Developed with ❤️ by **siddhantnaik909**

⭐ **Star this repo if you find it useful!** ⭐

</div>
