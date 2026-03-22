const fs = require('fs');
const path = require('path');

function fixFile(filepath) {
    if (!filepath.endsWith('.html')) return;
    let content = fs.readFileSync(filepath, 'utf8');

    // Pattern for HOST detection in calculators/auth pages
    const hostPattern = /const HOST = \(window\.location\.hostname === 'localhost' \|\| window\.location\.hostname === '127\.0\.0\.1' \|\| window\.location\.protocol === 'file:'\) \? 'http:\/\/localhost:3000' : 'https:\/\/smart-hub-f5gw\.onrender\.com';/g;
    
    const newHost = "const HOST = (window.location.protocol === 'file:') ? 'http://localhost:3000' : window.location.origin;";
    
    if (hostPattern.test(content)) {
        console.log(`Fixing HOST in: ${filepath}`);
        content = content.replace(hostPattern, newHost);
        fs.writeFileSync(filepath, content);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else {
            fixFile(fullPath);
        }
    }
}

walk(path.join(__dirname, 'frontend/public'));
console.log("Port support (3001) fixed across all HTML files.");
