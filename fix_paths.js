const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'frontend/public');

function walk(dir, callback) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(dirPath);
    });
}

walk(baseDir, (filePath) => {
    if (path.extname(filePath) === '.html') {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;

        // 1. Fix CSS Paths to be absolute from root
        content = content.replace(/(href=["'])(?!http|#|\/css\/)([^"']*\.css["'])/g, (match, p1, p2) => {
            updated = true;
            const quote = p1.charAt(p1.length - 1);
            return p1 + '/css/' + path.basename(p2.replace(/['"]$/, '')) + quote;
        });

        // 2. Fix JS Paths to be absolute from root
        content = content.replace(/(src=["'])(?!http|\/js\/)([^"']*\.js["'])/g, (match, p1, p2) => {
            updated = true;
            const quote = p1.charAt(p1.length - 1);
            return p1 + '/js/' + path.basename(p2.replace(/['"]$/, '')) + quote;
        });

        // 3. Ensure FRONTEND_ROOT is correctly set for scripts
        if (content.includes('window.FRONTEND_ROOT')) {
            content = content.replace(/window\.FRONTEND_ROOT\s*=\s*["'][^"']*["']/, 'window.FRONTEND_ROOT = "/"');
            content = content.replace(/window\.COMPONENT_ROOT\s*=\s*["'][^"']*["']/, 'window.COMPONENT_ROOT = "/components/"');
            updated = true;
        }

        if (updated) {
            fs.writeFileSync(filePath, content);
            console.log(`✅ Fixed paths in: ${path.relative(baseDir, filePath)}`);
        }
    }
});
