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
            { name: "Concrete Calculator", link: "/calculators/construction/calc_concrete.html" },
            { name: "Flooring Calculator", link: "/calculators/construction/calc_flooring.html" },
            { name: "Fuel Cost Calculator", link: "/calculators/construction/calc_fuel.html" },
            { name: "Ohm's Law (Construction)", link: "/calculators/construction/calc_ohm.html" },
            { name: "Paint Calculator", link: "/calculators/construction/calc_paint.html" },
            { name: "Wall Stud Calculator", link: "/calculators/construction/calc_wall_stud.html" }
        ]
    },
    {
        category: "Cryptography", icon: "fas fa-vault", items: [
            { name: "MD5 Generator", link: "/calculators/cryptography/tool_md5_generator.html" }
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
            { name: "Capacitor Code", link: "/calculators/electronics/calc_capacitor_code.html" },
            { name: "LED Resistor", link: "/calculators/electronics/calc_led_resistor_calculator.html" },
            { name: "Ohm's Law", link: "/calculators/electronics/calc_ohm.html" },
            { name: "Resistor Color Code", link: "/calculators/electronics/calc_resistor_color_code.html" }
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
            { name: "Calorie Tracker Pro", link: "/calculators/health-fitness/calc_calorie-calculator.html" },
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
            { name: "Word Counter", link: "/calculators/text-web/tool_word_counter.html" }
        ]
    },
    {
        category: "Fun", icon: "fas fa-face-grin-tears", items: [
            { name: "Coin Flipper", link: "/calculators/fun/calc_coin_flipper.html" },
            { name: "Compatibility Test", link: "/calculators/fun/calc_compatibility.html" },
            { name: "Dice Roller", link: "/calculators/fun/calc_dice_roller.html" },
            { name: "FLAMES Game", link: "/calculators/fun/calc_flames.html" },
            { name: "Fortune Cookie", link: "/calculators/fun/calc_fortune_cookie.html" },
            { name: "Love Calculator", link: "/calculators/fun/calc_love.html" },
            { name: "Magic 8 Ball", link: "/calculators/fun/calc_magic_8_ball.html" },
            { name: "Number Guesser", link: "/calculators/fun/calc_number_guesser.html" },
            { name: "Random Number", link: "/calculators/fun/calc_random_number.html" },
            { name: "Rock Paper Scissors", link: "/calculators/fun/calc_rock_paper_scissors.html" },
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
                                <div style="font-size: 0.65rem; opacity: 0.5; margin-top: 2px;">ID: ${user.id || 'N/A'}</div>
                                ${user.role === 'admin' ? '<span class="admin-badge" style="background:var(--primary-color);color:white;font-size:0.65rem;padding:2px 6px;border-radius:10px;margin-top:5px;display:inline-block;">ADMIN</span>' : ''}
                            </div>
                            <div class="profile-dropdown-body">
                                <a href="/settings.html" class="dropdown-item">
                                    <i class="fas fa-cog"></i> Account Settings
                                </a>
                                <a href="/history.html" class="dropdown-item">
                                    <i class="fas fa-history"></i> My Calculations
                                </a>
                                ${user.role === 'admin' ? `<a href="/admin.html" class="dropdown-item"><i class="fas fa-shield-alt"></i> Admin Panel</a>` : ''}
                                <div class="dropdown-divider" style="height:1px; background:var(--border-color); margin:8px 0;"></div>
                                <a href="javascript:void(0)" class="dropdown-item logout-item" onclick="confirmLogout()" style="color:#ef4444;">
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

        // 3. Theme Colors
        if (settings.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
        }
        if (settings.accentColor) {
            document.documentElement.style.setProperty('--accent-purple', settings.accentColor);
        }

        // 4. Layout & UI Scaling
        if (settings.layoutMode) {
            document.body.classList.remove('sidebar-left', 'sidebar-right', 'sidebar-top', 'sidebar-bottom');
            if (settings.layoutMode !== 'left') {
                document.body.classList.add(`sidebar-${settings.layoutMode}`);
            }
        }
        if (settings.fontSize) {
            document.documentElement.style.fontSize = `${settings.fontSize}px`;
        }

        // 5. FX: Glassmorphism
        if (settings.glassmorphism) {
            document.documentElement.style.setProperty('--bg-card', 'rgba(30, 41, 59, 0.4)');
            document.body.style.backdropFilter = "blur(10px)";
        }

        // 6. Direct CSS Injection
        if (settings.customCSS) {
            let styleTag = document.getElementById('global-custom-css');
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = 'global-custom-css';
                document.head.appendChild(styleTag);
            }
            styleTag.innerHTML = settings.customCSS;
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
            `<div style="text-align: center; padding: 100px 20px; opacity: 0.5;">
                <i class="fa-solid fa-clock-rotate-left" style="font-size: 4rem; margin-bottom: 20px;"></i>
                <h3>No logs found for this period</h3>
                <p>Try modifying your history date filter, or perform some queries first.</p>
            </div>` :
            `<div class="cat-card" style="padding: 0;">
                ${displayHistory.map(item => `
                    <div style="padding: 20px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-weight: 600; font-size: 1.1rem; color: var(--text-header);"><i class="fa-solid fa-calculator" style="margin-right: 8px; color: var(--primary-color);"></i>${item.tool || item.name}</div>
                            <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 5px;">${item.details || 'General Processing Command Issued'}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 0.85rem; font-weight: bold;">${safeDate(item)}</div>
                            <div style="font-size: 0.75rem; opacity: 0.5;">${safeTime(item)}</div>
                        </div>
                    </div>
                `).join('')}
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
