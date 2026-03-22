const fs = require('fs');
const path = require('path');

const dirToScan = path.join(__dirname, 'frontend/public');
const outputFile = path.join(__dirname, 'script_check_readme.md');

let report = '# Frontend Scripts Status Report\n\n';
report += 'If your screen logic is not working, check the table below. A missing `script.js` means the page has no core logic. A missing `calc-utils.js` on a calculator means the calculate/save buttons will not work.\n\n';
report += '| HTML File | Has script.js | Has calc-utils.js (Calculators) |\n';
report += '|---|---|---|\n';

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.html')) {
            checkFile(fullPath, file);
        }
    }
}

function checkFile(filepath, filename) {
    const content = fs.readFileSync(filepath, 'utf8');
    
    // Check for the main script
    const hasScriptJs = content.includes('/js/script.js') ? '✅ Yes' : '❌ No';
    
    // Check for calculator utils on tools/calculators/games
    let hasCalcUtils = 'N/A';
    if (filename.includes('calc_') || filename.includes('tool_') || filename.includes('game_')) {
        hasCalcUtils = content.includes('/js/calc-utils.js') || content.includes('/js/calculators.js') ? '✅ Yes' : '❌ No';
    }

    const relativePath = path.relative(__dirname, filepath).replace(/\\/g, '/');
    report += `| ${relativePath} | ${hasScriptJs} | ${hasCalcUtils} |\n`;
}

walk(dirToScan);
fs.writeFileSync(outputFile, report, 'utf8');
console.log(`Scan complete! Open ${outputFile} to see which files are missing their scripts.`);