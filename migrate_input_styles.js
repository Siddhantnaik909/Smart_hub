const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log("🚀 Starting Smart Hub Input Style Migration Script...");

// --- CONFIGURATION ---
const targetFolders = [
    'frontend/public/calculators/finance',
    'frontend/public/calculators/general-math' // Assuming 'math' folder is 'general-math'
];

// Define the modern Tailwind classes to apply to form elements.
const newBaseInputClasses = 'w-full bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2.5 dark:bg-slate-800 dark:border-slate-600 dark:placeholder-slate-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500';

// --- SCRIPT LOGIC ---

function migrateFile(filePath) {
    try {
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        const dom = new JSDOM(htmlContent);
        const document = dom.window.document;
        let changesMade = 0;

        // Select all relevant form elements
        const inputs = document.querySelectorAll('input[type="text"], input[type="number"], input[type="date"], select, textarea');

        inputs.forEach(input => {
            // Avoid touching special inputs like hidden or buttons
            if (input.type === 'hidden' || input.type === 'submit' || input.type === 'button' || input.type === 'reset') {
                return;
            }

            // Remove old, potentially conflicting classes and apply the new ones
            input.removeAttribute('class'); // Start fresh
            input.setAttribute('class', newBaseInputClasses);
            changesMade++;
        });

        if (changesMade > 0) {
            const newHtmlContent = dom.serialize();
            fs.writeFileSync(filePath, newHtmlContent, 'utf-8');
            console.log(`✅ [UPDATED] Migrated ${changesMade} form elements in: ${path.basename(filePath)}`);
        } else {
            console.log(`⚪ [SKIPPED] No applicable form elements found in: ${path.basename(filePath)}`);
        }

    } catch (error) {
        console.error(`❌ [ERROR] Failed to process file ${filePath}:`, error.message);
    }
}

targetFolders.forEach(folder => {
    const fullPath = path.join(__dirname, '..', folder);
    if (!fs.existsSync(fullPath)) {
        console.warn(`⚠️ [WARN] Directory not found, skipping: ${fullPath}`);
        return;
    }
    console.log(`\n📁 Scanning folder: ${folder}`);
    const files = fs.readdirSync(fullPath).filter(file => file.endsWith('.html'));
    files.forEach(file => migrateFile(path.join(fullPath, file)));
});

console.log("\n🎉 Migration complete!");