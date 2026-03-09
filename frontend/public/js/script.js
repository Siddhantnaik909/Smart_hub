/* =============================================================
   SMART HUB - MASTER UNIFIED SCRIPT (v2.7.5)
   Full Integration: Auth, History, Admin, & UI Scaling
============================================================= */

/* --- 1. CONFIGURATION & STATE --- */
import { initButtons } from './buttons.js';

const APP_VERSION = '2.7.5';
const REMOTE_API_URL = 'https://smart-hub-f5gw.onrender.com';
const LOCAL_API_URL = 'http://localhost:3000';
const SETTINGS_CACHE_KEY = 'smartHub.settings.cache';
const HISTORY_CACHE_KEY = 'smartHub.history.cache';

// Determine API Environment
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:')
    ? LOCAL_API_URL
    : REMOTE_API_URL;

window.API_URL = API_URL; // Global availability

// Global State
let cmEditor = null;
let currentPagePath = null;

/* --- GLOBAL CALCULATORS DATA --- */
window.CALCULATORS_DATA = [
    {
        category: "Construction", icon: "fas fa-hard-hat", items: [
            { name: "Brick Estimator", link: "/calculators/construction/calc_brick.html" },
            { name: "Concrete Calculator", link: "/calculators/construction/calc_concrete.html" },
            { name: "Flooring Calculator", link: "/calculators/construction/calc_flooring.html" },
            { name: "Fuel Cost Calculator", link: "/calculators/construction/calc_fuel.html" },
            { name: "Lumber Board Feet", link: "/calculators/construction/calc_lumber.html" },
            { name: "Ohm's Law (Construction)", link: "/calculators/construction/calc_ohm.html" },
            { name: "Paint Calculator", link: "/calculators/construction/calc_paint.html" },
            { name: "Roof Area Calculator", link: "/calculators/construction/calc_roof_area.html" },
            { name: "Wall Stud Calculator", link: "/calculators/construction/calc_wall_stud.html" }
        ]
    },
    {
        category: "Cryptography", icon: "fas fa-vault", items: [
            { name: "MD5 Generator", link: "/calculators/cryptography/tool_md5_generator.html" },
            { name: "SHA-256 Generator", link: "/calculators/cryptography/tool_sha256_generator.html" },
            { name: "Base64 Encoder/Decoder", link: "/calculators/cryptography/tool_base64.html" }
        ]
    },
    {
        category: "Date & Time", icon: "fas fa-calendar-alt", items: [
            { name: "Age Calculator", link: "/calculators/date-time/calc_age.html" },
            { name: "Countdown Timer", link: "/calculators/date-time/calc_countdown.html" },
            { name: "Date Difference", link: "/calculators/date-time/calc_date_diff.html" },
            { name: "Hours Worked", link: "/calculators/date-time/calc_hours_worked.html" },
            { name: "Leap Year Checker", link: "/calculators/date-time/calc_leap_year.html" },
            { name: "Time Addition", link: "/calculators/date-time/calc_time_add.html" },
            { name: "Time Zone Converter", link: "/calculators/date-time/calc_time_zone.html" },
            { name: "Working Days", link: "/calculators/date-time/calc_working_days.html" }
        ]
    },
    {
        category: "Electronics", icon: "fas fa-microchip", items: [
            { name: "555 Timer", link: "/calculators/electronics/calc_555_timer.html" },
            { name: "Battery Life", link: "/calculators/electronics/calc_battery_life.html" },
            { name: "Capacitor Code", link: "/calculators/electronics/calc_capacitor_code.html" },
            { name: "Frequency & Wavelength", link: "/calculators/electronics/calc_frequency.html" },
            { name: "LED Resistor", link: "/calculators/electronics/calc_led_resistor_calculator.html" },
            { name: "Ohm's Law", link: "/calculators/electronics/calc_ohm.html" },
            { name: "Power Calculator", link: "/calculators/electronics/calc_power.html" },
            { name: "Resistor Color Code", link: "/calculators/electronics/calc_resistor_color_code.html" },
            { name: "Voltage Divider", link: "/calculators/electronics/calc_voltage_divider.html" }
        ]
    },
    {
        category: "Finance", icon: "fas fa-landmark", items: [
            { name: "Car Loan", link: "/calculators/finance/calc_car_loan.html" },
            { name: "Compound Interest (Simple)", link: "/calculators/finance/calc_compound.html" },
            { name: "Compound Interest (Advanced)", link: "/calculators/finance/calc_compound_interest.html" },
            { name: "Currency Converter", link: "/calculators/finance/calc_currency.html" },
            { name: "Discount Calculator", link: "/calculators/finance/calc_discount.html" },
            { name: "General Loan", link: "/calculators/finance/calc_loan.html" },
            { name: "Loan EMI", link: "/calculators/finance/calc_loan_emi.html" },
            { name: "Mortgage Calculator", link: "/calculators/finance/calc_mortgage.html" },
            { name: "ROI Calculator", link: "/calculators/finance/calc_roi.html" },
            { name: "Salary Calculator", link: "/calculators/finance/calc_salary.html" },
            { name: "Savings Goal", link: "/calculators/finance/calc_savings_goal.html" },
            { name: "Tax / GST", link: "/calculators/finance/calc_tax_gst.html" },
            { name: "Tip Calculator", link: "/calculators/finance/calc_tip_calculator.html" }
        ]
    },
    {
        category: "General Math", icon: "fas fa-calculator", items: [
            { name: "Average Calculator", link: "/calculators/general-math/calc_average.html" },
            { name: "Fractions Calculator", link: "/calculators/general-math/calc_fractions.html" },
            { name: "Math Toolkit", link: "/calculators/general-math/calc_math_toolkit.html" },
            { name: "Percentage Calculator", link: "/calculators/general-math/calc_percentage.html" },
            { name: "Programmer Calculator", link: "/calculators/general-math/calc_programmer.html" },
            { name: "Scientific Calculator", link: "/calculators/general-math/calc_scientific.html" },
            { name: "Standard Calculator", link: "/calculators/general-math/calc_standard.html" },
            { name: "Password Generator", link: "/calculators/general-math/tool_password.html" }
        ]
    },
    {
        category: "Health & Fitness", icon: "fas fa-heart-pulse", items: [
            { name: "BMI Calculator", link: "/calculators/health-fitness/calc_bmi.html" },
            { name: "BMR Calculator", link: "/calculators/health-fitness/calc_bmr.html" },
            { name: "Body Fat Percentage", link: "/calculators/health-fitness/calc_body_fat.html" },
            { name: "Calorie Calculator", link: "/calculators/health-fitness/calc_calorie.html" },
            { name: "Ovulation Calculator", link: "/calculators/health-fitness/calc_ovulation.html" },
            { name: "Pregnancy Due Date", link: "/calculators/health-fitness/calc_pregnancy.html" },
            { name: "Water Intake", link: "/calculators/health-fitness/calc_water.html" }
        ]
    },
    {
        category: "Network", icon: "fas fa-network-wired", items: [
            { name: "DNS Lookup", link: "/calculators/network/tool_dns_lookup.html" },
            { name: "IP Geolocation", link: "/calculators/network/tool_ip_geo.html" },
            { name: "Ping Test", link: "/calculators/network/tool_ping.html" },
            { name: "Port Scanner", link: "/calculators/network/tool_port_scanner.html" },
            { name: "Subnet Calculator", link: "/calculators/network/calc_subnet.html" },
            { name: "Traceroute Tool", link: "/calculators/network/tool_traceroute.html" },
            { name: "Whois Lookup", link: "/calculators/network/tool_whois.html" }
        ]
    },
    {
        category: "Students", icon: "fas fa-user-graduate", items: [
            { name: "Geometry Calculator", link: "/calculators/students/calc_geometry.html" },
            { name: "GPA Calculator", link: "/calculators/students/calc_gpa.html" },
            { name: "Weighted Grade", link: "/calculators/students/calc_grade_weighted.html" },
            { name: "Mensuration", link: "/calculators/students/calc_mensuration.html" },
            { name: "Pomodoro Timer", link: "/calculators/students/calc_pomodoro.html" },
            { name: "Quadratic Equation", link: "/calculators/students/calc_quadratic.html" },
            { name: "Statistics", link: "/calculators/students/calc_statistics.html" },
            { name: "Unit Conv", link: "/calculators/students/calc_unit_conv.html" }
        ]
    },
    {
        category: "Text & Web", icon: "fas fa-file-code", items: [
            { name: "Case Converter", link: "/calculators/text-web/tool_case_converter.html" },
            { name: "Lorem Ipsum Generator", link: "/calculators/text-web/tool_lorem_ipsum.html" },
            { name: "Password Strength", link: "/calculators/text-web/tool_password.html" },
            { name: "Word Counter", link: "/calculators/text-web/tool_word_counter.html" },
            { name: "URL Encoder/Decoder", link: "/calculators/text-web/tool_url_encoder.html" }
        ]
    },
    {
        category: "Games", icon: "fas fa-gamepad", items: [
            { name: "Car Racing", link: "/calculators/fun/game_car_racing.html" },
            { name: "Connect 4", link: "/calculators/fun/game_connect4.html" },
            { name: "Multiplayer Chess", link: "/calculators/fun/game_chess.html" },
            { name: "Tic Tac Toe", link: "/calculators/fun/game_tic_tac_toe.html" }
        ]
    },
    {
        category: "Fun Tools", icon: "fas fa-face-grin-tears", items: [
            { name: "Coin Flipper", link: "/calculators/fun/calc_coin_flipper.html" },
            { name: "Compatibility Test", link: "/calculators/fun/calc_compatibility.html" },
            { name: "Dice Roller", link: "/calculators/fun/calc_dice_roller.html" },
            { name: "FLAMES Game", link: "/calculators/fun/calc_flames.html" },
            { name: "Fortune Cookie", link: "/calculators/fun/calc_fortune_cookie.html" },
            { name: "Love Calculator", link: "/calculators/fun/calc_love.html" },
            { name: "Magic 8 Ball", link: "/calculators/fun/calc_magic_8_ball.html" },
            { name: "Number Guesser", link: "/calculators/fun/calc_number_guesser.html" },
            { name: "Rock Paper Scissors", link: "/calculators/fun/calc_rock_paper_scissors.html" },
            { name: "Random Number", link: "/calculators/fun/calc_random_number.html" },
            { name: "Zodiac Sign", link: "/calculators/fun/calc_zodiac.html" }
        ]
    }
];

/* --- 2. CORE INITIALIZATION --- */
document.addEventListener('DOMContentLoaded', () => {
    console.log(`[Smart Hub] Core Initialized. API: ${API_URL}`);

    initTheme();
    initButtons();
    setupSidebarToggle();
    updateUserInterface();

    // Admin-Specific Initialization
    if (document.querySelector('.admin-wrapper') || window.location.pathname.includes('admin')) {
        initializeAdminPanel();
    } else {
        fetchAdminSettings();
    }

    // Dashboard Specifics
    if (document.getElementById('usageChart')) {
        renderDashboardCharts();
    }

    if (document.getElementById('recent-activity-list') || document.getElementById('history-list')) {
        loadRecentActivity();
    }

    // Fallback bindings if components load asynchronously
    document.addEventListener('componentsLoaded', () => {
        if (document.getElementById('recent-activity-list')) loadRecentActivity();
        if (document.getElementById('favorites-grid')) loadFavorites();
    });

    // Auto-load Pinned tools onto Dashboard
    if (document.getElementById('favorites-grid')) {
        loadFavorites();
    }

    if (document.getElementById('date-display')) {
        const dateEl = document.getElementById('date-display');
        dateEl.innerText = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        dateEl.classList.remove('skeleton');
    }

    if (document.getElementById('favorites-grid')) {
        loadFavorites();
    }

    // Register Service Worker for offline support
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').then(reg => {
                console.log('[Service Worker] Registered', reg.scope);
            }).catch(err => {
                console.warn('[Service Worker] Registration failed', err);
            });
        });
    }
});

// Re-initialize UI elements after components (Sidebar/Navbar) are loaded
document.addEventListener('componentsLoaded', () => {
    setupSidebarToggle();
    updateUserInterface();
    initButtons();

    if (document.getElementById('recent-activity-list') || document.getElementById('history-list')) {
        loadRecentActivity();
    }

    if (document.getElementById('favorites-grid')) {
        loadFavorites();
    }
});

/* --- 3. UI & THEME ENGINE --- */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    applyLayoutMode();

    // Initialize toggle state if it exists
    const themeToggle = document.getElementById('settings-theme-toggle') || document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.checked = savedTheme === 'dark';
    }

    const compactToggle = document.getElementById('compact-toggle');
    const isCompact = localStorage.getItem('compact') === 'true';
    if (isCompact) document.body.classList.add('compact-mode');
    if (compactToggle) {
        compactToggle.checked = isCompact;
    }
}

// Subscribe to real-time Cross-Tab Settings sync natively
window.addEventListener('storage', (e) => {
    const displayKeys = ['theme', 'compact', 'sidebarCollapsed', 'layoutMode', 'themeColor', 'customFontSize', 'glassmorphism'];
    if (displayKeys.includes(e.key)) {
        initTheme(); // re-evaluates and paints globally
    }
});

window.toggleDarkMode = function (checkbox) {
    const isDark = checkbox.checked;
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.querySelectorAll('#theme-checkbox, #settings-theme-toggle').forEach(t => {
        if (t !== checkbox) t.checked = isDark;
    });
};

window.toggleCompactMode = function (checkbox) {
    const isCompact = checkbox.checked;
    document.body.classList.toggle('compact-mode', isCompact);
    localStorage.setItem('compact', isCompact ? 'true' : 'false');
};

window.toggleDropdown = function (id, element) {
    const content = document.getElementById(id);
    if (!content) return;
    const icon = element.querySelector('.dropdown-icon');
    const isOpen = content.style.display === "block";
    content.style.display = isOpen ? "none" : "block";
    if (icon) icon.classList.toggle('rotate', !isOpen);
};

window.setLayoutMode = function (mode) {
    document.body.classList.remove('sidebar-left', 'sidebar-right', 'sidebar-top', 'sidebar-bottom');
    if (mode !== 'left') document.body.classList.add(`sidebar-${mode}`);
    localStorage.setItem('layoutMode', mode);
};

window.setThemeColor = function (hexStr) {
    document.documentElement.style.setProperty('--primary-color', hexStr);
    document.documentElement.style.setProperty('--primary-gradient', `linear-gradient(135deg, ${hexStr} 0%, ${hexStr}dd 100%)`);
    localStorage.setItem('themeColor', hexStr);
};

window.exportData = function () {
    const history = localStorage.getItem('calc_history') || '[]';
    const blob = new Blob([history], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "smarthub_history.json";
    a.click();
    URL.revokeObjectURL(url);
};

window.clearLocalData = function () {
    if (confirm("Are you sure you want to permanently delete all local calculation history and settings?")) {
        localStorage.removeItem('calc_history');
        localStorage.removeItem('favorites');
        alert("Local data cleared.");
        location.reload();
    }
};

function applyLayoutMode() {
    const mode = localStorage.getItem('layoutMode') || 'left';
    const body = document.body;
    body.classList.remove('sidebar-left', 'sidebar-right', 'sidebar-top', 'sidebar-bottom');
    if (mode !== 'left') body.classList.add(`sidebar-${mode}`);

    // Apply custom colors if exist
    const savedColor = localStorage.getItem('themeColor');
    if (savedColor) {
        window.setThemeColor(savedColor);
    }

    const fontSize = localStorage.getItem('customFontSize');
    if (fontSize) {
        document.documentElement.style.fontSize = `${fontSize}px`;
    }

    const isGlass = localStorage.getItem('glassmorphism') === 'true';
    if (isGlass) {
        document.documentElement.style.setProperty('--bg-card', 'rgba(30, 41, 59, 0.4)');
        document.documentElement.style.setProperty('--bg-sidebar', 'rgba(15, 23, 42, 0.6)');
        body.style.backdropFilter = "blur(10px)";
        body.classList.add('sidebar-glass');
    } else {
        document.documentElement.style.removeProperty('--bg-card');
        document.documentElement.style.removeProperty('--bg-sidebar');
        body.style.backdropFilter = "none";
        body.classList.remove('sidebar-glass');
    }
}

function showGlobalToast(message, type = 'info') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style = 'position:fixed; bottom:20px; right:20px; z-index:9999;';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    const colors = { success: '#10b981', error: '#ef4444', info: '#6366f1' };
    toast.style = `background:${colors[type]}; color:white; padding:12px 24px; border-radius:8px; margin-top:10px; animation: slideIn 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.1);`;
    toast.innerHTML = `<i class="fas fa-info-circle" style="margin-right:8px;"></i> ${message}`;

    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

/* --- 4. AUTH & PROFILE MANAGEMENT --- */
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag])
    );
}

function updateUserInterface() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const authContainer = document.getElementById('auth-actions');

    if (authContainer) {
        if (isLoggedIn) {
            const initials = user.name ? user.name.substring(0, 1).toUpperCase() : '?';
            const avatarHtml = user.photo
                ? `<img src="${user.photo}" alt="User" onerror="this.onerror=null;this.replaceWith(document.createRange().createContextualFragment('<div class=\'avatar-placeholder\'>${initials}</div>'))">`
                : `<div class="avatar-placeholder">${initials}</div>`;

            authContainer.innerHTML = `
                <div class="header-group">
                    <div class="notification-wrapper" style="position: relative;">
                        <button class="btn-icon" style="margin-right: 5px; position: relative; border:none;" title="Notifications" onclick="document.getElementById('notif-dropdown').classList.toggle('active'); event.stopPropagation();">
                            <i class="far fa-bell"></i>
                            <span style="position: absolute; top: 8px; right: 8px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; border: 1px solid var(--bg-card);"></span>
                        </button>
                        <div class="profile-dropdown" id="notif-dropdown" style="right: -10px; width: 300px;">
                            <div class="profile-dropdown-header">
                                <span style="font-weight: 700; color: var(--text-header);">Notifications</span>
                            </div>
                            <div class="profile-dropdown-body">
                                <div class="dropdown-item" style="cursor: default; justify-content: center; opacity: 0.6; padding: 20px; flex-direction: column;">
                                    <i class="far fa-bell-slash" style="font-size: 1.5rem; margin-bottom: 8px;"></i>
                                    <span>No new notifications</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="profile-menu-container">
                        <div class="profile-trigger" onclick="window.toggleProfileDropdown(event)">
                            <div class="avatar-wrapper">
                                ${avatarHtml}
                            </div>
                            <span>${escapeHTML(user.name) || 'User Account'}</span>
                            <i class="fas fa-chevron-down" style="font-size: 0.7rem; opacity: 0.5;"></i>
                        </div>
                        
                        <div class="profile-dropdown" id="userProfileDropdown">
                            <div class="profile-dropdown-header">
                                <div class="profile-name">${escapeHTML(user.name) || 'Smart User'}</div>
                                <div class="profile-email">${escapeHTML(user.email) || 'user@smarthub.com'}</div>
                                <div style="font-family: monospace; font-size: 0.7rem; opacity: 0.6; margin-top: 4px; background: rgba(0,0,0,0.1); padding: 2px 6px; border-radius: 4px; display: inline-block; word-break: break-all;">ID: ${user.id || 'N/A'}</div>
                                ${user.role === 'admin' ? '<div style="margin-top:8px"><span class="admin-badge" style="background:var(--primary-color);color:white;font-size:0.65rem;padding:3px 8px;border-radius:12px;display:inline-block;letter-spacing:1px"><i class="fas fa-crown" style="margin-right:4px"></i>ADMIN</span></div>' : ''}
                            </div>
                            <div class="profile-dropdown-body">
                                <a href="/settings.html" class="dropdown-item">
                                    <i class="fas fa-cog"></i> Account Settings
                                </a>
                                <a href="/history.html" class="dropdown-item">
                                    <i class="fas fa-history"></i> My Calculations
                                </a>
                                ${user.role === 'admin' ? `<a href="/admin.html" class="dropdown-item"><i class="fas fa-shield-alt"></i> Admin Panel</a>` : ''}
                                <div class="dropdown-divider" style="height:1px; background:var(--border-color); margin:8px 0; opacity:0.5;"></div>
                                <a href="javascript:void(0)" class="dropdown-item logout-item" onclick="confirmLogout()">
                                    <i class="fas fa-sign-out-alt"></i> Sign Out
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            authContainer.innerHTML = `
                <div class="auth-btn-group">
                    <a href="login.html" class="btn-secondary">Login</a>
                    <a href="signup.html" class="btn-primary">Sign Up</a>
                </div>
            `;
        }
    }

    // Update Sidebar Profile
    const sidebarProfile = document.querySelector('.user-profile');
    if (sidebarProfile) {
        if (isLoggedIn) {
            const initials = user.name ? user.name.substring(0, 2).toUpperCase() : 'U';
            sidebarProfile.innerHTML = `
                <div class="user-avatar" style="background: var(--primary-color); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: bold;">${initials}</div>
                <div class="user-info">
                    <h4>${escapeHTML(user.name) || 'User'}</h4>
                    <p>${user.role === 'admin' ? 'Admin' : 'Member'}</p>
                </div>
            `;
        } else {
            sidebarProfile.innerHTML = `
                <div class="user-avatar" style="background: #555; display: flex; align-items: center; justify-content: center; color: #fff;"><i class="fas fa-user"></i></div>
                <div class="user-info">
                    <h4>Guest</h4>
                    <p>Not logged in</p>
                </div>
            `;
        }
    }

    // Still hit admin-specific area if it exists separately
    const adminArea = document.getElementById('admin-refresh-area');
    if (isLoggedIn && adminArea) {
        adminArea.innerHTML = `
            <div style="display:flex; align-items:center; gap:10px;">
                <span style="font-size:0.9rem; color:var(--text-header);">${escapeHTML(user.name) || 'Admin'}</span>
                <button class="btn-danger" style="padding:5px 10px; font-size:0.8rem;" onclick="confirmLogout()">Logout</button>
            </div>
        `;
    }

    // Initialize Admin Live Editor if user is admin
    if (isLoggedIn && user.role === 'admin') {
        initAdminLiveEditor();
    }
}

window.confirmLogout = function () {
    if (confirm("Sign out of Command Center?")) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
};

/* --- 5. ADMIN COMMAND CENTER LOGIC --- */
async function initializeAdminPanel() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') {
        console.warn("Unauthorized access attempt to Admin Panel.");
        window.location.href = 'login.html';
        return;
    }

    fetchAdminStats();
    if (typeof window.fetchAssetFiles === 'function') {
        window.fetchAssetFiles();
    }
    initAdminPreview();
}

async function fetchAdminStats() {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/admin/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const stats = await res.json();

        if (document.getElementById('stat-users')) document.getElementById('stat-users').innerText = stats.users || 0;
        if (document.getElementById('stat-tools')) document.getElementById('stat-tools').innerText = stats.tools || 0;
    } catch (err) {
        console.error("Failed to fetch admin stats.");
    }
}

/* --- 6. FILE MANAGER & CODE EDITOR --- */
// Note: File management logic (fetchAssetFiles, editFile, etc.) 
// has been migrated natively into admin.html to support full directory CRUD operations.


/* --- 7. SERVER LOGS --- */
async function fetchServerLogs() {
    const output = document.getElementById('server-logs-output');
    if (!output) return;

    output.innerHTML = "Connecting to log stream...";

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/admin/logs`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        output.innerText = data.logs || "No logs generated by server in this session.";
        output.scrollTop = output.scrollHeight;
    } catch (e) {
        output.innerHTML = `<span style="color:#ef4444;">Connection to log server failed.</span>`;
    }
}

/* --- 8. DASHBOARD CHARTS --- */
function renderDashboardCharts() {
    const ctx = document.getElementById('usageChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Calculations',
                data: [45, 59, 80, 81, 56, 95],
                backgroundColor: '#6366f1',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

/* --- 9. SIDEBAR TOGGLE --- */
window.toggleSidebar = function () {
    const dashboard = document.getElementById('dashboard-wrapper');
    if (dashboard) dashboard.classList.toggle('sidebar-active');
};

window.toggleProfileDropdown = function (event) {
    if (event) event.stopPropagation();
    const dropdown = document.getElementById('userProfileDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');

        // Close when clicking outside
        const closeDropdown = (e) => {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
                document.removeEventListener('click', closeDropdown);
            }
        };
        if (dropdown.classList.contains('active')) {
            document.addEventListener('click', closeDropdown);
        }
    }
};

function initGlobalSearch() {
    const searchInput = document.querySelector('.search-bar input');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();

        // If on calculators page, trigger existing search
        if (window.location.pathname.includes('calculators.html') && typeof window.searchTools === 'function') {
            const toolSearch = document.getElementById('toolSearch');
            if (toolSearch) {
                toolSearch.value = e.target.value;
                window.searchTools();
            }
        }
    });

    // Handle Enter key for search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const term = e.target.value;
            if (term && !window.location.pathname.includes('calculators.html')) {
                window.location.href = `/calculators.html?search=${encodeURIComponent(term)}`;
            }
        }
    });

    // Keyboard shortcut (⌘K or Ctrl+K)
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

window.toggleSidebarCollapse = function () {
    document.body.classList.toggle('sidebar-collapsed');
};

function setupSidebarToggle() {
    // Ensure overlay clears the active menu state when clicked in mobile context
    const overlay = document.getElementById('mobile-overlay');
    const dashboard = document.getElementById('dashboard-wrapper');

    if (overlay && dashboard) {
        overlay.addEventListener('click', () => {
            dashboard.classList.remove('sidebar-active');
        });
    }
}

async function fetchAdminSettings() {
    try {
        const res = await fetch(`${API_URL}/api/admin/client/settings`);
        const settings = await res.json();
        localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));

        // Applying Global Settings

        // 1. Dark Mode
        if (settings.darkMode !== undefined) {
            const isDark = !!settings.darkMode;
            document.body.classList.toggle('dark-mode', isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }

        // 2. Branding (Site Name)
        if (settings.siteName) {
            const logoText = document.getElementById('site-logo-text');
            const navLogoText = document.getElementById('nav-site-logo-text');
            if (logoText) logoText.innerText = settings.siteName;
            if (navLogoText) navLogoText.innerText = settings.siteName.toUpperCase();
            document.title = `${settings.siteName} | SMART HUB`;
        }

        // 2.1 Site Logo
        if (settings.siteLogo) {
            const logoSelectors = ['.brand-block', '.navbar-branding', '.auth-logo'];
            logoSelectors.forEach(sel => {
                const el = document.querySelector(sel);
                if (el) {
                    // Hide existing icon if present
                    const icon = el.querySelector('i');
                    if (icon) icon.style.display = 'none';
                    
                    // Check or create img
                    let img = el.querySelector('.custom-site-logo');
                    if (!img) {
                        img = document.createElement('img');
                        img.classList.add('custom-site-logo');
                        img.style.maxHeight = '32px';
                        img.style.marginRight = '10px';
                        el.prepend(img);
                    }
                    img.src = settings.siteLogo;
                }
            });
        }

        // 3. Theme Colors
        if (settings.primaryColor) {
            localStorage.setItem('themeColor', settings.primaryColor);
            document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
            // Derive gradient
            document.documentElement.style.setProperty('--primary-gradient', `linear-gradient(135deg, ${settings.primaryColor} 0%, ${settings.primaryColor}dd 100%)`);
        }
        if (settings.accentColor) {
            localStorage.setItem('accentColor', settings.accentColor);
            document.documentElement.style.setProperty('--accent-purple', settings.accentColor);
        }

        // 3.5 Button Style & Fonts & Animations
        if (settings.buttonStyle) {
            localStorage.setItem('buttonStyle', settings.buttonStyle);
            let radius = '12px';
            if (settings.buttonStyle === 'round') radius = '24px';
            else if (settings.buttonStyle === 'sharp') radius = '0px';
            else if (settings.buttonStyle === 'leaf') radius = '12px 0 12px 0';
            document.documentElement.style.setProperty('--btn-radius', radius);
        }
        if (settings.fontFamily) {
            localStorage.setItem('fontFamily', settings.fontFamily);
            document.documentElement.style.setProperty('--font-main', settings.fontFamily);
        }
        if (settings.cardAnimation) {
            localStorage.setItem('cardAnimation', settings.cardAnimation);
            document.body.classList.remove('anim-fade-up', 'anim-zoom-in', 'anim-slide-up', 'anim-bounce');
            if (settings.cardAnimation !== 'none') {
                document.body.classList.add(`anim-${settings.cardAnimation}`);
            }
        }

        // 3.6 Shadow Intensity
        if (settings.shadowIntensity) {
            localStorage.setItem('shadowIntensity', settings.shadowIntensity);
            const intensity = settings.shadowIntensity / 100;
            const y = 1 + (intensity * 15);
            const blur = 3 + (intensity * 27);
            const opacity = 0.02 + (intensity * 0.13);
            const hover_y = 2 + (intensity * 23);
            const hover_blur = 6 + (intensity * 34);
            const hover_opacity = 0.04 + (intensity * 0.16);
            document.documentElement.style.setProperty('--shadow-card', `0 ${y}px ${blur}px rgba(0,0,0, ${opacity})`);
            document.documentElement.style.setProperty('--shadow-hover', `0 ${hover_y}px ${hover_blur}px rgba(0,0,0, ${hover_opacity})`);
        }

        // 3.7 Sidebar Theme
        if (settings.sidebarBgStart && settings.sidebarBgEnd) {
            localStorage.setItem('sidebarBgStart', settings.sidebarBgStart);
            localStorage.setItem('sidebarBgEnd', settings.sidebarBgEnd);
            document.documentElement.style.setProperty('--sidebar-bg', `linear-gradient(180deg, ${settings.sidebarBgStart}, ${settings.sidebarBgEnd})`);
        }
        if (settings.sidebarTextColor) {
            localStorage.setItem('sidebarTextColor', settings.sidebarTextColor);
            document.documentElement.style.setProperty('--sidebar-text', settings.sidebarTextColor);
        }
        if (settings.sidebarActiveColor) {
            localStorage.setItem('sidebarActiveColor', settings.sidebarActiveColor);
            document.documentElement.style.setProperty('--sidebar-active', settings.sidebarActiveColor);
        }
        if (settings.sidebarWidth) {
            localStorage.setItem('sidebarWidth', settings.sidebarWidth);
            document.documentElement.style.setProperty('--sidebar-width', `${settings.sidebarWidth}px`);
        }
        if (settings.sidebarFontSize) {
            localStorage.setItem('sidebarFontSize', settings.sidebarFontSize);
            document.documentElement.style.setProperty('--sidebar-font-size', `${settings.sidebarFontSize}px`);
        }

        // 4. Layout & UI Scaling
        if (settings.layoutMode) {
            localStorage.setItem('layoutMode', settings.layoutMode);
            document.body.classList.remove('sidebar-left', 'sidebar-right', 'sidebar-top', 'sidebar-bottom');
            if (settings.layoutMode !== 'left') {
                document.body.classList.add(`sidebar-${settings.layoutMode}`);
            }
        }
        if (settings.fontSize) {
            localStorage.setItem('customFontSize', settings.fontSize);
            document.documentElement.style.fontSize = `${settings.fontSize}px`;
        }

        // 5. FX: Glassmorphism
        if (settings.glassmorphism !== undefined) {
            const isGlass = !!settings.glassmorphism;
            localStorage.setItem('glassmorphism', isGlass ? 'true' : 'false');
            if (isGlass) {
                document.documentElement.style.setProperty('--bg-card', 'rgba(30, 41, 59, 0.4)');
                document.documentElement.style.setProperty('--bg-sidebar', 'rgba(15, 23, 42, 0.6)');
                document.body.style.backdropFilter = "blur(10px)";
                document.body.classList.add('sidebar-glass');
            } else {
                document.documentElement.style.removeProperty('--bg-card');
                document.documentElement.style.removeProperty('--bg-sidebar');
                document.body.style.backdropFilter = "none";
                document.body.classList.remove('sidebar-glass');
            }
        }

        // 6. Direct CSS Injection
        const cssInput = document.getElementById('setting-custom-css');
        const cssToggle = document.getElementById('setting-enable-css');

        if (cssInput) cssInput.value = settings.customCSS || '';
        if (cssToggle) cssToggle.checked = !!settings.enableCustomCSS;

        let styleTag = document.getElementById('global-custom-css');
        
        if (settings.customCSS && settings.enableCustomCSS) {
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = 'global-custom-css';
                document.head.appendChild(styleTag);
            }
            styleTag.innerHTML = settings.customCSS;
        } else if (styleTag) {
            styleTag.remove();
        }

        // 6.5 Direct JS Injection
        const existingJs = document.getElementById('global-custom-js');
        if (existingJs) existingJs.remove();

        if (settings.customJS && settings.enableCustomJS) {
            const script = document.createElement('script');
            script.id = 'global-custom-js';
            script.textContent = settings.customJS;
            document.body.appendChild(script);
        }

        // 7. Maintenance Mode Check
        if (settings.maintenanceMode) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.role !== 'admin' && !window.location.pathname.includes('login.html')) {
                document.body.innerHTML = `
                    <div style="height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; background:#0f172a; color:white; font-family:sans-serif; text-align:center;">
                        <i class="fa-solid fa-screwdriver-wrench" style="font-size:3rem; margin-bottom:20px; color:#6366f1;"></i>
                        <h1>System Maintenance</h1>
                        <p style="opacity:0.8; margin-top:10px;">We are currently performing scheduled maintenance.<br>Please check back later.</p>
                        <button onclick="window.location.reload()" style="margin-top:25px; padding:10px 25px; cursor:pointer; background:#6366f1; border:none; color:white; border-radius:5px;">Refresh</button>
                    </div>`;
                return;
            }
        }

        // 8. Tool Visibility & Ordering
        if (settings.disabledTools || settings.categoryOrder) {
            applyToolSettings(settings.disabledTools, settings.categoryOrder);
        }
    } catch (e) {
        console.warn("Running in offline settings mode.");
    }
}

function loadRecentActivity() {
    const list = document.getElementById('recent-activity-list');
    const fullList = document.getElementById('history-list');
    const totalCalcsEl = document.getElementById('total-calcs');
    const lastActiveEl = document.getElementById('last-active');

    let history = JSON.parse(localStorage.getItem('calc_history') || '[]');

    function safeDate(item) {
        if (item.timestamp) return new Date(item.timestamp).toLocaleDateString();
        const d = new Date(item.date);
        return isNaN(d) ? item.date.split(',')[0] || 'Unknown Date' : d.toLocaleDateString();
    }

    function safeTime(item) {
        if (item.timestamp) return new Date(item.timestamp).toLocaleTimeString();
        const d = new Date(item.date);
        return isNaN(d) ? (item.date.split(',')[1] || '').trim() : d.toLocaleTimeString();
    }

    // Apply Filter Dropdown logic (Full History page only)
    const filterDropdown = document.getElementById('history-filter');
    let displayHistory = history;

    if (filterDropdown && fullList) {
        const filterVal = filterDropdown.value;
        if (filterVal !== 'all') {
            const now = Date.now();
            displayHistory = history.filter(item => {
                const itemTime = item.timestamp || new Date(item.date).getTime();
                if (!itemTime || isNaN(itemTime)) return true; // Keep old undefined logs
                const diffDays = (now - itemTime) / (1000 * 60 * 60 * 24);
                if (filterVal === 'today') return diffDays <= 1;
                if (filterVal === 'week') return diffDays <= 7;
                if (filterVal === 'month') return diffDays <= 30;
                return true;
            });
        }
    }

    // Update Stats (Dashboard only)
    if (totalCalcsEl) {
        totalCalcsEl.innerText = history.length;
        totalCalcsEl.classList.remove('skeleton');
    }
    if (lastActiveEl) {
        lastActiveEl.classList.remove('skeleton');
        if (history.length > 0) {
            const itemTime = history[0].timestamp || new Date(history[0].date).getTime();
            if (!itemTime || isNaN(itemTime)) {
                lastActiveEl.innerText = 'Never';
            } else {
                const now = new Date();
                const diff = Math.floor((now - itemTime) / 1000 / 60); // minutes
                if (diff < 60) lastActiveEl.innerText = `${diff}m ago`;
                else if (diff < 1440) lastActiveEl.innerText = `${Math.floor(diff / 60)}h ago`;
                else lastActiveEl.innerText = `${Math.floor(diff / 1440)}d ago`;
            }
        } else {
            lastActiveEl.innerText = 'Never';
        }
    }

    // Render Dashboard Mini-List
    if (list) {
        list.innerHTML = history.length === 0 ?
            `<div style="padding: 30px; text-align: center; opacity: 0.6;"><p>No recent calculations.</p></div>` :
            history.slice(0, 5).map(item => `
            <div style="padding: 15px 25px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                <div><div style="font-weight: 600; color: var(--text-header);">${item.tool || item.name}</div><div style="font-size: 0.85rem; opacity: 0.7;">${item.details || 'Calculation Processed'}</div></div>
                <div style="font-size: 0.8rem; opacity: 0.5;">${safeDate(item)}</div>
            </div>`).join('');
    }

    // Render Full History Page List (using displayHistory instead of history)
    if (fullList) {
        fullList.innerHTML = displayHistory.length === 0 ?
            `<div class="history-empty-state">
                <i class="fa-solid fa-clock-rotate-left" style="font-size: 4rem; margin-bottom: 20px;"></i>
                <h3>No logs found for this period</h3>
                <p>Try modifying your history date filter, or perform some queries first.</p>
            </div>` :
            `<div class="history-items-container">
                ${displayHistory.map((item, index) => {
                // Generate detailed list of inputs and results
                const inputsHtml = item.inputs && item.inputs.length > 0
                    ? item.inputs.map(i => `<li><span class="label">${escapeHTML(i.label || 'Input')}:</span> <span class="value">${escapeHTML(String(i.val))}</span></li>`).join('')
                    : '<li>No input details recorded.</li>';

                const resultsHtml = item.results && item.results.length > 0
                    ? item.results.map(r => `<li ${r.highlight ? 'class="highlight"' : ''}><span class="label">${escapeHTML(r.label || 'Result')}:</span> <span class="value">${escapeHTML(String(r.val))}</span></li>`).join('')
                    : '<li>No results recorded.</li>';

                return `
                <div class="history-item">
                    <div class="history-item-header" onclick="this.parentElement.classList.toggle('expanded')">
                        <div class="history-item-title">
                            <i class="fa-solid fa-calculator" style="color: var(--primary-color);"></i>
                            <span>${escapeHTML(item.name || 'Calculation')}</span>
                        </div>
                        <div class="history-item-summary">
                            <div class="history-item-date">
                                <span>${safeDate(item)}</span>
                                <span class="time">${safeTime(item)}</span>
                            </div>
                            <i class="fas fa-chevron-down expand-icon"></i>
                        </div>
                    </div>
                    <div class="history-item-body">
                        <div class="detail-section">
                            <h5>Inputs</h5>
                            <ul>${inputsHtml}</ul>
                        </div>
                        <div class="detail-section">
                            <h5>Result</h5>
                            <ul>${resultsHtml}</ul>
                        </div>
                    </div>
                </div>
            `}).join('')}
            </div>`;

        // Attach clear listener if button is present
        const clearBtn = document.getElementById('clear-history-btn');
        if (clearBtn) {
            clearBtn.onclick = () => {
                if (confirm("Are you sure you want to permanently clear your log file history?")) {
                    localStorage.removeItem('calc_history');
                    loadRecentActivity();
                }
            };
        }
    }
}

/* --- 10. FAVORITES FEATURE --- */
window.getFavorites = function () {
    return JSON.parse(localStorage.getItem('favorites') || '[]');
};

window.isFavorite = function (link) {
    const favs = window.getFavorites();
    return favs.includes(link);
};

window.toggleFavorite = function (link) {
    let favs = window.getFavorites();
    if (favs.includes(link)) {
        favs = favs.filter(f => f !== link);
        showGlobalToast("Removed from Favorites", "info");
    } else {
        favs.push(link);
        showGlobalToast("Added to Favorites", "success");
    }
    localStorage.setItem('favorites', JSON.stringify(favs));

    // Refresh UI if on dashboard
    if (document.getElementById('favorites-grid')) loadFavorites();

    // Refresh UI if on calculators list
    if (typeof initCalculators === 'function') initCalculators();
};

function loadFavorites() {
    const grid = document.getElementById('favorites-grid');
    if (!grid) return;

    const favs = window.getFavorites();
    if (favs.length === 0) {
        grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:20px; color:var(--text-muted);">No favorites pinned yet. Star tools to see them here!</div>`;
        return;
    }

    // Find tool details
    const allTools = window.CALCULATORS_DATA.flatMap(cat => cat.items.map(item => ({ ...item, icon: cat.icon })));
    const favTools = allTools.filter(t => favs.includes(t.link));

    grid.innerHTML = favTools.map(tool => `
        <a href="${tool.link}" class="cat-card" style="display:flex; align-items:center; gap:15px; text-decoration:none; color:var(--text-main); padding:15px;">
            <i class="${tool.icon}" style="font-size:1.5rem; color:var(--primary-color);"></i>
            <span style="font-weight:600;">${tool.name}</span>
        </a>
    `).join('');
}

/* --- 11. ADMIN LIVE PREVIEW --- */
function initAdminPreview() {
    const btnSelect = document.getElementById('setting-btn-style');
    const fontSelect = document.getElementById('setting-font-family');
    const animSelect = document.getElementById('setting-card-anim');
    const colorInput = document.getElementById('setting-primary-color');
    
    if (!btnSelect) return; // Not on settings page

    const update = () => {
        const previewBtn = document.getElementById('preview-btn');
        const previewCard = document.getElementById('preview-card');
        
        if (previewBtn) {
            const style = btnSelect.value;
            let radius = '12px';
            if (style === 'round') radius = '24px';
            else if (style === 'sharp') radius = '0px';
            else if (style === 'leaf') radius = '12px 0 12px 0';
            previewBtn.style.borderRadius = radius;
            previewBtn.style.fontFamily = fontSelect.value;

            if (colorInput) {
                const col = colorInput.value;
                previewBtn.style.background = `linear-gradient(135deg, ${col} 0%, ${col}dd 100%)`;
                const colorDisplay = document.getElementById('color-code-display');
                if (colorDisplay) colorDisplay.innerText = col;
            }
        }

        if (previewCard) {
            previewCard.style.fontFamily = fontSelect.value;
            const anim = animSelect.value;
            
            // Reset animation to trigger reflow
            previewCard.style.animation = 'none';
            previewCard.offsetHeight; 
            
            if (anim !== 'none') {
                let keyframe = anim === 'fade-up' ? 'fadeInUp' : (anim === 'zoom-in' ? 'zoomIn' : (anim === 'bounce' ? 'bounceIn' : 'slideUp'));
                previewCard.style.animation = `${keyframe} 0.6s ease forwards`;
            }

            if (colorInput) {
                const icon = previewCard.querySelector('.cat-icon_wrapper');
                if (icon) {
                    icon.style.color = colorInput.value;
                    icon.style.background = `${colorInput.value}1a`;
                }
            }
        }
    };

    btnSelect.addEventListener('change', update);
    fontSelect.addEventListener('change', update);
    animSelect.addEventListener('change', update);
    if (colorInput) colorInput.addEventListener('input', update);
}

/* --- 11.5 CUSTOM CSS PREVIEW --- */
window.applyCustomCSSPreview = function() {
    const css = document.getElementById('setting-custom-css')?.value;
    if (css === undefined) return;
    
    let styleTag = document.getElementById('global-custom-css');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'global-custom-css';
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = css;
    showGlobalToast('Custom CSS applied to preview', 'info');
};

/* --- 12. SAVE SETTINGS --- */
window.saveGlobalSettings = async function() {
    const saveBtn = document.getElementById('save-settings-btn');
    if (saveBtn && window.setButtonLoading) window.setButtonLoading(saveBtn, true);

    const settings = {
        siteName: document.getElementById('setting-site-name')?.value,
        primaryColor: document.getElementById('setting-primary-color')?.value,
        accentColor: document.getElementById('setting-accent-color')?.value,
        darkMode: document.getElementById('setting-dark-mode')?.checked,
        glassmorphism: document.getElementById('setting-glass')?.checked,
        buttonStyle: document.getElementById('setting-btn-style')?.value,
        fontFamily: document.getElementById('setting-font-family')?.value,
        cardAnimation: document.getElementById('setting-card-anim')?.value,
        layoutMode: document.getElementById('setting-layout-mode')?.value,
        fontSize: document.getElementById('setting-font-size')?.value,
        customCSS: document.getElementById('setting-custom-css')?.value,
        enableCustomCSS: document.getElementById('setting-enable-css')?.checked,
        sidebarBgStart: document.getElementById('setting-sidebar-bg-start')?.value,
        sidebarBgEnd: document.getElementById('setting-sidebar-bg-end')?.value,
        sidebarTextColor: document.getElementById('setting-sidebar-text')?.value,
        sidebarActiveColor: document.getElementById('setting-sidebar-active')?.value,
        sidebarWidth: document.getElementById('setting-sidebar-width')?.value,
        sidebarFontSize: document.getElementById('setting-sidebar-font-size')?.value
    };

    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/admin/settings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(settings)
        });

        if (res.ok) {
            showGlobalToast('Settings saved successfully!', 'success');
            localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
            fetchAdminSettings(); 
        } else {
            const err = await res.json();
            showGlobalToast(err.error || 'Failed to save settings.', 'error');
        }
    } catch (e) {
        console.error(e);
        showGlobalToast('Connection error while saving.', 'error');
    } finally {
        if (saveBtn && window.setButtonLoading) window.setButtonLoading(saveBtn, false);
    }
};

/* --- 13. ADMIN LIVE VISUAL EDITOR --- */
function initAdminLiveEditor() {
    if (document.getElementById('admin-live-toolbar')) return;

    // Don't show on admin.html itself to prevent breaking the dashboard logic
    if (window.location.pathname.includes('admin.html')) return;

    const toolbar = document.createElement('div');
    toolbar.id = 'admin-live-toolbar';
    toolbar.innerHTML = `
        <div style="position:fixed; bottom:20px; right:80px; z-index:9999; display:flex; gap:10px; align-items:center;">
            <div id="edit-controls" style="display:none; gap:8px; background:var(--bg-card); padding:8px 12px; border-radius:50px; box-shadow:var(--shadow-hover); border:1px solid var(--primary-color); animation: fadeIn 0.3s; align-items:center;">
                
                <button id="mode-text" class="btn-icon" style="width:32px; height:32px; font-size:0.85rem; border-radius:50%; background:var(--primary-color); color:white; border:1px solid var(--primary-color);" title="Text Edit Mode">
                    <i class="fas fa-font"></i>
                </button>
                <button id="mode-move" class="btn-icon" style="width:32px; height:32px; font-size:0.85rem; border-radius:50%; border:1px solid transparent;" title="Move Elements (Drag & Drop)">
                    <i class="fas fa-arrows-alt"></i>
                </button>
                <button id="mode-anim" class="btn-icon" style="width:32px; height:32px; font-size:0.85rem; border-radius:50%; border:1px solid transparent;" title="Animation & Style Fixer">
                    <i class="fas fa-magic"></i>
                </button>
                
                <div style="width:1px; height:20px; background:var(--border-color); margin:0 4px;"></div>

                <button id="save-edit-btn" class="btn-icon" style="width:32px; height:32px; border-radius:50%; background:#10b981; color:white; border:none;" title="Save Changes">
                    <i class="fas fa-save"></i>
                </button>
                <button id="cancel-edit-btn" class="btn-icon" style="width:32px; height:32px; border-radius:50%; background:#ef4444; color:white; border:none;" title="Cancel">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <button id="toggle-edit-btn" class="btn-icon" style="width:48px; height:48px; border-radius:50%; background:var(--bg-card); color:var(--primary-color); border:2px solid var(--primary-color); box-shadow:var(--shadow-card); transition:all 0.3s;" title="Enable Visual Editor">
                <i class="fas fa-pen"></i>
            </button>
        </div>
    `;
    document.body.appendChild(toolbar);

    // State
    let currentMode = 'text';
    let draggedEl = null;
    let animPopup = null;

    const toggleBtn = document.getElementById('toggle-edit-btn');
    const controls = document.getElementById('edit-controls');
    const saveBtn = document.getElementById('save-edit-btn');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const modeBtns = {
        text: document.getElementById('mode-text'),
        move: document.getElementById('mode-move'),
        anim: document.getElementById('mode-anim')
    };
    
    // --- MODE SWITCHING ---
    const setMode = (mode) => {
        currentMode = mode;
        
        // UI Update
        Object.keys(modeBtns).forEach(k => {
            if (k === mode) {
                modeBtns[k].style.background = 'var(--primary-color)';
                modeBtns[k].style.color = 'white';
            } else {
                modeBtns[k].style.background = 'transparent';
                modeBtns[k].style.color = 'var(--text-header)';
            }
        });

        // Logic Switch
        if (mode === 'text') {
            document.designMode = 'on';
            disableMoveMode();
            disableAnimMode();
            showGlobalToast('Text Mode: Click to edit text.', 'info');
        } else if (mode === 'move') {
            document.designMode = 'off';
            enableMoveMode();
            disableAnimMode();
            showGlobalToast('Move Mode: Drag elements to reorder.', 'info');
        } else if (mode === 'anim') {
            document.designMode = 'off';
            disableMoveMode();
            enableAnimMode();
            showGlobalToast('Anim Mode: Click element to set animation.', 'info');
        }
    };

    // --- MOVE MODE LOGIC ---
    const enableMoveMode = () => {
        const style = document.createElement('style');
        style.id = 'editor-move-style';
        style.innerHTML = `
            body * { cursor: grab !important; }
            body *.dragging { opacity: 0.5; cursor: grabbing !important; }
            body *.drag-over { border-top: 3px solid var(--primary-color) !important; }
        `;
        document.head.appendChild(style);

        document.querySelectorAll('div, section, article, p, h1, h2, h3, ul, li, img').forEach(el => {
            if (!toolbar.contains(el)) {
                el.setAttribute('draggable', 'true');
                el.addEventListener('dragstart', handleDragStart);
                el.addEventListener('dragover', handleDragOver);
                el.addEventListener('dragleave', handleDragLeave);
                el.addEventListener('drop', handleDrop);
                el.addEventListener('dragend', handleDragEnd);
            }
        });
    };

    const disableMoveMode = () => {
        const style = document.getElementById('editor-move-style');
        if (style) style.remove();
        
        document.querySelectorAll('[draggable="true"]').forEach(el => {
            el.removeAttribute('draggable');
            el.removeEventListener('dragstart', handleDragStart);
            el.removeEventListener('dragover', handleDragOver);
            el.removeEventListener('dragleave', handleDragLeave);
            el.removeEventListener('drop', handleDrop);
            el.removeEventListener('dragend', handleDragEnd);
        });
    };

    function handleDragStart(e) {
        if (currentMode !== 'move') return;
        draggedEl = this;
        e.dataTransfer.effectAllowed = 'move';
        this.classList.add('dragging');
        e.stopPropagation();
    }
    function handleDragOver(e) {
        if (currentMode !== 'move') return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        this.classList.add('drag-over');
        e.stopPropagation();
    }
    function handleDragLeave(e) {
        this.classList.remove('drag-over');
    }
    function handleDrop(e) {
        if (currentMode !== 'move' || !draggedEl) return;
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('drag-over');
        
        if (draggedEl !== this && !draggedEl.contains(this)) {
            this.parentNode.insertBefore(draggedEl, this);
        }
    }
    function handleDragEnd(e) {
        this.classList.remove('dragging');
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        draggedEl = null;
    }

    // --- ANIM MODE LOGIC ---
    const enableAnimMode = () => {
        const style = document.createElement('style');
        style.id = 'editor-anim-style';
        style.innerHTML = `body * { cursor: alias !important; } .anim-highlight { outline: 2px dashed #f59e0b; }`;
        document.head.appendChild(style);
        
        document.addEventListener('click', handleAnimClick, true);
        document.addEventListener('mouseover', handleAnimHover, true);
        document.addEventListener('mouseout', handleAnimOut, true);
    };

    const disableAnimMode = () => {
        const style = document.getElementById('editor-anim-style');
        if (style) style.remove();
        document.removeEventListener('click', handleAnimClick, true);
        document.removeEventListener('mouseover', handleAnimHover, true);
        document.removeEventListener('mouseout', handleAnimOut, true);
        if (animPopup) animPopup.remove();
    };

    function handleAnimHover(e) {
        if (currentMode !== 'anim' || toolbar.contains(e.target)) return;
        e.target.classList.add('anim-highlight');
    }
    function handleAnimOut(e) {
        e.target.classList.remove('anim-highlight');
    }
    function handleAnimClick(e) {
        if (currentMode !== 'anim') return;
        if (toolbar.contains(e.target) || (animPopup && animPopup.contains(e.target))) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        openAnimPopup(e.target);
    }

    function openAnimPopup(el) {
        if (animPopup) animPopup.remove();
        
        animPopup = document.createElement('div');
        animPopup.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: var(--bg-card); padding: 20px; border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5); border: 1px solid var(--border-color);
            z-index: 10000; width: 300px; animation: fadeIn 0.2s;
        `;
        
        const classes = ['fade-in', 'delay-1', 'delay-2', 'delay-3', 'cat-card'];
        
        let checks = classes.map(cls => `
            <label style="display:flex; justify-content:space-between; padding:8px; border-bottom:1px solid var(--border-color); cursor:pointer;">
                <span>${cls}</span>
                <input type="checkbox" ${el.classList.contains(cls) ? 'checked' : ''} onchange="this.checked ? document.querySelector('.editing-anim-target').classList.add('${cls}') : document.querySelector('.editing-anim-target').classList.remove('${cls}')">
            </label>
        `).join('');

        animPopup.innerHTML = `
            <h4 style="margin:0 0 10px 0;">Edit Classes</h4>
            <div style="max-height:200px; overflow-y:auto;">${checks}</div>
            <div style="margin-top:10px; text-align:right;">
                <button onclick="this.parentElement.parentElement.remove()" class="btn-primary" style="padding:5px 10px; font-size:0.8rem;">Done</button>
            </div>
        `;
        
        document.querySelectorAll('.editing-anim-target').forEach(x => x.classList.remove('editing-anim-target'));
        el.classList.add('editing-anim-target');
        
        document.body.appendChild(animPopup);
    }

    // --- CONTROLS ---
    toggleBtn.onclick = () => {
        toggleBtn.style.display = 'none';
        controls.style.display = 'flex';
        setMode('text');
    };

    modeBtns.text.onclick = () => setMode('text');
    modeBtns.move.onclick = () => setMode('move');
    modeBtns.anim.onclick = () => setMode('anim');

    cancelBtn.onclick = () => {
        if(confirm("Discard unsaved changes and reload?")) location.reload();
    };

    saveBtn.onclick = async () => {
        if(!confirm("Save changes to the server? This will overwrite the static file.")) return;

        // Cleanup
        document.designMode = 'off';
        disableMoveMode();
        disableAnimMode();
        toolbar.remove(); // Remove toolbar before saving
        if (animPopup) animPopup.remove();
        document.querySelectorAll('.editing-anim-target').forEach(x => x.classList.remove('editing-anim-target'));
        
        const htmlContent = "<!DOCTYPE html>\n" + document.documentElement.outerHTML;
        
        // Restore UI
        document.body.appendChild(toolbar);
        toggleBtn.style.display = 'flex';
        controls.style.display = 'none';

        let path = window.location.pathname;
        if (path.endsWith('/') || path === '') path += 'index.html';
        if (!path.startsWith('/')) path = '/' + path;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/files/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ path, content: htmlContent })
            });
            showGlobalToast(res.ok ? 'Page saved successfully!' : 'Save failed.', res.ok ? 'success' : 'error');
        } catch (e) { showGlobalToast('Connection failed.', 'error'); }
    };
}

/* --- 14. TOOL VISIBILITY HELPER --- */
function applyToolSettings(disabledPaths, order) {
    if (!window.CALCULATORS_DATA) return;

    // 0. Merge Custom Categories (if loaded in settings)
    const settings = JSON.parse(localStorage.getItem(SETTINGS_CACHE_KEY) || '{}');
    if (settings.customCategories && Array.isArray(settings.customCategories)) {
        // Avoid duplicates if function runs multiple times
        const existingCats = window.CALCULATORS_DATA.map(c => c.category);
        settings.customCategories.forEach(cc => {
            if (!existingCats.includes(cc.category)) {
                window.CALCULATORS_DATA.push(cc);
            }
        });
    }

    // Filter items
    if (disabledPaths) {
        window.CALCULATORS_DATA.forEach(cat => {
            if (!cat._originalItems) cat._originalItems = [...cat.items];
            cat.items = cat._originalItems.filter(t => !disabledPaths.includes(t.link));
        });
    }

    // Sort categories
    if (order) {
        window.CALCULATORS_DATA.sort((a, b) => {
            const idxA = order.indexOf(a.category);
            const idxB = order.indexOf(b.category);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return 0;
        });
    }

    window.CALCULATORS = window.CALCULATORS_DATA;
    if (typeof window.buildCalculators === 'function') window.buildCalculators();
}
