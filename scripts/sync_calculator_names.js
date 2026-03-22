
const fs = require('fs');
const path = require('path');

const scriptPath = 'c:/Users/hp/OneDrive/Desktop/New folder/Smart_hub-main/frontend/public/js/script.js';
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

const match = scriptContent.match(/window\.CALCULATORS_DATA\s*=\s*(\[[\s\S]*?\]);/);
const data = eval(match[1]);
const baseDir = 'c:/Users/hp/OneDrive/Desktop/New folder/Smart_hub-main/frontend/public';

data.forEach(cat => {
    cat.items.forEach(item => {
        const fullPath = path.join(baseDir, item.link);
        if (!fs.existsSync(fullPath)) {
            console.log(`[FILE NOT FOUND] Skipping ${item.name}: ${item.link}`);
            return;
        }
        
        let content = fs.readFileSync(fullPath, 'utf8');
        let changed = false;

        // 1. Fix saveCalcToHistory
        const saveRegex = /saveCalcToHistory\(\s*['"](.*?)['"]/g;
        content = content.replace(saveRegex, (match, p1) => {
            if (p1 !== item.name) {
                console.log(`[FIXING SAVE] ${item.link}: "${p1}" -> "${item.name}"`);
                changed = true;
                return `saveCalcToHistory('${item.name}'`;
            }
            return match;
        });

        // 2. Fix initSidebarHistory
        const initRegex = /initSidebarHistory\(\s*['"](.*?)['"]/g;
        content = content.replace(initRegex, (match, p1) => {
            if (p1 !== item.name) {
                console.log(`[FIXING INIT] ${item.link}: "${p1}" -> "${item.name}"`);
                changed = true;
                return `initSidebarHistory('${item.name}'`;
            }
            return match;
        });

        // 3. Fix saveToRegistry or other custom save functions if they have hardcoded names
        // Search for strings that match common patterns but aren't correctly mapped
        // Actually, the above two cover 99% of cases.

        if (changed) {
            fs.writeFileSync(fullPath, content, 'utf8');
        }
    });
});

console.log('Sync complete.');
