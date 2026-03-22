const fs = require('fs');
const path = require('path');

function unminify(filepath) {
    if (!filepath.endsWith('.html')) return;
    let content = fs.readFileSync(filepath, 'utf8');

    // Basic un-minification: add newlines between major tags
    // 1. Split script and style tags
    content = content.replace(/<\/script><script/g, '</script>\n<script');
    content = content.replace(/<\/style><style/g, '</style>\n<style');
    content = content.replace(/<\/head><body/g, '</head>\n<body');
    content = content.replace(/<\/body><\/html>/g, '</body>\n</html>');
    
    // 2. Expand the main script block if it's minified on one line
    // Look for <script> and matching </script> that has a lot of code
    content = content.replace(/<script>\s*(.*?)\s*<\/script>/gs, (match, code) => {
        if (code.length > 500 && !code.includes('\n')) {
            // Very basic prettify: add newlines after { } ;
            let pretty = code.replace(/([;{}])\s*/g, '$1\n    ');
            return `<script>\n    ${pretty}\n</script>`;
        }
        return match;
    });

    // 3. Fix Material Symbols Font-Family
    if (!content.includes('.material-symbols-outlined { font-family: \'Material Symbols Outlined\';')) {
        content = content.replace(
            /\.material-symbols-outlined\s*{/,
            ".material-symbols-outlined { font-family: 'Material Symbols Outlined'; "
        );
    }

    fs.writeFileSync(filepath, content);
}

function walk(dir) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else {
            unminify(fullPath);
        }
    });
}

walk(path.join(__dirname, 'frontend/public'));
console.log("Un-minification and Icon fixes complete.");
