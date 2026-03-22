const fs = require('fs');
const path = require('path');

function fixFile(filepath) {
    if (!filepath.endsWith('.html')) return;
    console.log(`Fixing: ${filepath}`);
    let content = fs.readFileSync(filepath, 'utf8');

    // 1. Restore id="nav-site-logo-text" in any site logo span
    // Note: Use regex more broadly to find the span containing "Smart Hub"
    content = content.replace(
        /<span\s+class="text-xl font-bold tracking-tighter text-slate-900 text-primary uppercase">Smart Hub<\/span>/g,
        '<span id="nav-site-logo-text" class="text-xl font-bold tracking-tighter text-slate-900 text-primary uppercase">Smart Hub</span>'
    );

    // 2. Ensure script.js is loaded as module
    if (!content.includes('/js/script.js')) {
        content = content.replace('</body>', '<script type="module" src="/js/script.js"></script>\n</body>');
    } else {
        // Ensure it's type="module"
        content = content.replace(/<script src="\/js\/script.js"><\/script>/g, '<script type="module" src="/js/script.js"></script>');
    }

    // 3. Ensure calc-utils.js is loaded if it's a calculator, tool, or game
    if (filepath.includes('calc_') || filepath.includes('tool_') || filepath.includes('game_')) {
        if (!content.includes('/js/calc-utils.js')) {
            content = content.replace('</head>', '<script src="/js/calc-utils.js"></script>\n</head>');
        }

        // 4. Ensure socket.io is loaded for multiplayer games
        const multiplayerGames = ['game_tictactoe', 'game_tic_tac_toe', 'game_connect4', 'game_chess', 'game_car_racing'];
        if (multiplayerGames.some(game => filepath.includes(game)) && !content.includes('socket.io.min.js')) {
            content = content.replace('</head>', '<script src="https://cdn.socket.io/4.8.1/socket.io.min.js"></script>\n</head>');
        }
    }

    fs.writeFileSync(filepath, content);
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

// Target folders
const baseDir = path.join(__dirname, 'frontend/public');
walk(baseDir);

console.log("Global fixes complete.");
