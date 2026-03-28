/* =============================================================
   SMART HUB - MASTER UNIFIED SCRIPT (v2.7.5)
   Full Integration: Auth, History, Admin, & UI Scaling
============================================================= */

/* --- 1. CONFIGURATION & STATE --- */
import { initButtons } from './buttons.js';

const APP_VERSION = '2.7.6';
// Auto-detect backend host
const LOCAL_API_URL = (window.location.port === '3001') ? 'http://localhost:3001' : 'http://localhost:3000';
const REMOTE_API_URL = 'https://smart-hub-f5gw.onrender.com';

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
            { name: "Ohm's Law", link: "/calculators/construction/calc_ohm.html" },
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
            { name: "GPA Calculator", link: "/calculators/students/calc_gpa.html" },
            { name: "Weighted Grade", link: "/calculators/students/calc_grade_weighted.html" },
            { name: "Area & Volume", link: "/calculators/students/calc_mensuration.html" },
            { name: "Pomodoro Timer", link: "/calculators/students/calc_pomodoro.html" },
            { name: "Math Equations", link: "/calculators/students/calc_quadratic.html" },
            { name: "Statistics", link: "/calculators/students/calc_statistics.html" },
            { name: "Unit Converter", link: "/calculators/students/calc_unit_conv.html" }
        ]
    },
    {
        category: "Text & Web", icon: "fas fa-file-code", items: [
            { name: "Text Case Change", link: "/calculators/text-web/tool_case_converter.html" },
            { name: "Dummy Text Maker", link: "/calculators/text-web/tool_lorem_ipsum.html" },
            { name: "Password Checker", link: "/calculators/text-web/tool_password.html" },
            { name: "Word Counter", link: "/calculators/text-web/tool_word_counter.html" },
            { name: "Link Encoder", link: "/calculators/text-web/tool_url_encoder.html" }
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

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav.fixed');
        if (nav) {
            if (window.scrollY > 20) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    });

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

// Auto-init for pages without component-loader (Standard HTML)
document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('sidebar-placeholder')) {
        updateUserInterface();
        initButtons();
    }
});

/* --- 3. UI & THEME ENGINE --- */
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const isDark = savedTheme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.body.classList.toggle('dark-mode', isDark);

    // Apply Brand Presets (Colors, Fonts, Scaling)
    const root = document.documentElement;
    const themeColor = localStorage.getItem('themeColor') || '#8b5cf6';
    const customFont = localStorage.getItem('fontFamily') || "'Plus Jakarta Sans', sans-serif";
    const customScale = localStorage.getItem('customFontSize') || '1';
    const glassEnabled = localStorage.getItem('glassmorphism') !== 'false';

    root.style.setProperty('--primary-color', themeColor);
    root.style.setProperty('--font-main', customFont);
    root.style.setProperty('--ui-scale', customScale);
    
    if (glassEnabled) {
        document.body.classList.add('glass-effect');
    } else {
        document.body.classList.remove('glass-effect');
    }

    applyLayoutMode();

    // Sync UI controls if they exist on the page
    const themeToggle = document.getElementById('settings-theme-toggle') || document.getElementById('theme-toggle');
    if (themeToggle) themeToggle.checked = isDark;

    const compactToggle = document.getElementById('compact-toggle');
    const isCompact = localStorage.getItem('compact') === 'true';
    if (isCompact) document.body.classList.add('compact-mode');
    if (compactToggle) compactToggle.checked = isCompact;
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
    document.documentElement.classList.toggle('dark', isDark);
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
    document.body.classList.remove('sidebar-left', 'sidebar-right', 'sidebar-top', 'sidebar-bottom', 'sidebar-floating');
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
    body.classList.remove('sidebar-left', 'sidebar-right', 'sidebar-top', 'sidebar-bottom', 'sidebar-floating');
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

window.showGlobalToast = function(message, type = 'info') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        // Modern container with bottom-right positioning
        toastContainer.className = 'fixed bottom-8 right-8 z-[99999] flex flex-col gap-3 pointer-events-none transform-gpu';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    const icons = { success: 'check_circle', error: 'error', info: 'info', warning: 'warning' };
    const colors = {
        success: 'rgba(16, 185, 129, 0.85)',
        error: 'rgba(239, 68, 68, 0.85)',
        info: 'rgba(139, 92, 246, 0.85)',
        warning: 'rgba(245, 158, 11, 0.85)'
    };

    toast.className = 'glass-toast flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl pointer-events-auto border border-white/20 backdrop-blur-xl translate-x-12 opacity-0 transition-all duration-500 ease-out text-white';
    toast.style.background = colors[type] || colors.info;
    
    toast.innerHTML = `
        <span class="material-symbols-outlined font-black text-2xl">${icons[type] || 'info'}</span>
        <div class="flex flex-col">
            <span class="text-[10px] font-black uppercase tracking-widest opacity-70">${type}</span>
            <span class="text-sm font-bold tracking-tight">${message}</span>
        </div>
        <button class="ml-4 opacity-50 hover:opacity-100 transition-opacity" onclick="this.parentElement.remove()">
            <span class="material-symbols-outlined text-sm">close</span>
        </button>
    `;

    toastContainer.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
        toast.style.opacity = '1';
    });

    setTimeout(() => {
        toast.style.transform = 'translateX(20px)';
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 5000);
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

// --- AUTH HELPERS ---
window.confirmLogout = function() {
    if (confirm("Are you sure you want to sign out?")) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
};

function updateUserInterface() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    let user = {};
    try {
        user = JSON.parse(localStorage.getItem('user') || '{}');
    } catch (e) {
        console.error("[Smart Hub] Failed to parse user data", e);
    }
    const authContainer = document.getElementById('auth-actions');

    if (authContainer) {
        if (isLoggedIn) {
            // Build avatar URL — backend stores as user.photo, not user.avatar
            const firstName = (user.name || user.username || 'User').split(' ')[0];
            
            // Build avatar URL — handle local vs remote vs absolute paths
            let avatarUrl = "";
            if (user.photo) {
                if (user.photo.startsWith('http')) {
                    avatarUrl = user.photo;
                } else {
                    const cleanPhoto = user.photo.startsWith('/') ? user.photo : '/' + user.photo;
                    avatarUrl = `${API_URL}${cleanPhoto}`;
                }
            } else {
                avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`;
            }

            authContainer.innerHTML = `
                <div class="flex items-center gap-6">
                    <!-- Notifications -->
                    <div class="relative">
                        <button onclick="document.getElementById('notif-dropdown').classList.toggle('hidden'); window.loadNotifications && window.loadNotifications(); event.stopPropagation();" class="p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all border border-slate-200 dark:border-white/5 relative group">
                            <span class="material-symbols-outlined text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">notifications</span>
                            <span id="notif-badge" class="hidden absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full"></span>
                        </button>
                        <div id="notif-dropdown" class="hidden absolute top-14 right-0 w-96 bg-white dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl py-4 z-[1000] max-h-96 flex flex-col">
                            <h4 class="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 px-6">Notifications</h4>
                            <div id="notif-list-container" class="flex-1 overflow-y-auto px-6 pb-2 space-y-4">
                                <div class="py-8 text-center">
                                    <span class="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-700 mb-2 block">notifications_off</span>
                                    <p class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">No new notifications</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Profile Dropdown -->
                    <div class="relative">
                        <button onclick="document.getElementById('user-profile-menu').classList.toggle('hidden'); event.stopPropagation();" class="flex items-center gap-3 bg-slate-100 dark:bg-white/5 p-2 pr-4 rounded-full border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all group">
                            <div class="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg group-hover:border-primary/50 transition-colors flex-shrink-0">
                                <img src="${avatarUrl}" class="w-full h-full object-cover" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(user.name||'User')}&background=random'">
                            </div>
                            <div class="text-left hidden lg:block">
                                <p class="text-xs font-black text-slate-900 dark:text-white tracking-wide">${escapeHTML(firstName)}</p>
                                <p class="text-[9px] font-bold text-slate-500 dark:text-slate-400">${user.role?.toLowerCase() === 'admin' ? 'Admin' : 'Member'}</p>
                            </div>
                            <span class="material-symbols-outlined text-sm text-slate-400 group-hover:rotate-180 transition-transform">expand_more</span>
                        </button>
                        
                        <div id="user-profile-menu" class="hidden absolute top-14 right-0 w-64 bg-white dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-2 z-[1000]">
                            <div class="p-5 border-b border-slate-100 dark:border-white/5 mb-2">
                                <p class="text-sm font-black text-slate-900 dark:text-white">${escapeHTML(user.name || firstName)}</p>
                                <p class="text-[10px] text-slate-500 truncate mt-0.5">${escapeHTML(user.email)}</p>
                            </div>
                            <div class="space-y-0.5">
                                <a href="/profile.html" class="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all group">
                                    <span class="material-symbols-outlined text-slate-400 group-hover:text-primary text-sm">person</span>
                                    <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">My Profile</span>
                                </a>
                                <a href="/settings.html" class="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all group">
                                    <span class="material-symbols-outlined text-slate-400 group-hover:text-primary text-sm">settings</span>
                                    <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">Settings</span>
                                </a>
                                <a href="/history.html" class="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all group">
                                    <span class="material-symbols-outlined text-slate-400 group-hover:text-primary text-sm">history</span>
                                    <span class="text-xs font-semibold text-slate-600 dark:text-slate-300">History</span>
                                </a>
                                ${user.role?.toLowerCase() === 'admin' ? `
                                <a href="/AdminDashboard.html" class="flex items-center gap-3 px-4 py-3 bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 rounded-xl transition-all group border border-primary/20">
                                    <span class="material-symbols-outlined text-primary text-sm">admin_panel_settings</span>
                                    <span class="text-xs font-bold text-primary">Admin Dashboard</span>
                                </a>` : ''}
                                <div class="h-px bg-slate-100 dark:bg-white/5 my-1"></div>
                                <button onclick="confirmLogout()" class="w-full flex items-center gap-3 px-4 py-3 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-xl transition-all group">
                                    <span class="material-symbols-outlined text-slate-400 group-hover:text-rose-500 text-sm">logout</span>
                                    <span class="text-xs font-semibold text-slate-600 dark:text-slate-300 group-hover:text-rose-500">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            authContainer.innerHTML = `
                <div class="flex gap-4">
                    <a href="/login.html" class="px-6 py-3 text-slate-500 hover:text-slate-900 dark:hover:text-white font-bold text-[10px] uppercase tracking-widest transition-colors">Login</a>
                    <a href="/signup.html" class="px-8 py-3 bg-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Get Started</a>
                </div>
            `;
        }

        // Global click handler to close dropdowns
        document.addEventListener('click', () => {
             const pro = document.getElementById('user-profile-menu');
             const notif = document.getElementById('notif-dropdown');
             if(pro) pro.classList.add('hidden');
             if(notif) notif.classList.add('hidden');
        });
        
        // Initial silent load to check for badge indicator
        if(isLoggedIn && window.loadNotifications) window.loadNotifications(true);
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
                    <p>${user.role?.toLowerCase() === 'admin' ? 'Admin' : 'Member'}</p>
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
    if (isLoggedIn && user.role?.toLowerCase() === 'admin') {
        initAdminLiveEditor();
    }
}

// Global Notification Loader
window.loadNotifications = async (silentMode = false, containerId = 'notif-list-container', badgeId = 'notif-badge') => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;
        const res = await fetch(`${API_URL}/api/auth/notifications`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return;
        const notifs = await res.json();
        
        const badge = document.getElementById(badgeId);
        const container = document.getElementById(containerId);
        
        if (badge) {
            badge.classList.toggle('hidden', notifs.length === 0);
        }

        if (silentMode || !container) return; // Stop if just updating badge or no container

        if (notifs.length === 0) {
            container.innerHTML = `
                <div class="py-8 text-center">
                    <span class="material-symbols-outlined text-4xl text-slate-700 mb-2 block">notifications_off</span>
                    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No new notifications</p>
                </div>`;
            return;
        }

        container.innerHTML = notifs.map(n => `
            <div class="flex gap-4 p-4 ${n.read ? 'bg-slate-800/50 opacity-70' : 'bg-indigo-600/10 border-l-2 border-indigo-500'} rounded-xl transition-all">
                <div class="w-10 h-10 ${n.read ? 'bg-slate-800 text-slate-500' : 'bg-indigo-600 text-white'} rounded-full flex items-center justify-center flex-shrink-0">
                    <span class="material-symbols-outlined text-sm">${n.icon || 'campaign'}</span>
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-xs font-bold ${n.read ? 'text-slate-300' : 'text-white'} leading-tight">${escapeHTML(n.title)}</p>
                    <p class="text-[10px] ${n.read ? 'text-slate-500' : 'text-slate-300'} mt-1 truncate" style="white-space: normal; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${escapeHTML(n.body)}</p>
                    <p class="text-[8px] ${n.read ? 'text-slate-600' : 'text-indigo-300'} uppercase font-bold tracking-widest mt-2">${new Date(n.timestamp).toLocaleString([],{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'})}</p>
                </div>
            </div>
        `).join('');
    } catch (e) {
        console.error('Failed to load notifications:', e);
    }
};

window.confirmLogout = function () {
    if (confirm("Sign out of Command Center?")) {
        localStorage.clear();
        window.location.href = 'login.html';
    }
};

/* --- 5. ADMIN COMMAND CENTER LOGIC --- */
window.initializeAdminPanel = async function() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role?.toLowerCase() !== 'admin') {
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

window.fetchAdminStats = async function() {
    try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/admin/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const stats = await res.json();

        if (document.getElementById('stat-total-users')) document.getElementById('stat-total-users').innerText = stats.users || 0;
        if (document.getElementById('stat-users')) document.getElementById('stat-users').innerText = stats.users || 0;
        if (document.getElementById('stat-total-tools')) document.getElementById('stat-total-tools').innerText = stats.tools || 0;
        if (document.getElementById('stat-tools')) document.getElementById('stat-tools').innerText = stats.tools || 0;
    } catch (err) {
        console.error("Failed to fetch admin stats.");
    }
}

/* --- 6. FILE MANAGER & CODE EDITOR --- */
// Note: File management logic (fetchAssetFiles, editFile, etc.) 
// has been migrated natively into admin.html to support full directory CRUD operations.


/* --- 7. SERVER LOGS --- */
window.fetchServerLogs = async function() {
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
window.renderDashboardCharts = function() {
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
            document.title = `${settings.siteName} | SMART HUB`;
            const logoSelectors = ['#nav-site-logo-text', '.brand-block', '.auth-logo'];
            logoSelectors.forEach(sel => {
                const el = document.querySelector(sel);
                if (el) {
                    let textSpan = el.querySelector('.brand-text-span');
                    if (!textSpan) {
                        // Wrap existing raw text to protect sibling images/icons
                        let existingText = '';
                        Array.from(el.childNodes).forEach(node => {
                            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                                existingText += node.textContent;
                                node.textContent = ''; 
                            }
                        });
                        textSpan = document.createElement('span');
                        textSpan.className = 'brand-text-span';
                        textSpan.innerText = existingText || settings.siteName;
                        el.appendChild(textSpan);
                    }
                    textSpan.innerText = settings.siteName.toUpperCase();
                }
            });
        }

        // 2.1 Site Logo
        if (settings.siteLogo) {
            const logoSelectors = ['#nav-site-logo-text', '.brand-block', '.navbar-branding', '.auth-logo'];
            logoSelectors.forEach(sel => {
                const el = document.querySelector(sel);
                if (el) {
                    // Hide existing icon if present
                    const icon = el.querySelector('i, .material-symbols-outlined');
                    if (icon) icon.style.display = 'none';
                    
                    // Check or create img
                    let img = el.querySelector('.custom-site-logo');
                    if (!img) {
                        img = document.createElement('img');
                        img.classList.add('custom-site-logo');
                        img.style.maxHeight = '32px';
                        img.style.marginRight = '8px';
                        img.style.borderRadius = '4px';
                        img.style.objectFit = 'contain';
                        el.prepend(img);
                    }
                    img.src = settings.siteLogo;
                    
                    if (!el.classList.contains('flex')) {
                        el.classList.add('flex', 'items-center');
                    }
                }
            });
        } else {
            // Revert to original text/icon if logo is removed
            const logoSelectors = ['#nav-site-logo-text', '.brand-block', '.navbar-branding', '.auth-logo'];
            logoSelectors.forEach(sel => {
                const el = document.querySelector(sel);
                if (el) {
                    const img = el.querySelector('.custom-site-logo');
                    if (img) img.remove();
                    const icon = el.querySelector('i, .material-symbols-outlined');
                    if (icon) icon.style.display = '';
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
            document.body.classList.remove('sidebar-left', 'sidebar-right', 'sidebar-top', 'sidebar-bottom', 'sidebar-floating');
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
        if (settings.disabledTools || settings.categoryOrder || settings.toolOverrides) {
            applyToolSettings(settings.disabledTools, settings.categoryOrder, settings.toolOverrides);
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
            <div class="cat-card" style="display:flex; align-items:center; justify-content:space-between; padding:15px; margin-bottom: 0;">
                <a href="${tool.link}" style="display:flex; align-items:center; gap:15px; text-decoration:none; color:var(--text-header); flex:1;">
                    <i class="${tool.icon}" style="font-size:1.5rem; color:var(--primary-color);"></i>
                    <span style="font-weight:600;">${tool.name}</span>
                </a>
                <button onclick="event.preventDefault(); toggleFavorite('${tool.link}')" class="btn-icon" style="color:#f59e0b; padding:8px; z-index:10; border:none; background:transparent;" title="Remove from Favorites">
                    <i class="fa-solid fa-star"></i>
                </button>
            </div>
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
    if (window.location.pathname.toLowerCase().includes('admin')) return;

    const toolbar = document.createElement('div');
    toolbar.id = 'admin-live-toolbar';
    toolbar.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:2147483647; pointer-events:none;';
    toolbar.innerHTML = `
        <div style="display:flex; gap:10px; align-items:center; pointer-events:auto;">
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
            <button id="toggle-edit-btn" class="btn-icon" style="width:54px; height:54px; border-radius:50%; background:var(--primary-color); color:white; border:4px solid var(--bg-card); box-shadow:0 4px 15px rgba(0,0,0,0.3); transition:all 0.3s;" title="Enable Visual Editor">
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
function applyToolSettings(disabledPaths, order, overrides) {
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

    // Apply Overrides (Name and Link changes)
    if (overrides && Object.keys(overrides).length > 0) {
        window.CALCULATORS_DATA.forEach(cat => {
            cat.items.forEach(tool => {
                const override = overrides[tool.link] || overrides['/' + tool.link];
                if (override) {
                    if (override.newName) tool.name = override.newName;
                    if (override.newPath) tool.link = override.newPath;
                }
            });
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
    
    buildQuickNavigation();
}

/* --- DYNAMIC QUICK NAVIGATION GENERATOR --- */
function buildQuickNavigation() {
    const navContainers = document.querySelectorAll('.bg-surface-container-high');
    let targetContainer = null;
    navContainers.forEach(c => {
        const h4 = c.querySelector('h4');
        if(h4 && h4.innerText.toUpperCase().includes('QUICK NAVIGATION')) {
            targetContainer = c.querySelector('.space-y-4');
        }
    });

    if (!targetContainer || !window.CALCULATORS_DATA) return;

    let allTools = [];
    window.CALCULATORS_DATA.forEach(cat => {
        cat.items.forEach(tool => allTools.push(tool));
    });

    const currentPath = window.location.pathname;
    let currentIndex = allTools.findIndex(t => currentPath.endsWith(t.link) || t.link.endsWith(currentPath) || currentPath.includes(t.link.split('/').pop()));
    if (currentIndex === -1) return;

    let prevTool = currentIndex > 0 ? allTools[currentIndex - 1] : allTools[allTools.length - 1];
    let nextTool = currentIndex < allTools.length - 1 ? allTools[currentIndex + 1] : allTools[0];

    const getLink = (link) => link.startsWith('/') ? link : '/' + link;

    targetContainer.innerHTML = `
        <a href="${getLink(prevTool.link)}" class="flex items-center gap-3 p-4 bg-surface-container-lowest rounded-xl hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20 group">
            <span class="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">arrow_back</span>
            <div>
                <div class="text-[10px] font-bold text-on-surface-variant uppercase opacity-60">Back</div>
                <div class="text-xs font-bold text-on-surface uppercase">${prevTool.name}</div>
            </div>
        </a>
        <a href="${getLink(nextTool.link)}" class="flex items-center gap-3 p-4 bg-surface-container-lowest rounded-xl hover:bg-primary/10 transition-all border border-transparent hover:border-primary/20 group text-right justify-end">
            <div>
                <div class="text-[10px] font-bold text-on-surface-variant uppercase opacity-60">Next</div>
                <div class="text-xs font-bold text-on-surface uppercase">${nextTool.name}</div>
            </div>
            <span class="material-symbols-outlined text-primary group-hover:scale-110 transition-transform">arrow_forward</span>
        </a>
    `;
}

// Failsafe: Run Interface update again at script end
updateUserInterface();

/* ─── GLOBAL TRANSLATE WIDGET (for pages without calc-utils.js) ─── */
(function injectTranslateIfMissing() {
    // If calc-utils.js already injected the translate button, skip
    if (document.getElementById('sh-translate-fab')) return;
    const inject = () => {
        if (document.getElementById('sh-translate-fab')) return;

        const languages = [
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
            { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
            { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
            { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
            { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
            { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
            { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
            { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
            { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
            { code: 'ur', name: 'اردو', flag: '🇵🇰' },
            { code: 'es', name: 'Español', flag: '🇪🇸' },
            { code: 'fr', name: 'Français', flag: '🇫🇷' },
            { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
            { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
            { code: 'ja', name: '日本語', flag: '🇯🇵' },
            { code: 'ko', name: '한국어', flag: '🇰🇷' },
            { code: 'ar', name: 'العربية', flag: '🇸🇦' },
            { code: 'pt', name: 'Português', flag: '🇧🇷' },
            { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        ];

        // Inject CSS
        if (!document.getElementById('_sh-translate-css')) {
            const style = document.createElement('style');
            style.id = '_sh-translate-css';
            style.textContent = `
                #sh-translate-fab{position:fixed;bottom:24px;left:24px;z-index:9999;display:flex;align-items:center;gap:8px;background:linear-gradient(135deg,#7c3aed 0%,#6366f1 100%);color:#fff;border:none;border-radius:50px;padding:12px 20px;font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;box-shadow:0 8px 32px rgba(124,58,237,.35);transition:all .3s cubic-bezier(.4,0,.2,1)}
                #sh-translate-fab:hover{transform:translateY(-2px) scale(1.02);box-shadow:0 12px 40px rgba(124,58,237,.5)}
                #sh-translate-fab svg{width:18px;height:18px;fill:currentColor}
                #sh-translate-popup{position:fixed;bottom:80px;left:24px;z-index:10000;background:#fff;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.15),0 0 0 1px rgba(0,0,0,.05);padding:20px;width:280px;display:none;animation:shFadeUp .3s ease}
                #sh-translate-popup.active{display:block}
                #sh-translate-popup h4{font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.15em;color:#475569;margin:0 0 12px}
                #sh-translate-popup .sh-lang-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;max-height:320px;overflow-y:auto}
                #sh-translate-popup .sh-lang-btn{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:10px 12px;font-size:11px;font-weight:700;color:#0f172a;cursor:pointer;text-align:left;transition:all .2s}
                #sh-translate-popup .sh-lang-btn:hover{background:#ede9fe;border-color:#c4b5fd;color:#7c3aed}
                #sh-translate-popup .sh-lang-btn.active{background:#7c3aed;border-color:#7c3aed;color:#fff}
                .goog-te-banner-frame{display:none!important}
                .skiptranslate{height:0!important;overflow:hidden!important;opacity:0!important}
                body{top:0!important}
                @keyframes shFadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
            `;
            document.head.appendChild(style);
        }

        const fab = document.createElement('button');
        fab.id = 'sh-translate-fab';
        fab.title = 'Translate this page';
        fab.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg> Translate`;

        const popup = document.createElement('div');
        popup.id = 'sh-translate-popup';
        popup.innerHTML = `<h4>🌐 Select Language</h4><div class="sh-lang-grid">${languages.map(l => `<button class="sh-lang-btn" data-lang="${l.code}">${l.flag} ${l.name}</button>`).join('')}</div>`;

        document.body.appendChild(popup);
        document.body.appendChild(fab);

        // Bind language buttons via delegation
        popup.addEventListener('click', function(e) {
            const btn = e.target.closest('.sh-lang-btn');
            if (!btn) return;
            const langCode = btn.getAttribute('data-lang');
            popup.querySelectorAll('.sh-lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Set cookie directly for Google Translate
            document.cookie = "googtrans=/en/" + langCode + ";path=/";
            document.cookie = "googtrans=/en/" + langCode + ";path=/;domain=" + window.location.hostname;

            const doTranslate = () => {
                const select = document.querySelector('.goog-te-combo');
                if (select) {
                    select.value = langCode;
                    select.dispatchEvent(new Event('change'));
                    setTimeout(() => popup.classList.remove('active'), 300);
                    return true;
                }
                return false;
            };

            if (!doTranslate()) {
                let retries = 0;
                const interval = setInterval(() => {
                    if (doTranslate() || retries++ > 20) {
                        clearInterval(interval);
                        if (retries > 20) window.location.reload();
                    }
                }, 300);
            }
        });

        fab.addEventListener('click', e => { e.stopPropagation(); popup.classList.toggle('active'); });
        document.addEventListener('click', e => { if (!popup.contains(e.target) && e.target !== fab) popup.classList.remove('active'); });

        if (!window.googleTranslateElementInit) {
            window.googleTranslateElementInit = function() {
                new google.translate.TranslateElement({ pageLanguage: 'en', autoDisplay: false }, 'google_translate_element');
            };
            const gDiv = document.createElement('div');
            gDiv.id = 'google_translate_element';
            gDiv.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';
            document.body.appendChild(gDiv);
            const gScript = document.createElement('script');
            gScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            gScript.async = true;
            document.body.appendChild(gScript);
        }
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(inject, 500));
    } else {
        setTimeout(inject, 500);
    }
})();

/* ─── MOBILE HAMBURGER NAV (for all pages loaded via script.js) ─── */
(function() {
    function injectMobileNav() {
        if (document.getElementById('sh-mobile-hamburger')) return;

        // Find the fixed nav bar (top nav used by most pages)
        const nav = document.querySelector('nav.fixed');
        if (!nav) return;

        const navContainer = nav.querySelector('.flex.justify-between') || nav.querySelector('[class*="justify-between"]');
        if (!navContainer) return;

        // Skip if already has a mobile toggle
        if (nav.querySelector('.mobile-toggle') || nav.querySelector('#sh-mobile-hamburger')) return;

        // Find logo block to prepend hamburger before it
        const logoBlock = navContainer.querySelector('#nav-logo-block') || navContainer.firstElementChild;
        if (!logoBlock) return;

        const burger = document.createElement('button');
        burger.id = 'sh-mobile-hamburger';
        burger.title = 'Menu';
        burger.setAttribute('aria-label', 'Open navigation menu');
        burger.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
        logoBlock.insertBefore(burger, logoBlock.firstChild);

        // Build nav links - detect current page to choose links
        const isAdmin = window.location.pathname.includes('admin') || window.location.pathname.includes('Admin');
        const navLinks = isAdmin ? `
            <a href="/AdminDashboard.html"><span class="sh-mob-icon">📊</span> Dashboard</a>
            <a href="/admin.html"><span class="sh-mob-icon">📁</span> Management</a>
            <a href="/admin_mobile_trace.html"><span class="sh-mob-icon">📱</span> Mobile Trace</a>
            <a href="/index.html"><span class="sh-mob-icon">🏠</span> Home</a>
            <a href="/calculators.html"><span class="sh-mob-icon">🧮</span> Tools</a>
            <a href="/GameLobby.html"><span class="sh-mob-icon">🎮</span> Games</a>
            <a href="/settings.html"><span class="sh-mob-icon">⚙️</span> Settings</a>
        ` : `
            <a href="/index.html"><span class="sh-mob-icon">🏠</span> Home</a>
            <a href="/calculators.html"><span class="sh-mob-icon">🧮</span> Tools</a>
            <a href="/GameLobby.html"><span class="sh-mob-icon">🎮</span> Games</a>
            <a href="/history.html"><span class="sh-mob-icon">📜</span> History</a>
            <a href="/about.html"><span class="sh-mob-icon">ℹ️</span> About</a>
            <a href="/settings.html"><span class="sh-mob-icon">⚙️</span> Settings</a>
        `;

        // Create mobile overlay
        const overlay = document.createElement('div');
        overlay.id = 'sh-mobile-overlay';
        overlay.innerHTML = `
            <div class="sh-mob-header">
                <span class="sh-mob-brand">SMART HUB</span>
                <button id="sh-mobile-close" aria-label="Close menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <nav class="sh-mob-links">${navLinks}</nav>
        `;
        document.body.appendChild(overlay);

        // Inject mobile nav CSS only once
        if (!document.getElementById('_sh-mobile-nav-css')) {
            const style = document.createElement('style');
            style.id = '_sh-mobile-nav-css';
            style.textContent = `
                #sh-mobile-hamburger {
                    display: none; background: none; border: none; color: #334155;
                    cursor: pointer; padding: 8px; border-radius: 10px; transition: all 0.2s; flex-shrink: 0;
                }
                #sh-mobile-hamburger:hover { background: rgba(139,92,246,0.1); color: #7c3aed; }
                @media (max-width: 768px) {
                    #sh-mobile-hamburger { display: flex; align-items: center; justify-content: center; }
                    nav.fixed { padding-left: 16px !important; padding-right: 16px !important; }
                    main { padding-left: 16px !important; padding-right: 16px !important; }
                    main h1 { font-size: 2rem !important; }
                    footer { padding-left: 16px !important; padding-right: 16px !important; }
                    footer .flex { flex-direction: column; gap: 8px; text-align: center; }
                }
                #sh-mobile-overlay {
                    position: fixed; inset: 0; z-index: 99999;
                    background: rgba(255,255,255,0.98); backdrop-filter: blur(30px);
                    -webkit-backdrop-filter: blur(30px);
                    display: none; flex-direction: column; padding: 24px;
                    animation: shSlideIn 0.3s ease;
                }
                #sh-mobile-overlay.active { display: flex; }
                @keyframes shSlideIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .sh-mob-header {
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 40px; padding-bottom: 20px; border-bottom: 1px solid #e2e8f0;
                }
                .sh-mob-brand {
                    font-size: 18px; font-weight: 900; letter-spacing: -0.02em;
                    background: linear-gradient(135deg, #7c3aed, #6366f1);
                    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
                }
                .sh-mob-header button {
                    background: #f1f5f9; border: none; border-radius: 12px;
                    padding: 10px; cursor: pointer; color: #475569; transition: all 0.2s;
                }
                .sh-mob-header button:hover { background: #e2e8f0; }
                .sh-mob-links { display: flex; flex-direction: column; gap: 4px; }
                .sh-mob-links a {
                    display: flex; align-items: center; gap: 16px;
                    padding: 16px 20px; border-radius: 16px; font-size: 16px; font-weight: 700;
                    color: #1e293b; text-decoration: none; transition: all 0.2s; letter-spacing: -0.01em;
                }
                .sh-mob-links a:hover { background: rgba(139,92,246,0.08); color: #7c3aed; }
                .sh-mob-icon { font-size: 20px; }
                .dark #sh-mobile-overlay, .dark-mode #sh-mobile-overlay { background: rgba(15,23,42,0.98); }
                .dark .sh-mob-links a, .dark-mode .sh-mob-links a { color: #e2e8f0; }
                .dark .sh-mob-links a:hover, .dark-mode .sh-mob-links a:hover { background: rgba(139,92,246,0.15); color: #a78bfa; }
                .dark .sh-mob-header, .dark-mode .sh-mob-header { border-color: rgba(255,255,255,0.1); }
                .dark .sh-mob-header button, .dark-mode .sh-mob-header button { background: rgba(255,255,255,0.05); color: #94a3b8; }
                .dark #sh-mobile-hamburger, .dark-mode #sh-mobile-hamburger { color: #e2e8f0; }
            `;
            document.head.appendChild(style);
        }

        // Event handlers
        burger.addEventListener('click', (e) => {
            e.stopPropagation();
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        document.getElementById('sh-mobile-close').addEventListener('click', () => {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        overlay.querySelectorAll('.sh-mob-links a').forEach(a => {
            a.addEventListener('click', () => {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Also handle AdminDashboard sidebar on mobile
    function handleAdminSidebar() {
        const sidebar = document.querySelector('aside.h-screen');
        if (!sidebar) return;

        // Add sidebar toggle CSS for mobile
        if (!document.getElementById('_sh-admin-sidebar-css')) {
            const style = document.createElement('style');
            style.id = '_sh-admin-sidebar-css';
            style.textContent = `
                @media (max-width: 768px) {
                    aside.h-screen {
                        position: fixed; left: -280px; transition: left 0.3s ease; z-index: 99998;
                        box-shadow: 10px 0 40px rgba(0,0,0,0.1);
                    }
                    aside.h-screen.sh-sidebar-open { left: 0; }
                    .sh-sidebar-backdrop {
                        position: fixed; inset: 0; background: rgba(0,0,0,0.3);
                        z-index: 99997; display: none;
                    }
                    .sh-sidebar-backdrop.active { display: block; }
                    main.flex-1 { margin-left: 0 !important; }
                    header.sticky { padding-left: 16px !important; padding-right: 16px !important; }
                    .sh-admin-burger {
                        display: flex !important; align-items: center; justify-content: center;
                        background: none; border: none; color: #334155; cursor: pointer;
                        padding: 8px; border-radius: 10px; margin-right: 8px;
                    }
                }
                @media (min-width: 769px) {
                    .sh-admin-burger { display: none !important; }
                    .sh-sidebar-backdrop { display: none !important; }
                }
            `;
            document.head.appendChild(style);
        }

        // Add burger to admin header
        const adminHeader = document.querySelector('header.sticky');
        if (adminHeader && !adminHeader.querySelector('.sh-admin-burger')) {
            const adminBurger = document.createElement('button');
            adminBurger.className = 'sh-admin-burger';
            adminBurger.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
            adminHeader.insertBefore(adminBurger, adminHeader.firstChild);

            // Backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'sh-sidebar-backdrop';
            document.body.appendChild(backdrop);

            adminBurger.addEventListener('click', () => {
                sidebar.classList.toggle('sh-sidebar-open');
                backdrop.classList.toggle('active');
            });
            backdrop.addEventListener('click', () => {
                sidebar.classList.remove('sh-sidebar-open');
                backdrop.classList.remove('active');
            });
            // Close sidebar when links are clicked
            sidebar.querySelectorAll('a').forEach(a => {
                a.addEventListener('click', () => {
                    sidebar.classList.remove('sh-sidebar-open');
                    backdrop.classList.remove('active');
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { injectMobileNav(); handleAdminSidebar(); });
    } else {
        injectMobileNav();
        handleAdminSidebar();
    }
})();

/* ─── ICON PROTECTION FROM TRANSLATE ─── */
(function() {
    function protectIcons() {
        document.querySelectorAll('.material-symbols-outlined, .material-icons, [class*="material-symbols"]').forEach(el => {
            el.classList.add('notranslate'); el.setAttribute('translate', 'no');
        });
        document.querySelectorAll('[class*="fa-"], .fas, .far, .fab, .fal, .fad').forEach(el => {
            el.classList.add('notranslate'); el.setAttribute('translate', 'no');
        });
        document.querySelectorAll('code, pre, .font-mono').forEach(el => {
            el.classList.add('notranslate'); el.setAttribute('translate', 'no');
        });
        const fab = document.getElementById('sh-translate-fab');
        if (fab) { fab.classList.add('notranslate'); fab.setAttribute('translate', 'no'); }
        const popup = document.getElementById('sh-translate-popup');
        if (popup) { popup.classList.add('notranslate'); popup.setAttribute('translate', 'no'); }
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', protectIcons);
    } else {
        protectIcons();
    }
    // Also observe for dynamic elements
    const obs = new MutationObserver(protectIcons);
    const startObs = () => { obs.observe(document.body, { childList: true, subtree: true }); setTimeout(() => obs.disconnect(), 10000); };
    if (document.body) startObs(); else document.addEventListener('DOMContentLoaded', startObs);
})();

/* --- 15. GLOBAL MODAL SYSTEM --- */
// This function injects the modal's HTML structure into the page if it doesn't exist.
function injectModalHTML() {
    if (document.getElementById('custom-modal-backdrop')) return;

    const modalHTML = `
    <div id="custom-modal-backdrop" class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] hidden flex items-center justify-center transition-opacity duration-300 opacity-0">
        <div id="custom-modal-box" class="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 p-8 transform scale-95 transition-transform duration-300">
            <div class="flex items-center gap-4 mb-4">
                <div id="custom-modal-icon" class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black"></div>
                <h3 id="custom-modal-title" class="text-xl font-black tracking-tight text-slate-900 dark:text-white"></h3>
            </div>
            <p id="custom-modal-message" class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6 leading-relaxed"></p>
            
            <div id="custom-modal-prompt-container" class="hidden mb-6">
                <input type="text" id="custom-modal-input" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all font-medium text-sm">
            </div>

            <div class="flex justify-end gap-3" id="custom-modal-actions">
                <button id="custom-modal-cancel" class="hidden px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-sm">Cancel</button>
                <button id="custom-modal-confirm" class="px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-indigo-600 transition-all text-sm">Confirm</button>
            </div>
        </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// This is the core promise-based function that handles modal display and user interaction.
function showModal({ title, message, type = 'info', isPrompt = false, isConfirm = false, defaultValue = '' }) {
    injectModalHTML(); // Ensure the modal is in the DOM

    const modalBackdrop = document.getElementById('custom-modal-backdrop');
    const modalBox = document.getElementById('custom-modal-box');
    const modalIcon = document.getElementById('custom-modal-icon');
    const modalTitle = document.getElementById('custom-modal-title');
    const modalMessage = document.getElementById('custom-modal-message');
    const modalInputContainer = document.getElementById('custom-modal-prompt-container');
    const modalInput = document.getElementById('custom-modal-input');
    const btnCancel = document.getElementById('custom-modal-cancel');
    const btnConfirm = document.getElementById('custom-modal-confirm');

    return new Promise((resolve) => {
        modalTitle.innerText = title;
        modalMessage.innerText = message;

        modalIcon.className = 'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl';
        let iconHTML = '';
        if (type === 'error') {
            modalIcon.classList.add('bg-rose-100', 'text-rose-600');
            iconHTML = '<span class="material-symbols-outlined">error</span>';
            btnConfirm.className = "px-5 py-2.5 bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition-all text-sm";
        } else if (type === 'warning') {
            modalIcon.classList.add('bg-amber-100', 'text-amber-600');
            iconHTML = '<span class="material-symbols-outlined">warning</span>';
            btnConfirm.className = "px-5 py-2.5 bg-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/30 hover:bg-amber-600 transition-all text-sm";
        } else if (type === 'success') {
            modalIcon.classList.add('bg-emerald-100', 'text-emerald-600');
            iconHTML = '<span class="material-symbols-outlined">check_circle</span>';
            btnConfirm.className = "px-5 py-2.5 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-all text-sm";
        } else { // info
            modalIcon.classList.add('bg-indigo-100', 'text-indigo-600');
            iconHTML = '<span class="material-symbols-outlined">info</span>';
            btnConfirm.className = "px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:bg-indigo-600 transition-all text-sm";
        }
        modalIcon.innerHTML = iconHTML;

        modalInputContainer.classList.toggle('hidden', !isPrompt);
        btnCancel.classList.toggle('hidden', !isPrompt && !isConfirm);

        if (isPrompt) {
            modalInput.value = defaultValue;
            setTimeout(() => modalInput.focus(), 100);
        }

        modalBackdrop.classList.remove('hidden');
        requestAnimationFrame(() => {
            modalBackdrop.classList.replace('opacity-0', 'opacity-100');
            modalBox.classList.replace('scale-95', 'scale-100');
        });

        const close = (val) => {
            modalBackdrop.classList.replace('opacity-100', 'opacity-0');
            modalBox.classList.replace('scale-100', 'scale-95');
            setTimeout(() => modalBackdrop.classList.add('hidden'), 300);
            // Clean up listeners to prevent memory leaks
            btnConfirm.onclick = null;
            btnCancel.onclick = null;
            modalInput.onkeydown = null;
            resolve(val);
        };

        btnConfirm.onclick = () => close(isPrompt ? modalInput.value : true);
        btnCancel.onclick = () => close(isPrompt ? null : false);
        modalInput.onkeydown = (e) => { if (e.key === 'Enter') btnConfirm.click(); };
    });
}

// Expose helper functions to the global window object
window.customAlert = (title, message, type) => showModal({ title, message, type });
window.customConfirm = (title, message, type = 'warning') => showModal({ title, message, type, isConfirm: true });
window.customPrompt = (title, message, defaultValue = '') => showModal({ title, message, isPrompt: true, defaultValue });

// Add the modal injector to the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', injectModalHTML);
