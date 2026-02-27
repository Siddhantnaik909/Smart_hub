// ============================================================
// SMART HUB - Component Loader with Offline Fallback
// Dual mode: fetch from server OR use inline fallbacks
// ============================================================

// --- Detect if running as a static file (no server) ---
const _isStatic = (window.location.protocol === 'file:');

// --- Calculate relative base path for static mode ---
function _getRelBase() {
    if (!_isStatic) return '/';
    const p = window.location.pathname.replace(/\\/g, '/');
    const segments = p.split('/').filter(Boolean);
    // Find the filename, everything before it is the depth
    // We need to reach the "public" root level
    // Files in root: depth 0 → './'
    // Files in calculators/fun/: depth 2 → '../../'
    const markers = ['calculators', 'tools'];
    let depth = 0;
    for (let i = 0; i < segments.length - 1; i++) {
        if (markers.includes(segments[i])) {
            depth = segments.length - 1 - i;
            break;
        }
    }
    return depth === 0 ? './' : '../'.repeat(depth);
}

// --- Fix absolute paths to relative for static mode ---
function _fixLinks(container) {
    const base = _getRelBase();
    container.querySelectorAll('a, img, script, link[rel="stylesheet"], source').forEach(el => {
        const attr = (el.tagName === 'A' || el.tagName === 'LINK') ? 'href' : 'src';
        let val = el.getAttribute(attr);
        if (val && !val.startsWith('http') && !val.startsWith('data:') && !val.startsWith('#') && !val.startsWith('javascript:')) {
            if (val.startsWith('/')) val = val.substring(1);
            el.setAttribute(attr, base + val);
        }
    });
}

// --- Lazily build fallback HTML only when needed ---
function _getFallback(id) {
    if (id === 'header-placeholder') {
        return `<div class="top-header"><div class="header-container">
            <div style="display:flex;align-items:center;gap:15px;">
                <button class="mobile-toggle" onclick="typeof toggleSidebar==='function'&&toggleSidebar()" title="Menu"><i class="fas fa-bars"></i></button>
                <div class="navbar-branding" id="nav-logo-block">
                    <i class="fa-solid fa-microchip" style="color:var(--primary-color);font-size:1.5rem;"></i>
                    <span id="nav-site-logo-text" style="font-weight:700;font-size:1.1rem;background:var(--primary-gradient);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;">SMART HUB</span>
                </div>
                <div class="nav-title"><span class="accent-text" id="page-title-display">Dashboard</span></div>
            </div>
            <div class="nav-actions" id="auth-actions">
                <div class="auth-btn-group">
                    <a href="login.html" class="btn-secondary">Login</a>
                    <a href="signup.html" class="btn-primary">Sign Up</a>
                </div>
            </div>
        </div></div>`;
    }

    if (id === 'footer-placeholder') {
        return `<footer class="main-footer" style="padding:20px;text-align:center;border-top:1px solid var(--border-color,#333);margin-top:40px;color:var(--text-muted,#888);">
            <div class="container">
                <p>&copy; 2026 SMART HUB. All rights reserved.</p>
                <div class="footer-links" style="margin-top:10px;display:flex;justify-content:center;gap:15px;">
                    <a href="about.html" style="color:var(--primary-color,#6366f1);text-decoration:none;">About</a>
                    <a href="contact.html" style="color:var(--primary-color,#6366f1);text-decoration:none;">Contact</a>
                    <a href="privacy.html" style="color:var(--primary-color,#6366f1);text-decoration:none;">Privacy Policy</a>
                </div>
            </div>
        </footer>`;
    }

    if (id === 'sidebar-placeholder') {
        // Build sidebar from CALCULATORS_DATA if available, else use a compact version
        const dd = (id, icon, label, items) =>
            `<div class="dropdown" id="${id}">
                <a onclick="typeof toggleDropdown==='function'&&toggleDropdown('${id}-content',this)" data-title="${label}">
                    <i class="${icon}"></i><span>${label}</span><i class="fas fa-chevron-down dropdown-icon"></i>
                </a>
                <div class="dropdown-content" id="${id}-content">${items}</div>
            </div>`;

        const cats = [
            ['construction-dropdown', 'fas fa-hard-hat', 'Construction', [
                ['calculators/construction/calc_brick.html', 'Brick Estimator'],
                ['calculators/construction/calc_concrete.html', 'Concrete Calculator'],
                ['calculators/construction/calc_flooring.html', 'Flooring Calculator'],
                ['calculators/construction/calc_fuel.html', 'Fuel Cost Calculator'],
                ['calculators/construction/calc_lumber.html', 'Lumber Board Feet'],
                ['calculators/construction/calc_ohm.html', "Ohm's Law"],
                ['calculators/construction/calc_paint.html', 'Paint Calculator'],
                ['calculators/construction/calc_roof_area.html', 'Roof Area Calculator'],
                ['calculators/construction/calc_wall_stud.html', 'Wall Stud Calculator']
            ]],
            ['crypto-dropdown', 'fas fa-vault', 'Cryptography', [
                ['calculators/cryptography/tool_md5_generator.html', 'MD5 Generator']
            ]],
            ['datetime-dropdown', 'fas fa-calendar-alt', 'Date & Time', [
                ['calculators/date-time/calc_age.html', 'Age Calculator'],
                ['calculators/date-time/calc_countdown.html', 'Countdown Timer'],
                ['calculators/date-time/calc_date_diff.html', 'Date Difference'],
                ['calculators/date-time/calc_hours_worked.html', 'Hours Worked'],
                ['calculators/date-time/calc_leap_year.html', 'Leap Year Checker'],
                ['calculators/date-time/calc_time_add.html', 'Time Addition'],
                ['calculators/date-time/calc_time_zone.html', 'Time Zone Converter'],
                ['calculators/date-time/calc_working_days.html', 'Working Days']
            ]],
            ['electronics-dropdown', 'fas fa-microchip', 'Electronics', [
                ['calculators/electronics/calc_555_timer.html', '555 Timer'],
                ['calculators/electronics/calc_capacitor_code.html', 'Capacitor Code'],
                ['calculators/electronics/calc_frequency.html', 'Frequency & Wavelength'],
                ['calculators/electronics/calc_led_resistor_calculator.html', 'LED Resistor'],
                ['calculators/electronics/calc_ohm.html', "Ohm's Law"],
                ['calculators/electronics/calc_power.html', 'Power Calculator'],
                ['calculators/electronics/calc_resistor_color_code.html', 'Resistor Color Code'],
                ['calculators/electronics/calc_voltage_divider.html', 'Voltage Divider']
            ]],
            ['finance-dropdown', 'fas fa-dollar-sign', 'Finance', [
                ['calculators/finance/calc_car_loan.html', 'Car Loan'],
                ['calculators/finance/calc_compound.html', 'Compound Interest'],
                ['calculators/finance/calc_compound_interest.html', 'Compound Interest (Adv)'],
                ['calculators/finance/calc_currency.html', 'Currency Converter'],
                ['calculators/finance/calc_discount.html', 'Discount Calculator'],
                ['calculators/finance/calc_loan.html', 'General Loan'],
                ['calculators/finance/calc_loan_emi.html', 'Loan EMI'],
                ['calculators/finance/calc_mortgage.html', 'Mortgage Calculator'],
                ['calculators/finance/calc_roi.html', 'ROI Calculator'],
                ['calculators/finance/calc_salary.html', 'Salary Calculator'],
                ['calculators/finance/calc_savings_goal.html', 'Savings Goal'],
                ['calculators/finance/calc_tax_gst.html', 'Tax / GST'],
                ['calculators/finance/calc_tip_calculator.html', 'Tip Calculator']
            ]],
            ['math-dropdown', 'fas fa-calculator', 'General Math', [
                ['calculators/general-math/calc_average.html', 'Average Calculator'],
                ['calculators/general-math/calc_fractions.html', 'Fractions Calculator'],
                ['calculators/general-math/calc_math_toolkit.html', 'Math Toolkit'],
                ['calculators/general-math/calc_percentage.html', 'Percentage Calculator'],
                ['calculators/general-math/calc_programmer.html', 'Programmer Calculator'],
                ['calculators/general-math/calc_scientific.html', 'Scientific Calculator'],
                ['calculators/general-math/calc_standard.html', 'Standard Calculator'],
                ['calculators/general-math/tool_password.html', 'Password Generator']
            ]],
            ['health-dropdown', 'fas fa-heartbeat', 'Health & Fitness', [
                ['calculators/health-fitness/calc_bmi.html', 'BMI Calculator'],
                ['calculators/health-fitness/calc_bmr.html', 'BMR Calculator'],
                ['calculators/health-fitness/calc_body_fat.html', 'Body Fat Percentage'],
                ['calculators/health-fitness/calc_calorie.html', 'Calorie Calculator'],
                ['calculators/health-fitness/calc_calorie-calculator.html', 'Calorie Tracker Pro'],
                ['calculators/health-fitness/calc_ovulation.html', 'Ovulation Calculator'],
                ['calculators/health-fitness/calc_pregnancy.html', 'Pregnancy Due Date'],
                ['calculators/health-fitness/calc_water.html', 'Water Intake']
            ]],
            ['network-dropdown', 'fas fa-network-wired', 'Network', [
                ['calculators/network/tool_dns_lookup.html', 'DNS Lookup'],
                ['calculators/network/tool_ip_geo.html', 'IP Geolocation'],
                ['calculators/network/tool_ping.html', 'Ping Test'],
                ['calculators/network/tool_port_scanner.html', 'Port Scanner'],
                ['calculators/network/calc_subnet.html', 'Subnet Calculator'],
                ['calculators/network/tool_traceroute.html', 'Traceroute Tool'],
                ['calculators/network/tool_whois.html', 'Whois Lookup']
            ]],
            ['students-dropdown', 'fas fa-graduation-cap', 'Students', [
                ['calculators/students/calc_geometry.html', 'Geometry Calculator'],
                ['calculators/students/calc_gpa.html', 'GPA Calculator'],
                ['calculators/students/calc_grade_weighted.html', 'Grade Weighted'],
                ['calculators/students/calc_mensuration.html', 'Mensuration'],
                ['calculators/students/calc_pomodoro.html', 'Pomodoro Timer'],
                ['calculators/students/calc_quadratic.html', 'Quadratic Equation'],
                ['calculators/students/calc_statistics.html', 'Statistics'],
                ['calculators/students/calc_unit_conv.html', 'Unit Conv']
            ]],
            ['text-dropdown', 'fas fa-keyboard', 'Text & Web', [
                ['calculators/text-web/tool_case_converter.html', 'Case Converter'],
                ['calculators/text-web/tool_lorem_ipsum.html', 'Lorem Ipsum Generator'],
                ['calculators/text-web/tool_password.html', 'Password Strength'],
                ['calculators/text-web/tool_word_counter.html', 'Word Counter']
            ]],
            ['games-dropdown', 'fas fa-gamepad', 'Games', [
                ['calculators/fun/game_car_racing.html', 'Car Racing'],
                ['calculators/fun/game_connect4.html', 'Connect 4'],
                ['calculators/fun/game_chess.html', 'Multiplayer Chess'],
                ['calculators/fun/calc_rock_paper_scissors.html', 'Rock Paper Scissors'],
                ['calculators/fun/game_tic_tac_toe.html', 'Tic Tac Toe']
            ]],
            ['fun-dropdown', 'fas fa-face-grin-tears', 'Fun Tools', [
                ['calculators/fun/calc_coin_flipper.html', 'Coin Flipper'],
                ['calculators/fun/calc_compatibility.html', 'Compatibility Test'],
                ['calculators/fun/calc_dice_roller.html', 'Dice Roller'],
                ['calculators/fun/calc_flames.html', 'FLAMES Game'],
                ['calculators/fun/calc_fortune_cookie.html', 'Fortune Cookie'],
                ['calculators/fun/calc_love.html', 'Love Calculator'],
                ['calculators/fun/calc_magic_8_ball.html', 'Magic 8 Ball'],
                ['calculators/fun/calc_number_guesser.html', 'Number Guesser'],
                ['calculators/fun/calc_random_number.html', 'Random Number'],
                ['calculators/fun/calc_zodiac.html', 'Zodiac Sign']
            ]]
        ];

        const catDropdowns = cats.map(([id, icon, label, items]) =>
            dd(id, icon, label, items.map(([href, name]) => `<a href="${href}">${name}</a>`).join(''))
        ).join('');

        return `<aside class="sidebar">
            <div class="sidebar-toggle" onclick="typeof toggleSidebarCollapse==='function'&&toggleSidebarCollapse()"><i class="fas fa-chevron-left"></i></div>
            <div class="brand-block">
                <i class="fa-solid fa-microchip" style="color:var(--primary-color);margin-right:12px;font-size:1.5rem;"></i>
                <span id="site-logo-text">SMART HUB</span>
            </div>
            <div class="user-profile">
                <div class="user-avatar">SH</div>
                <div class="user-info"><h4>Smart Hub</h4><p>Offline Mode</p></div>
            </div>
            <nav class="side-menu">
                <a href="index.html" data-title="Dashboard"><i class="fas fa-home"></i> <span>Dashboard</span></a>
                <a href="calculators.html" data-title="Calculators"><i class="fas fa-calculator"></i> <span>Calculators list</span></a>
                <div class="dropdown" id="calculators-dropdown">
                    <a onclick="typeof toggleDropdown==='function'&&toggleDropdown('calculators-dropdown-content',this)" data-title="All Calculators">
                        <i class="fas fa-th-large"></i><span>All Calculators</span><i class="fas fa-chevron-down dropdown-icon"></i>
                    </a>
                    <div class="dropdown-content" id="calculators-dropdown-content">${catDropdowns}</div>
                </div>
                <a href="history.html" data-title="History"><i class="fas fa-history"></i> <span>History</span></a>
                <a href="settings.html" data-title="Settings"><i class="fas fa-cog"></i> <span>Settings</span></a>
                <a href="about.html" data-title="About"><i class="fas fa-info-circle"></i> <span>About</span></a>
            </nav>
            <div class="sidebar-footer">
                <div class="theme-switch-wrapper">
                    <label class="toggle-switch" for="theme-checkbox">
                        <input type="checkbox" id="theme-checkbox" onchange="typeof toggleDarkMode==='function'&&toggleDarkMode(this)">
                        <div class="slider"></div>
                    </label>
                    <span style="margin-left:10px;font-size:0.9rem;">Dark Mode</span>
                </div>
                &copy; <span id="current-year"></span> Smart Hub
            </div>
        </aside>`;
    }

    return '';
}

// --- Inject fallback into placeholder ---
function _renderFallback(placeholder, id) {
    const html = _getFallback(id);
    if (!html) {
        placeholder.innerHTML = '';
        return;
    }
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    if (_isStatic) _fixLinks(tmp);
    const frag = document.createDocumentFragment();
    while (tmp.firstChild) frag.appendChild(tmp.firstChild);
    placeholder.replaceWith(frag);
}

// --- Main load function ---
async function loadComponent(placeholderId, filePath) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    // Static file:// mode → use fallback instantly, no network
    if (_isStatic) {
        _renderFallback(placeholder, placeholderId);
        return;
    }

    // Server mode → fetch with timeout
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3000); // 3s max

        let response = await fetch(filePath, { signal: controller.signal });
        clearTimeout(timeout);

        // Retry with relative path climbing if first fetch fails
        if (!response.ok) {
            const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
            const levels = ['./', '../', '../../', '../../../'];
            for (const prefix of levels) {
                try {
                    const r = await fetch(prefix + cleanPath);
                    if (r.ok) { response = r; break; }
                } catch (_) { /* skip */ }
            }
        }

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const html = await response.text();
        const tmp = document.createElement('div');
        tmp.innerHTML = html;

        // Resolve links
        const root = window.FRONTEND_ROOT || '/';
        tmp.querySelectorAll('a, img, script, link[rel="stylesheet"], source').forEach(el => {
            const attr = (el.tagName === 'A' || el.tagName === 'LINK') ? 'href' : 'src';
            let val = el.getAttribute(attr);
            if (val && !val.startsWith('http') && !val.startsWith('data:') && !val.startsWith('#') && !val.startsWith('javascript:')) {
                if (val.startsWith('/')) val = val.substring(1);
                el.setAttribute(attr, root + val);
            }
        });

        const frag = document.createDocumentFragment();
        while (tmp.firstChild) frag.appendChild(tmp.firstChild);
        placeholder.replaceWith(frag);

    } catch (err) {
        console.warn(`[Component Loader] Using fallback for "${placeholderId}":`, err.message);
        _renderFallback(placeholder, placeholderId);
    }
}

// --- Bootstrap ---
document.addEventListener("DOMContentLoaded", async () => {
    const compRoot = window.COMPONENT_ROOT || 'components/';

    await Promise.allSettled([
        loadComponent('sidebar-placeholder', compRoot + 'sidebar.html'),
        loadComponent('header-placeholder', compRoot + 'navbar.html'),
        loadComponent('footer-placeholder', compRoot + 'footer.html')
    ]);

    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    document.dispatchEvent(new Event('componentsLoaded'));
});