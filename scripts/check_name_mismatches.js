
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
        if (!fs.existsSync(fullPath)) return;
        
        const content = fs.readFileSync(fullPath, 'utf8');
        const saveMatch = content.match(/saveCalcToHistory\(\s*['"](.*?)['"]/);
        const initMatch = content.match(/initSidebarHistory\(\s*['"](.*?)['"]/);
        
        if (saveMatch && saveMatch[1] !== item.name) {
             console.log(`[MISMATCH] ${item.link}: Expected "${item.name}", found "${saveMatch[1]}" in saveCalcToHistory`);
        }
        if (initMatch && initMatch[1] !== item.name) {
             console.log(`[MISMATCH] ${item.link}: Expected "${item.name}", found "${initMatch[1]}" in initSidebarHistory`);
        }
    });
});
