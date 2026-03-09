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
        if (input.tagName === 'SELECT') {
            input.selectedIndex = 0;
        } else {
            // This correctly resets text/number/date inputs to their default
            // value specified in HTML, or clears them if no default is set.
            input.value = input.defaultValue;
        }
        input.classList.remove('input-error');
    });

    lastCalculationData = null;

    const results = document.getElementById('results');
    if (results) {
        results.style.display = 'none';
        results.classList.add('hidden');
    }

    // Also clear the content of the main result list for a cleaner state
    const resultDisplayArea = document.getElementById('result-display-area');
    if (resultDisplayArea) {
        resultDisplayArea.innerHTML = '';
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
function validateInputs(inputs, options = { checkPositive: false }) {
    let isValid = true;
    inputs.forEach(input => {
        let hasError = false;

        // Handle date inputs separately
        if (input.type === 'date') {
            if (input.value.trim() === '') {
                hasError = true;
            }
        } else { // Handle numeric and other text-based inputs
            const value = parseFloat(input.value);
            if (input.value.trim() === '' || isNaN(value)) {
                hasError = true;
            } else if (options.checkPositive && value <= 0) {
                hasError = true;
            }
        }

        if (hasError) {
            input.classList.add('input-error');
            isValid = false;
        } else {
            input.classList.remove('input-error');
        }
    });

    if (!isValid) {
        // Haptic feedback or shake effect could go here
        alert("Please fill in all fields with valid, positive numbers where required.");
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
            inputs: [{ label: 'Details', val: inputDetails }],
            results: [{ label: 'Result', val: outputDetails, highlight: true }],
            date: new Date().toLocaleString(),
            timestamp: Date.now()
        };
    } else if (lastCalculationData) {
        data = lastCalculationData;
    } else {
        // Universal Adapter for legacy calculators without setLastCalc
        const inputEls = Array.from(document.querySelectorAll('input:not([type="hidden"]), select'))
            .filter(i => i.value !== '');

        const inputsArr = inputEls.map(i => {
            // Try to find a meaningful label
            let labelText = 'Value';
            const prev = i.previousElementSibling;
            if (prev && prev.tagName === 'SPAN') labelText = prev.innerText;
            else if (prev && prev.tagName === 'LABEL') labelText = prev.innerText;
            else if (i.placeholder) labelText = i.placeholder;
            else if (i.id) labelText = i.id;

            // Clean up label text
            labelText = labelText.replace(/[:]/g, '').trim();
            return { label: labelText.substring(0, 30), val: i.value };
        });

        const gatheredInputs = inputEls.map(i => i.value).join(', ');

        const possibleResultBox = document.querySelector('#results:not(.hidden), #display, .result-display');
        let gatheredOutput = possibleResultBox ? (possibleResultBox.innerText || possibleResultBox.value || '') : "Calculation Registered";

        // Clean up output text (remove button texts and weird whitespace)
        gatheredOutput = gatheredOutput.replace(/Save Result|Saved!|Save to History|Clear|Calculate/gi, '').trim().replace(/\s+/g, ' ');
        if (!gatheredOutput) gatheredOutput = "Success";

        data = {
            name: toolName || document.title.split('|')[1]?.trim() || "General Tool",
            details: gatheredInputs ? `${gatheredInputs.substring(0, 40)} ➔ ${gatheredOutput.substring(0, 40)}...` : `Action: ${gatheredOutput.substring(0, 40)}`,
            inputs: inputsArr.length ? inputsArr : [{ label: "Action", val: "Calculation Performed" }],
            results: [{ label: "Output Summary", val: gatheredOutput.substring(0, 150), highlight: true }],
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
window.setLastCalc = (name, inputs, results) => {
    // inputs and results can be:
    // 1. Arrays of {label: string, val: string}
    // 2. Simple strings (for backward compatibility)
    const inputItems = Array.isArray(inputs) ? inputs : [{ label: "Parameters", val: String(inputs) }];
    
    let resultItems;
    if (Array.isArray(results)) {
        resultItems = results;
        if (resultItems.length > 0 && !resultItems.some(r => r.highlight)) {
            resultItems[0].highlight = true; // Ensure at least one is highlighted
        }
    } else {
        resultItems = [{ label: "Result", val: String(results), highlight: true }];
    }

    const inputStr = inputItems.map(i => i.val).join(', ');
    const outputStr = resultItems.map(r => r.val).join('; ');

    lastCalculationData = {
        name: name,
        details: `${inputStr} ➔ ${outputStr}`,
        inputs: [{ label: "Calculation Params", val: inputStr }],
        results: [{ label: "Result Output", val: outputStr, highlight: true }],
        details: `${inputStr.substring(0, 40)} ➔ ${outputStr.substring(0, 40)}`,
        inputs: inputItems,
        results: resultItems,
        date: new Date().toLocaleString(),
        timestamp: Date.now()
    };
    // Enable save buttons once data exists
    document.querySelectorAll('.btn-save').forEach(btn => btn.disabled = false);
};
}