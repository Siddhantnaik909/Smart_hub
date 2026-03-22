const fs = require('fs');
const path = require('path');

const TEXT_REPLACEMENTS = {
    // Game Titles & Descriptions
    "Execute high-fidelity zero-sum game cycles via peer-to-peer synchronization and algorithmic entropy.": "Experience smooth gameplay with real-time multiplayer and smart AI challenges.",
    "Institutional-grade strategic resolution.": "Face off against the CPU or a friend in this classic game.",
    "Kinetic Nash Equilibrium": "Games",
    "Resolve Grid.": "Play Game.",
    "Strategic Matrix": "Game Board",
    "Operational Result": "Game Result",
    "Authority A": "Player 1",
    "Authority B": "Player 2",
    "Peer Node Authority": "Opponent",
    "Sync Matrix": "Game Hub",
    "Conflict Delta": "Match Result",
    "Outcome Registry": "Match History",
    "Resolution Registry": "Match History",
    "Battle Registry": "Match History",
    "NEAT Sum": "Lifestyle Burn",
    "Pulse": "Flip",
    "Entropy": "Randomness",
    "Literal": "Text",
    "Purge battle logs": "Clear history",
    "Symmetric Conflict Matrix": "Rock Paper Scissors",
};

function upgradeFile(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');
    for (const [old, newVal] of Object.entries(TEXT_REPLACEMENTS)) {
        const regex = new RegExp(old, 'g');
        content = content.replace(regex, newVal);
    }
    fs.writeFileSync(filepath, content);
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (file.endsWith('.html')) {
            upgradeFile(fullPath);
        }
    }
}

walk(path.join(__dirname, 'frontend/public/calculators/fun'));
walk(path.join(__dirname, 'frontend/public/calculators/health-fitness'));
walk(path.join(__dirname, 'frontend/public/calculators/text-web'));

const rootFiles = ['GameLobby.html', 'CreateGameLobby.html', 'JoinGameLobby.html'];
rootFiles.forEach(file => {
    const fullPath = path.join(__dirname, 'frontend/public', file);
    if (fs.existsSync(fullPath)) {
        upgradeFile(fullPath);
    }
});

console.log("Final jargon cleanup done.");
