# 🔴 NOT WORK / PENDING LIST

### 🔧 CRITICAL FIXES NEEDED
- [ ] **`AdminDashborad.html`**: Contains a typo in filename. It's static and doesn't connect to the backend. **Action:** Delete it and redirect to `admin.html`.
- [ ] **`backend/src/routes/adminRoutes.js`**: Redundant simple route. **Action:** Clean up and favor `backend/routes/admin.js`.
- [ ] **Network Tools Consistency**: `tool_whois.html`, `tool_ip_geo.html`, etc. use Blue theme. **Action:** Migrate to Purple Premium `#8b5cf6`.

### 📂 PENDING MODULES (No Theme/Logging)
- [ ] **Health & Fitness**: 7 files in `calculators/health-fitness/`.
- [ ] **Construction**: 9 files in `calculators/construction/`.
- [ ] **General Math**: 8 files in `calculators/general-math/`.
- [ ] **Text & Web**: 5 files in `calculators/text-web/`.
- [ ] **Cryptography**: 3 tools need modernization.

### 🏗️ OTHER PENDING
- [ ] **Admin Features API**: `/api/admin/client/features` is currently returning an empty array placeholder.
- [ ] **History Sidepane (UI)**: Some tools have the logic for history but need the UI sidebar actually rendered on the left/right.
