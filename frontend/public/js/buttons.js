/**
 * SMART HUB | Centralized Button & Interaction Engine
 * Handles dynamic styling, loading states, and unified telemetry.
 */

const BUTTON_THEMES = {
    calc: { class: 'btn-calc', icon: 'fa-wand-magic-sparkles', defaultLabel: 'Calculate' },
    save: { class: 'btn-save', icon: 'fa-floppy-disk', defaultLabel: 'Save Result' },
    reset: { class: 'btn-reset', icon: 'fa-rotate-left', defaultLabel: 'Clear' },
    copy: { class: 'btn-copy', icon: 'fa-copy', defaultLabel: '' }
};

export function initButtons() {
    // 1. Auto-initialize buttons based on their purpose (class-based)
    Object.keys(BUTTON_THEMES).forEach(key => {
        const theme = BUTTON_THEMES[key];
        const buttons = document.querySelectorAll(`.${theme.class}`);

        buttons.forEach(btn => {
            // Inject default icons/labels if the button is empty
            if (!btn.innerHTML.trim() && theme.defaultLabel) {
                btn.innerHTML = `<i class="fa-solid ${theme.icon}"></i> ${theme.defaultLabel}`;
            }

            // Standardize interaction feedback
            btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.95)');
            btn.addEventListener('mouseup', () => btn.style.transform = 'scale(1)');
            btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');

            // Unified Telemetry/Logging
            btn.addEventListener('click', () => {
                console.log(`[UI] Interaction: ${btn.id || btn.className} | Path: ${window.location.pathname}`);
            });
        });
    });
}

/**
 * Global Loading State Handler
 * Used for tools involving file processing or network requests (Port Scanner, MD5).
 */
window.setButtonLoading = function(btnOrId, isLoading) {
    const btn = typeof btnOrId === 'string' ? document.getElementById(btnOrId) : btnOrId;
    if (!btn) return;

    if (isLoading) {
        btn.dataset.originalContent = btn.innerHTML; // Store current label
        btn.classList.add('btn-loading');
        btn.disabled = true;
        btn.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin"></i> Processing...`;
    } else {
        btn.classList.remove('btn-loading');
        btn.disabled = false;
        btn.innerHTML = btn.dataset.originalContent || btn.innerHTML;
    }
};