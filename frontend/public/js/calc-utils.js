/**
 * SMART HUB | Enhanced Calculation Result Utility
 * v3.0 - Staggered animations, rich history, glassmorphism detail modal
 */

/* ─── 1. Render Results with stagger animation ─── */
window.renderResults = function (containerId, rows) {
    const el = document.getElementById(containerId);
    if (!el) return;

    // Global copy helper if not exists
    if (!window._copyResultVal) {
        window._copyResultVal = function(val, btn) {
            const text = String(val).replace(/<[^>]*>?/gm, '');
            navigator.clipboard.writeText(text).then(() => {
                const original = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i>';
                btn.style.color = '#10b981';
                btn.style.borderColor = '#10b981';
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.style.color = '';
                    btn.style.borderColor = '';
                }, 2000);
            });
        };
    }

    // Global share helper if not exists
    if (!window._shareResultVal) {
        window._shareResultVal = function(label, val, btn) {
            if (navigator.share) {
                navigator.share({
                    title: 'Smart Hub Result',
                    text: `${label}: ${val}`
                }).catch(console.error);
            } else {
                window._copyResultVal(val, btn);
            }
        };
    }

    el.innerHTML = rows.map((r, i) =>
        `<div class="result-row" id="_rr${i}">
            <span class="result-label">${r.label}</span>
            <div class="result-val-group">
                <span class="result-val" style="font-size:${r.highlight ? '1.35rem' : '1.1rem'};
                    color:${r.highlight ? '#10b981' : 'var(--primary-color)'}">
                    ${r.val}
                </span>
                <button class="btn-copy-mini" onclick="window._copyResultVal('${String(r.val).replace(/'/g, "\\'").replace(/\n/g, "\\n")}', this)" title="Copy">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="btn-copy-mini" onclick="window._shareResultVal('${String(r.label).replace(/'/g, "\\'")}', '${String(r.val).replace(/'/g, "\\'").replace(/\n/g, "\\n")}', this)" title="Share">
                    <i class="fas fa-share-alt"></i>
                </button>
            </div>
        </div>`
    ).join('');
    rows.forEach((_, i) => setTimeout(() => {
        const el = document.getElementById(`_rr${i}`);
        if (el) { el.classList.add('visible'); }
    }, 60 + i * 110));
};

/* ─── 2. Show the results card with slide-in animation ─── */
window.showResultCard = function (cardId) {
    const card = document.getElementById(cardId);
    if (!card) return;
    card.style.display = 'block';
    card.style.animation = 'calcFadeUp 0.45s ease';
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

/* ─── 3. Save rich calculation to localStorage ─── */
window.saveCalcToHistory = async function (toolName, inputs, resultRows) {
    const entry = {
        id: Date.now(),
        name: toolName,
        date: new Date().toLocaleString(),
        timestamp: Date.now(),
        inputs: inputs,       // array of {label, val}
        results: resultRows,  // array of {label, val, highlight}
        // backward-compat details string
        details: `${inputs.map(i => i.val).join(', ')} ➔ ${(resultRows.find(r => r.highlight) || resultRows[0])?.val || ''}`,
    };

    // 1. Save to LocalStorage (Immediate feedback / Offline)
    try {
        const history = JSON.parse(localStorage.getItem('calc_history') || '[]');
        history.unshift(entry);
        if (history.length > 50) history.pop();
        localStorage.setItem('calc_history', JSON.stringify(history));
        localStorage.setItem('last_active_time', new Date().toLocaleTimeString());
    } catch (e) { console.error('LocalStorage Save Failed', e); }

    // 2. Save to Backend (Permanent Cloud Sync)
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const HOST = (window.location.protocol === 'file:') ? 'http://localhost:3000' : window.location.origin;
            await fetch(`${HOST}/api/history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    toolName,
                    inputs,
                    results: resultRows,
                    details: entry.details
                })
            });
        } catch (err) {
            console.error('Remote History Save Failed', err);
        }
    }
    
    // 3. Trigger Sidebar Refresh if exists
    if (typeof window.renderSidebarHistory === 'function') {
        window.renderSidebarHistory();
    }
    
    return true;
};

/* ─── 4. Standardized Sidebar History Rendering ─── */
window.getUserPreference = function(key, defaultValue) {
    const userStr = localStorage.getItem('user');
    if (!userStr) return defaultValue;
    try {
        const user = JSON.parse(userStr);
        return (user.preferences && user.preferences[key]) ? user.preferences[key] : defaultValue;
    } catch (e) { return defaultValue; }
};

window.initSidebarHistory = function (toolName, containerId, partialMatch = false) {
    window.currentToolName = toolName;
    window.historyContainerId = containerId;
    
    window.renderSidebarHistory = function () {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const history = JSON.parse(localStorage.getItem('calc_history') || '[]');
        const toolHistory = history.filter(h => {
            const hName = h.name || h.toolName || '';
            if (partialMatch) return hName.includes(toolName);
            return hName === toolName;
        }).slice(0, 5);
        
        if (toolHistory.length === 0) {
            container.innerHTML = `<p class="text-sm text-on-surface-variant font-medium opacity-60 text-center py-4">No recent ${toolName} records.</p>`;
            return;
        }
        
        container.innerHTML = toolHistory.map((item, idx) => {
            const opacity = idx === 0 ? '' : 'opacity-60';
            const border = idx === 0 ? 'border-primary' : 'border-surface-container-high';
            const time = new Date(item.timestamp || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            let mainVal = item.results && item.results[0] ? item.results[0].val : '0.0';
            let subLabel = item.results && item.results[1] ? item.results[1].val : (item.inputs && item.inputs[0] ? item.inputs[0].val : 'History');
            
            return `
                <div class="flex flex-col gap-1 border-l-2 ${border} pl-4 ${opacity} transition-all hover:opacity-100">
                    <span class="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">${time}</span>
                    <p class="text-xs font-bold text-on-surface truncate pr-4">${item.name || toolName}: ${mainVal}</p>
                    <p class="text-[9px] font-black text-primary tracking-tighter uppercase font-mono">${subLabel}</p>
                </div>`;
        }).join('');
    };

    window.clearSidebarHistory = function () {
        if (!confirm(`Purge ${toolName} records?`)) return;
        let history = JSON.parse(localStorage.getItem('calc_history') || '[]');
        history = history.filter(h => {
            const hName = h.name || h.toolName || '';
            if (partialMatch) return !hName.includes(toolName);
            return hName !== toolName;
        });
        localStorage.setItem('calc_history', JSON.stringify(history));
        window.renderSidebarHistory();
    };

    window.renderSidebarHistory();
};

/* ─── 4. Bridge for manual user edits (Standard Calculator) ─── */
window.saveCalculation = function (name, expr, res) {
    const inputs = [{ label: 'Expression', val: expr }];
    const results = [{ label: 'Result', val: res, highlight: true }];
    return window.saveCalcToHistory(name, inputs, results);
};

/* ─── 4. Attach save button handler ─── */
window.attachSaveBtn = function (btnId, toolName, inputsFn, resultsFn) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('click', function () {
        const inputs = inputsFn();
        const results = resultsFn();
        if (!inputs || !results) { alert('Calculate something first!'); return; }
        const ok = window.saveCalcToHistory(toolName, inputs, results);
        if (ok) {
            const orig = btn.innerHTML;
            btn.style.transition = 'all 0.2s';
            btn.style.transform = 'scale(0.95)';
            btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
            btn.style.background = '#10b981';
            setTimeout(() => { btn.style.transform = 'scale(1)'; }, 200);
            setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2000);
        }
    });
};

/* ─── 5. Inject keyframe CSS once ─── */
(function injectCSS() {
    if (document.getElementById('_calc-utils-css')) return;
    const s = document.createElement('style');
    s.id = '_calc-utils-css';
    s.textContent = `
        @keyframes calcFadeUp {
            from { opacity:0; transform:translateY(24px); }
            to   { opacity:1; transform:translateY(0); }
        }
        .result-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 20px;
            padding: 12px 0;
            border-bottom: 1px solid var(--border-color);
            opacity: 0;
            transform: translateY(16px);
            transition: all 0.38s ease;
        }
        .result-row.visible { opacity: 1; transform: translateY(0); }
        .result-label { font-size: 0.95rem; color: var(--text-muted); }
        .result-val-group { display: flex; align-items: center; gap: 12px; text-align: right; }
        .result-val { font-weight: 700; }
        .btn-copy-mini {
            background: transparent;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            color: var(--text-muted);
            cursor: pointer;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            transition: all 0.2s;
        }
        .btn-copy-mini:hover {
            color: var(--primary-color);
            border-color: var(--primary-color);
            background: var(--bg-main);
        }
        @media (max-width: 400px) {
            .result-row { flex-direction: column; align-items: flex-start; gap: 6px; }
            .result-val-group { width: 100%; justify-content: space-between; }
        }
        .calc-info-box {
            background: rgba(99,102,241,0.07);
            border-left: 4px solid var(--primary-color);
            border-radius: 10px;
            padding: 18px 20px;
            margin-bottom: 18px;
        }
        .calc-info-box h4 {
            margin: 0 0 10px;
            color: var(--primary-color);
            display: flex; align-items: center; gap: 8px;
        }
        .calc-info-box li, .calc-info-box p { margin: 5px 0; font-size: 0.95rem; opacity:0.9; }
        .calc-formula-box {
            background: var(--bg-main);
            border: 1px solid var(--border-color);
            border-radius: 10px;
            padding: 13px 18px;
            font-family: 'Courier New', monospace;
            font-size: 0.95rem;
            color: var(--primary-color);
            text-align: center;
            margin: 10px 0;
            line-height: 1.8;
        }
        .calc-tip-box {
            background: rgba(16,185,129,0.08);
            border-left: 4px solid #10b981;
            border-radius: 10px;
            padding: 14px 18px;
            margin-top: 18px;
        }
        .calc-tip-box h4 { color: #10b981; margin: 0 0 8px; display:flex; align-items:center; gap:8px; }
        .calc-tip-box li { margin: 5px 0; font-size: 0.93rem; opacity: 0.9; }

        /* --- Google Translate Floating Button --- */
        #sh-translate-fab {
            position: fixed;
            bottom: 24px;
            left: 24px;
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 8px;
            background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
            color: #fff;
            border: none;
            border-radius: 50px;
            padding: 12px 20px;
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            font-size: 12px;
            font-weight: 800;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            cursor: pointer;
            box-shadow: 0 8px 32px rgba(124, 58, 237, 0.35);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        #sh-translate-fab:hover {
            transform: translateY(-2px) scale(1.02);
            box-shadow: 0 12px 40px rgba(124, 58, 237, 0.5);
        }
        #sh-translate-fab svg {
            width: 18px;
            height: 18px;
            fill: currentColor;
        }
        #sh-translate-popup {
            position: fixed;
            bottom: 80px;
            left: 24px;
            z-index: 10000;
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05);
            padding: 20px;
            width: 280px;
            display: none;
            animation: calcFadeUp 0.3s ease;
        }
        #sh-translate-popup.active { display: block; }
        #sh-translate-popup h4 {
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: #475569;
            margin: 0 0 12px 0;
        }
        #sh-translate-popup .sh-lang-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            max-height: 320px;
            overflow-y: auto;
        }
        #sh-translate-popup .sh-lang-btn {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 10px 12px;
            font-size: 11px;
            font-weight: 700;
            color: #0f172a;
            cursor: pointer;
            text-align: left;
            transition: all 0.2s;
        }
        #sh-translate-popup .sh-lang-btn:hover {
            background: #ede9fe;
            border-color: #c4b5fd;
            color: #7c3aed;
        }
        #sh-translate-popup .sh-lang-btn.active {
            background: #7c3aed;
            border-color: #7c3aed;
            color: #fff;
        }
        /* Hide default Google Translate bar */
        .goog-te-banner-frame, .skiptranslate { display: none !important; }
        body { top: 0 !important; }
    `;
    document.head.appendChild(s);
})();

/* ─── 6. Google Translate Floating Widget ─── */
(function injectTranslateWidget() {
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

    // Create FAB button
    const fab = document.createElement('button');
    fab.id = 'sh-translate-fab';
    fab.title = 'Translate this page';
    fab.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/></svg> Translate`;

    // Create popup
    const popup = document.createElement('div');
    popup.id = 'sh-translate-popup';
    popup.innerHTML = `
        <h4>🌐 Select Language</h4>
        <div class="sh-lang-grid">
            ${languages.map(l => `<button class="sh-lang-btn" data-lang="${l.code}" onclick="window._shTranslateTo('${l.code}', this)">${l.flag} ${l.name}</button>`).join('')}
        </div>
    `;

    document.body.appendChild(popup);
    document.body.appendChild(fab);

    // Toggle popup
    fab.addEventListener('click', (e) => {
        e.stopPropagation();
        popup.classList.toggle('active');
    });

    // Close popup on outside click
    document.addEventListener('click', (e) => {
        if (!popup.contains(e.target) && e.target !== fab) {
            popup.classList.remove('active');
        }
    });

    // Google Translate Element init
    window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            autoDisplay: false,
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
    };

    // Hidden container for Google Translate
    const gDiv = document.createElement('div');
    gDiv.id = 'google_translate_element';
    gDiv.style.display = 'none';
    document.body.appendChild(gDiv);

    // Load Google Translate script
    const gScript = document.createElement('script');
    gScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    gScript.async = true;
    document.body.appendChild(gScript);

    // Translation trigger
    window._shTranslateTo = function(langCode, btnEl) {
        // Update active state
        popup.querySelectorAll('.sh-lang-btn').forEach(b => b.classList.remove('active'));
        btnEl.classList.add('active');

        // Trigger Google Translate
        const select = document.querySelector('.goog-te-combo');
        if (select) {
            select.value = langCode;
            select.dispatchEvent(new Event('change'));
        }

        // Close popup after selection
        setTimeout(() => popup.classList.remove('active'), 300);
    };
})();
