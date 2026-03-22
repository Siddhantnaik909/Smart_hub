# Smart Hub 🚀

> **A premium, all-in-one productivity platform** for students, professionals, and curious minds.

---

## 🎓 Academic Project Details
- **Student Name:** Siddhant Satish Naik
- **Course:** 3rd Year BCA (Final Semester)
- **Project Type:** Final Year Project
- **College:** The Little Flower College, Andheri
- **University:** Tilak Maharashtra Vidyapeeth, Pune

---

## 📖 Introduction (Meaning & Purpose)
**Smart Hub** is a centralized digital workspace that consolidates over 80+ essential calculators, fun multiplayer games, and a social networking module into a single, intuitive platform. 

### Why, What, Who, and Purpose?
- **What is it?** A full-stack web application serving as a multi-tool dashboard. It contains academic calculators, financial tools, health trackers, multiplayer games, and a social friend system.
- **Why was it built?** To eliminate the need for users to bounce between multiple websites for different daily calculations or casual gaming. It provides a "hub" for productivity and entertainment.
- **Who uses it?** Students (for GPA, math, and conversions), professionals (for finance and network tools), and general users looking for a secure, fast, and feature-rich digital toolkit.
- **What is the main purpose?** To demonstrate full-stack web development capabilities, including real-time bidirectional communication, secure user authentication, database management, and responsive frontend UI design, culminating in a production-ready application.

---

## 🧰 Technology Stack: Libraries & APIs Explained

### Frontend Technologies
* **HTML5, CSS3, Vanilla JS:** Core building blocks of the web pages.
* **Tailwind CSS (via CDN):** A utility-first CSS framework used for rapid and modern UI styling. Used to create the "glassmorphism" effects and responsive layouts.
* **Font Awesome & Material Symbols:** Libraries used for standardized, scalable vector icons.

### Backend & Database Technologies (Node.js)
* **Express.js (`express`):** Fast, unopinionated web framework for Node.js used to build the RESTful API and handle server routing.
* **MongoDB & Mongoose (`mongoose`):** MongoDB is the NoSQL database storing user profiles, calculation histories, and game stats. Mongoose is the Object Data Modeling (ODM) library that provides a straightforward, schema-based solution to model application data.
* **Socket.IO (`socket.io`):** A library that enables real-time, bidirectional, and event-based communication. Used heavily for the multiplayer games (Chess, Tic-Tac-Toe, Racing) to sync game states between players instantly.

### Security, Auth, & Utilities (Libraries)
* **JSON Web Tokens (`jsonwebtoken`):** Used for secure user authentication. It issues a token upon login which verifies the user's identity on subsequent private API calls.
* **Bcrypt.js (`bcryptjs`):** A library used to securely hash and salt user passwords before saving them to the database.
* **Multer (`multer`):** A middleware for handling `multipart/form-data`, primarily used for uploading user profile pictures.
* **Helmet & Rate Limit:** `helmet` helps secure Express apps by setting various HTTP headers. `express-rate-limit` is used to prevent DDoS and brute-force attacks by limiting repeated requests.
* **Cors & Dotenv:** `cors` allows cross-origin requests, and `dotenv` loads environment variables from a `.env` file into `process.env`.

### APIs Used
* **Internal REST API:** Built entirely from scratch. Includes endpoint groups such as:
  * `/api/auth/*`: Handles login, registration, fetching profiles, and friend management.
  * `/api/history/*`: Manages the saving and retrieval of calculator histories.
  * `/api/games/*` & `/api/admin/*`: Handles leaderboard stats and admin dashboard controls.
* **Web Audio & Canvas API (HTML5 Native):** Used in the frontend for rendering 2D/3D-style games (like the Racing Game) and playing sound effects natively without external plugins.

---

## ✨ Key Features
1. **80+ Interactive Calculators:** Covering Finance, Health, Students, Electronics, Construction, and more.
2. **Real-time Multiplayer Games:** Play Chess, Connect 4, and Racing with friends via Socket.io.
3. **Smart Network (Friend System):** Add friends using a unique Hub ID, view their profiles, and chat.
4. **Secure User Authentication:** JWT-based login, password hashing, and persistent sessions.
5. **Admin Dashboard:** Specific `/admin.html` portal with system stats, file manager, and user management.
6. **Dark Mode & Theming:** Custom UI customization synced via local storage.

---

## 📅 Recent Work & Today's Updates Done
- Full Platform UI/UX Overhaul using Tailwind CSS concepts.
- Rolled back and secured certain calculator scripts to ensure logic accuracy.
- Upgraded Admin Panel features, fixing non-working buttons and chat notifications.
- Enhanced real-time games with Socket.io memory leaderboards and native device orientation steering for racing.

---

*Project by Siddhant Satish Naik | BCA Final Year*
