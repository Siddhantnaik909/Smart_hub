
// --- MASTER COMPONENT LOADER (v3.4.0) ---
async function loadComponent(placeholderId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            console.warn(`Component not found: ${filePath}`);
            return;
        }
        const html = await response.text();

        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // Fix component links
            if (window.FRONTEND_ROOT) {
                tempDiv.querySelectorAll('a, img, script, link').forEach(el => {
                    const attr = (el.tagName === 'A' || el.tagName === 'LINK') ? 'href' : 'src';
                    let val = el.getAttribute(attr);
                    if (val && !val.startsWith('http') && !val.startsWith('/') && !val.startsWith('#')) {
                        el.setAttribute(attr, window.FRONTEND_ROOT + val);
                    }
                });
            }

            const fragment = document.createDocumentFragment();
            while (tempDiv.firstChild) fragment.appendChild(tempDiv.firstChild);
            placeholder.replaceWith(fragment);
        }
    } catch (error) { console.error(`Failed to load ${filePath}:`, error); }
}

// --- GLOBAL UI FUNCTIONS ---
window.toggleDropdown = function (id, element) {
    const content = document.getElementById(id);
    if (!content) return;
    const icon = element.querySelector('.dropdown-icon');
    const isOpen = content.style.display === "block";
    content.style.display = isOpen ? "none" : "block";
    if (icon) icon.classList.toggle('rotate', !isOpen);
};

window.toggleSidebar = function () {
    document.querySelector('.sidebar')?.classList.toggle('active');
    document.querySelector('.overlay')?.classList.toggle('active');
};

window.toggleDarkMode = function (checkbox) {
    const isDark = checkbox.checked;
    document.body.classList.toggle('dark-mode', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    // Sync all dark mode toggles (Sidebar & Settings)
    document.querySelectorAll('#theme-checkbox, #settings-theme-toggle').forEach(t => {
        if (t !== checkbox) t.checked = isDark;
    });
};

window.toggleCompactMode = function (checkbox) {
    const isCompact = checkbox.checked;
    document.body.classList.toggle('compact-mode', isCompact);
    localStorage.setItem('compact', isCompact ? 'true' : 'false');
};

window.toggleSidebarCollapse = function () {
    document.body.classList.toggle('sidebar-collapsed');
    const isCollapsed = document.body.classList.contains('sidebar-collapsed');
    localStorage.setItem('sidebarCollapsed', isCollapsed ? 'true' : 'false');
};

window.filterCalculators = function () {
    const input = document.querySelector('.search-box input');
    if (!input) return;
    const filter = input.value.toLowerCase();
    const menu = document.querySelector('.side-menu');
    if (!menu) return;

    const links = menu.querySelectorAll('a');
    links.forEach(link => {
        // Reset first
        link.style.display = '';
        const parentDropdown = link.closest('.dropdown-content');
        if (parentDropdown) parentDropdown.style.display = '';

        if (filter) {
            const text = link.textContent || link.innerText;
            if (text.toLowerCase().indexOf(filter) > -1) {
                link.style.display = '';
                // Show parent dropdowns
                if (parentDropdown) parentDropdown.style.display = 'block';
            } else {
                link.style.display = 'none';
            }
        }
    });
};

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", async () => {
    const loader = Object.assign(document.createElement('div'), { id: 'global-loader', innerHTML: '<div class="loader-spinner"></div>' });
    document.body.appendChild(loader);

    // Dynamic Port Logic
    const PORT = 3000;
    const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? `http://localhost:${PORT}`
        : 'https://smart-hub-f5gw.onrender.com';
    window.API_URL = API_URL;

    try {
        // Parallel load all global components
        await Promise.all([
            loadComponent('sidebar-placeholder', '/components/sidebar.html'),
            loadComponent('header-placeholder', '/components/navbar.html'),
            loadComponent('footer-placeholder', '/components/footer.html') // Lowercase fix
        ]);

        // Signal that components are ready
        document.dispatchEvent(new Event('componentsLoaded'));

        updateUserInterface();
        initTheme();
    } finally {
        setTimeout(() => { if (loader) { loader.style.opacity = '0'; setTimeout(() => loader.remove(), 300); } }, 500);
    }
});

function initTheme() {
    // 1. Dark Mode Initialization
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
        document.body.classList.add('dark-mode');
    }
    // Sync all theme toggles
    document.querySelectorAll('#theme-checkbox, #settings-theme-toggle').forEach(box => box.checked = isDark);

    // 2. Compact Mode Initialization
    const isCompact = localStorage.getItem('compact') === 'true';
    if (isCompact) document.body.classList.add('compact-mode');
    const compactToggle = document.getElementById('compact-toggle');
    if (compactToggle) compactToggle.checked = isCompact;

    // 3. Sidebar Collapse Initialization
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed) document.body.classList.add('sidebar-collapsed');

    // Remove old layout classes before applying new one
    document.body.classList.remove('sidebar-left', 'sidebar-right', 'sidebar-top', 'sidebar-bottom');

    // 4. Global Settings (Layout, Color, Font Size, Glassmorphism)
    const layoutMode = localStorage.getItem('layoutMode') || 'left';
    if (layoutMode !== 'left') {
        document.body.classList.add(`sidebar-${layoutMode}`);
    }

    const themeColor = localStorage.getItem('themeColor');
    if (themeColor) {
        document.documentElement.style.setProperty('--primary-color', themeColor);
        document.documentElement.style.setProperty('--primary-gradient', `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}dd 100%)`);
    }

    const fontSize = localStorage.getItem('customFontSize');
    if (fontSize) {
        document.documentElement.style.fontSize = `${fontSize}px`;
    }

    const isGlass = localStorage.getItem('glassmorphism') === 'true';
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

    // Auto-update copyright year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

// Subscribe to real-time Cross-Tab Settings sync
window.addEventListener('storage', (e) => {
    // Only trigger re-render on visual preference changes
    const displayKeys = ['theme', 'compact', 'sidebarCollapsed', 'layoutMode', 'themeColor', 'customFontSize', 'glassmorphism'];
    if (displayKeys.includes(e.key)) {
        initTheme();
    }
});

function updateUserInterface() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const container = document.getElementById('auth-actions');
    if (!container) return;

    if (isLoggedIn) {
        const avatarHTML = user.photo
            ? `<img src="${user.photo}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" alt="User Avatar" onerror="this.onerror=null;this.outerHTML='<div class=&quot;avatar-placeholder&quot;>${(user.name || 'U').charAt(0).toUpperCase()}</div>'">`
            : `<div class="avatar-placeholder">${(user.name || 'U').charAt(0).toUpperCase()}</div>`;

        container.innerHTML = `
            <div class="profile-menu-container">
                <div class="profile-trigger" onclick="this.nextElementSibling.classList.toggle('active'); event.stopPropagation();">
                    ${avatarHTML}
                    <span>${user.name || 'User'}</span>
                </div>
                <div class="profile-dropdown">
                    <a href="/settings.html" class="dropdown-item">Settings</a>
                    <a href="/history.html" class="dropdown-item">History</a>
                    <div class="dropdown-divider"></div>
                    <div onclick="localStorage.clear(); window.location.href='/login.html'" style="color: #ef4444; cursor:pointer;" class="dropdown-item">Logout</div>
                </div>
            </div>`;
    }

    // 2. Sidebar Profile
    const sidebarProfile = document.querySelector('.user-profile');
    if (sidebarProfile) {
        if (isLoggedIn) {
            sidebarProfile.style.display = 'flex';
            const avatar = sidebarProfile.querySelector('.user-avatar');
            const name = sidebarProfile.querySelector('.user-info h4');
            const role = sidebarProfile.querySelector('.user-info p');

            if (avatar) {
                if (user.photo) {
                    avatar.innerHTML = `<img src="${user.photo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" alt="User Photo" onerror="this.onerror=null;this.outerHTML='${(user.name || 'U').charAt(0).toUpperCase()}'">`;
                    avatar.style.padding = '0'; // remove text padding if needed
                } else {
                    avatar.textContent = (user.name || 'U').charAt(0).toUpperCase();
                }
            }
            if (name) name.textContent = user.name || 'User';
            if (role) role.textContent = user.role === 'admin' ? 'Administrator' : 'Member';
        } else {
            sidebarProfile.style.display = 'none';
        }
    }
}

