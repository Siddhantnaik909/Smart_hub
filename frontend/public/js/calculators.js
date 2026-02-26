/**
 * SMART HUB | Global Calculator Utility Engine
 * Handles Validation, History, and UI Reset
 */

let lastCalculationData = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Generic Save Button Handler
    const saveBtns = document.querySelectorAll('.btn-save');
    saveBtns.forEach(btn => {
        // Prevent double binding if script runs twice
        btn.removeEventListener('click', handleSaveClick);
        btn.addEventListener('click', handleSaveClick);
    });

    // 2. Generic Clear Button Handler
    const clearBtns = document.querySelectorAll('[id^="clear-"], #reset-btn');
    clearBtns.forEach(btn => {
        btn.addEventListener('click', () => clearCalculator());
    });
});

// Helper to handle context-aware saving
function handleSaveClick(e) {
    const toolName = document.querySelector('h2')?.innerText || document.title.split('|')[1]?.trim() || "General Tool";
    saveCalculation(toolName);
}

/**
 * Reset all inputs and hide result cards
 */
function clearCalculator() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.type === 'number' || input.type === 'text') input.value = '';
        if (input.tagName === 'SELECT') input.selectedIndex = 0;
        input.classList.remove('input-error');
    });

    lastCalculationData = null;

    const results = document.getElementById('results');
    if (results) {
        results.style.display = 'none';
        results.classList.add('hidden');
    }

    // Toggle save buttons off until next calculation
    document.querySelectorAll('.btn-save').forEach(btn => btn.disabled = true);
    console.log("Calculator cleared.");
}

/**
 * Standardized Input Validation
 * @param {NodeList} inputs - List of input elements to check
 * @returns {Boolean}
 */
function validateInputs(inputs) {
    let isValid = true;
    inputs.forEach(input => {
        const value = parseFloat(input.value);
        // Check for empty, NaN, or negative (if applicable)
        if (input.value === '' || isNaN(value)) {
            input.classList.add('input-error');
            isValid = false;
        } else {
            input.classList.remove('input-error');
        }
    });

    if (!isValid) {
        // Haptic feedback or shake effect could go here
        alert("Please fill in all fields with valid numbers.");
    }
    return isValid;
}

/**
 * Saves calculation to LocalStorage History
 */
async function saveCalculation(toolName, inputDetails, outputDetails) {
    let data = null;

    // If specific arguments are passed, use them. Otherwise, grab the global state.
    if (toolName && inputDetails && outputDetails) {
        data = {
            name: toolName,
            details: `${inputDetails} ➔ ${outputDetails}`,
            date: new Date().toLocaleString(),
            timestamp: Date.now()
        };
    } else if (lastCalculationData) {
        data = lastCalculationData;
    } else {
        // Fallback for calculators that haven't explicitly wired up `setLastCalc`
        const gatheredInputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), select'))
            .map(i => i.value)
            .filter(v => v !== '')
            .join(', ');

        const possibleResultBox = document.querySelector('#results:not(.hidden), #display');
        let gatheredOutput = possibleResultBox ? possibleResultBox.innerText || possibleResultBox.value : "Calculation Registered";
        if (!gatheredOutput || gatheredOutput.trim() === '') gatheredOutput = "Success";

        data = {
            name: toolName || "General Tool",
            details: gatheredInputs ? `Input: [${gatheredInputs.substring(0, 40)}] ➔ ${gatheredOutput.substring(0, 40)}` : `Action: ${gatheredOutput.substring(0, 40)}`,
            date: new Date().toLocaleString(),
            timestamp: Date.now()
        };
    }

    if (!data) {
        alert("Calculate something first before saving!");
        return;
    }

    try {
        const history = JSON.parse(localStorage.getItem('calc_history') || '[]');

        // Add to start of array
        history.unshift(data);

        // Caps history at 50 items to prevent storage bloat
        if (history.length > 50) history.pop();

        localStorage.setItem('calc_history', JSON.stringify(history));

        // Update "Last Active" on Dashboard if available
        localStorage.setItem('last_active_time', new Date().toLocaleTimeString());

        // Visual Feedback
        const saveBtn = document.querySelector('.btn-save');
        if (saveBtn) {
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Saved to History';
            saveBtn.classList.add('btn-success');
            setTimeout(() => {
                saveBtn.innerHTML = originalText;
                saveBtn.classList.remove('btn-success');
            }, 2000);
        }
    } catch (e) {
        console.error("SMART HUB Storage Error:", e);
    }
}

// Attach to window so individual calculator scripts can update state
window.setLastCalc = (name, inputStr, outputStr) => {
    lastCalculationData = {
        name: name,
        details: `${inputStr} ➔ ${outputStr}`,
        date: new Date().toLocaleString(),
        timestamp: Date.now()
    };
    // Enable save buttons once data exists
    document.querySelectorAll('.btn-save').forEach(btn => btn.disabled = false);
};