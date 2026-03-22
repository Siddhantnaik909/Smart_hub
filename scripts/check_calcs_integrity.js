
const fs = require('fs');
const path = require('path');

const scriptPath = 'c:/Users/hp/OneDrive/Desktop/New folder/Smart_hub-main/frontend/public/js/script.js';
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

const match = scriptContent.match(/window\.CALCULATORS_DATA\s*=\s*(\[[\s\S]*?\]);/);
const data = eval(match[1]);
const baseDir = 'c:/Users/hp/OneDrive/Desktop/New folder/Smart_hub-main/frontend/public';

data.forEach(cat => {
    cat.items.forEach(item => {
        const link = item.link.startsWith('/') ? item.link.substring(1) : item.link;
        const fullPath = path.join(baseDir, link);
        if (!fs.existsSync(fullPath)) {
            console.log(`[MISSING FILE] ${item.name}: ${item.link}`);
        }
    });
});
