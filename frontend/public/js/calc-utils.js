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
window.saveCalcToHistory = function (toolName, inputs, resultRows) {
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
    try {
        const history = JSON.parse(localStorage.getItem('calc_history') || '[]');
        history.unshift(entry);
        if (history.length > 50) history.pop();
        localStorage.setItem('calc_history', JSON.stringify(history));
        localStorage.setItem('last_active_time', new Date().toLocaleTimeString());
        return true;
    } catch (e) { return false; }
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
    `;
    document.head.appendChild(s);
})();
