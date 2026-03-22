const fs = require('fs');
const path = require('path');

const TEXT_REPLACEMENTS = {
    // Game Titles & Descriptions
    "Symmetric Conflict Matrix": "Rock Paper Scissors",
    "Kinetic Nash Equilibrium": "Games",
    "Resolve Grid.": "Play Game.",
    "Institutional-grade strategic resolution.": "Face off against the CPU or a friend in this classic game.",
    "Arena Sync Active": "Lobby Connected",
    "Opponent Signal": "Opponent Status",
    "CONFLICT ZONE": "PLAY AREA",
    "NEUTRALITY": "READY",
    "Local Node": "You",
    "CPU logic": "CPU Player",
    "Select Input Activity": "Make Your Move",
    "Analytics Matrix": "Match Stats",
    "Stalemate": "Draw",
    "Conflict Delta": "Match Result",
    "Titan Pro": "Go Premium",
    "Battle Registry": "Match History",
    "Purge battle logs": "Clear history",
    "Executed:": "Played:",
    "EQUILLIBRIUM": "DRAW",
    "DOMINANCE": "WON",
    "SUBJUGATION": "LOST",
    "Conflict Zone": "Play Area",
    // More General
    "Solo Challenge": "Solo Mode",
    "Master the Machine": "Play against AI",
    "Neural Combat": "Action Games",
    "Logic Grids": "Puzzle Games",
    "Grand Tactician": "Strategy Games",
    "Outcome Registry": "Match History",
    "Resolution Registry": "Match History",
    "Strategic Matrix": "Game Board",
    "Operational Result": "Game Result",
    "Grand Strategic Resolution": "Play Chess",
    "Grand Matrix": "Chess Game",
    "Authority A": "Player 1",
    "Authority B": "Player 2",
    "Peer Node Authority": "Opponent",
    "Sync Matrix": "Game Hub",
    "Binary Randomizer": "Coin Flipper",
    "Decision": "Flip a Coin",
    "Pulse": "Flip",
    "Entropy Batch Size": "Number of Flips",
    "Command Toss": "Flip Now",
    "COMMIT DECISION RECORD": "SAVE RESULT",
    "Entropy Pro": "Pro Version",
    "Metrics Hub": "Word Counter",
    "Lexical Density Checkr": "Word Counter Pro",
    "Lexical Density Checker": "Word Counter Pro",
    "Lexical Checkr": "Word Counter",
    "Quantification": "Count",
    "Spatial Span": "Characters",
    "Core Density": "Letters",
    "Sentence Count": "Sentences",
    "Para Volume": "Paragraphs",
    "Temporal Drain": "Reading Time",
    "Literal Sequence": "Text Input",
    "Literal input void": "Input is empty",
};

const NAVBAR_TEMPLATE = `    <nav class="fixed top-0 w-full z-50 bg-slate-50/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0px_20px_40px_rgba(139,92,246,0.06)] h-20 flex items-center px-12 tracking-tight">
        <div class="max-w-[1440px] mx-auto w-full flex justify-between items-center">
            <div class="flex items-center gap-8">
                <span class="text-xl font-bold tracking-tighter text-slate-900 text-primary uppercase">Smart Hub</span>
                <div class="hidden md:flex items-center gap-6">
                    <a class="text-slate-500 hover:text-slate-900 transition-colors" href="/index.html">Home</a>
                    <a class="text-slate-500 hover:text-slate-900 transition-colors" href="/calculators.html">Tools</a>
                    <a class="text-primary font-semibold border-b-2 border-primary pb-1" href="/GameLobby.html">Games</a>
                    <a class="text-slate-500 hover:text-slate-900 transition-colors" href="/history.html">History</a>
                    <a class="text-slate-500 hover:text-slate-900 transition-colors" href="/about.html">About</a>
                </div>
            </div>
            <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200 overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=User&background=random" alt="Profile"/>
            </div>
        </div>
    </nav>`;

const FOOTER_TEMPLATE = `    <footer class="w-full py-12 border-t border-slate-200/50 bg-slate-100 text-sm font-['Plus_Jakarta_Sans']">
        <div class="max-w-[1440px] mx-auto px-12 flex justify-between items-center">
            <span class="text-slate-400 font-bold uppercase tracking-widest text-[10px]">© 2026 Smart Hub | Helping you work smarter</span>
            <div class="flex gap-8 text-slate-400 font-bold text-[9px] uppercase tracking-widest">
                <a class="hover:text-primary transition-colors" href="/history.html">History</a>
                <a class="hover:text-primary transition-colors" href="/about.html">About</a>
                <a class="hover:text-primary transition-colors" href="/privacy.html">Privacy</a>
            </div>
        </div>
    </footer>`;

function upgradeFile(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');

    // Fix DOMContentLoaded if it was broken
    content = content.replace(/DOMContentBurned/g, "DOMContentLoaded");

    // Replace Navbar
    content = content.replace(/<(nav|header)[\s\S]*?<\/\1>/, NAVBAR_TEMPLATE);
    
    // Replace Footer
    content = content.replace(/<footer[\s\S]*?<\/footer>/, FOOTER_TEMPLATE);

    // Text Replacements
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

// 1. Upgrade Game Files
walk(path.join(__dirname, 'frontend/public/calculators/fun'));

// 2. Upgrade specific root files
const rootFiles = ['GameLobby.html', 'CreateGameLobby.html', 'JoinGameLobby.html'];
rootFiles.forEach(file => {
    const fullPath = path.join(__dirname, 'frontend/public', file);
    if (fs.existsSync(fullPath)) {
        upgradeFile(fullPath);
    }
});

console.log("Extensive jargon removal complete.");
