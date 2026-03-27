# Smart Hub - Complete Project Documentation & Architecture

## 1. Project Overview
Smart Hub is a centralized, full-stack digital workspace that brings together over 80+ daily calculators, multiplayer web games, and a social friend network into one seamless web application. 

## 2. Folder & File Architecture
The project follows a decoupled client-server architecture. The frontend is separated from the backend logic.

### The Frontend (`frontend/public/`)
*   **`html files`**: Over 80+ visual tools categorized into folders (finance, math, health, network, etc.).
*   **`css/style.css`**: Master stylesheet handling UI, dark mode, responsive mobile layouts, and glassmorphism styling.
*   **`js/script.js`**: Core UI script handling sessions, the dynamic sidebar, custom theming, and layout scaling.
*   **`js/calculators.js`**: Universal Tool Engine for input validation, result formatting, and history saving across all calculators.
*   **`js/component-loader.js`**: Dynamically loads the Sidebar and Navbar into pages using JavaScript `fetch()`, with offline fallbacks.
*   **`js/pwa.js`**: Progressive Web App logic allowing users to "Install" the website to their phone or desktop directly from the browser.

### The Backend (`backend/src/`)
*   **`routes/authRoutes.js`**: REST API endpoints for user registration, login, profile updates, and the Smart Network (friend management).
*   **`sockets/gameSockets.js`**: Handles WebSockets (Socket.IO) for real-time multiplayer games like Chess, Connect 4, and Racing.

## 3. Core Features & APIs

### User Authentication & Security
*   **Logic:** The backend uses Bcrypt to hash (encrypt) passwords before saving them to MongoDB. Upon a successful login, it creates a JSON Web Token (JWT) which the frontend stores in `localStorage`.
*   **Endpoints:** 
    *   `POST /api/auth/register` (Creates user)
    *   `POST /api/auth/login` (Authenticates user & issues JWT)
    *   `PUT /api/auth/profile` (Updates user details)

### Universal Calculator & History Engine
*   **Logic:** `validateInputs()` ensures data integrity (e.g., stopping text in number fields). Once calculation is done, `saveCalculation()` creates a JSON object with the inputs and results, saves it to `localStorage` for instant speed, and sends it to the backend for backup.
*   **Endpoint:** `POST /api/history/save`

### Smart Social Network (Friends)
*   **Logic:** Users connect via a unique 24-character "Hub ID" (their exact MongoDB Object ID), preserving privacy. When someone sends a message, it is instantly alerted to the other user using Socket.IO.
*   **Endpoints:**
    *   `POST /api/auth/friends/add` (Adds a friend via ID)
    *   `GET /api/auth/friends` (Retrieves friend list)
    *   `POST /api/auth/messages/chat` (Sends a message)

### Real-Time Multiplayer Games
*   **Logic:** Standard REST APIs require page refreshes. Smart Hub uses Socket.IO for real-time, bidirectional communication. When Player A makes a move, the frontend triggers `socket.emit('makeMove', data)`. The server instantly broadcasts this to Player B to update the game board.

### Admin Command Center & Live Editor
*   **Logic:** Users with the `"admin"` role unlock a special dashboard. Admins can push global settings (theme color, logo, layout) that update globally via `/api/admin/settings`.
*   **Visual Editor:** Clicking the "Pen" icon sets `document.designMode = 'on'`, allowing the admin to edit text directly on the website and save the modified HTML back to the static files on the server.

## 4. Tech Stack Highlights
*   **Frontend:** HTML5, CSS3, Tailwind CSS (for rapid UI grids), Vanilla JavaScript.
*   **Backend:** Node.js, Express.js (for REST APIs).
*   **Database:** MongoDB (NoSQL, ideal for dynamic JSON data structures), Mongoose ODM.
*   **Real-time:** Socket.IO.
*   **Security:** JSON Web Tokens (JWT), Bcrypt.js, Helmet, Express Rate Limit.

## 5. Offline Fallback Mechanics
The application is designed to be highly resilient. 
1.  The `component-loader.js` checks if the website is running locally (`file://`) or if the server is down. 
2.  If the backend goes offline, the frontend seamlessly falls back to hardcoded navigation bars and sidebar structures.
3.  Calculators continue to work using the browser's native JavaScript, and histories are saved in `localStorage` until the server reconnects.