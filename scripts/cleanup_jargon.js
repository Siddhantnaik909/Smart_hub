const fs = require('fs');
const path = require('path');

const replacements = [
    // Tic Tac Toe
    { from: "Institutional-grade tactical resolution", to: "Classic tic tac toe game" },
    { from: "Binary Conflict", to: "Tic Tac Toe" },
    { from: "Tactical Logic Grid", to: "Tic Tac Toe Board" },
    { from: "TERMINATION: ", to: "Winner: " },
    { from: "DOMINANT", to: "" },
    { from: "AUTHORITY: ", to: "Turn: " },
    { from: "Grid sync active", to: "Multiplayer connected" },
    { from: "Signal Authority", to: "Opponent Name" },
    { from: "Neural Engine Pro", to: "Pro Edition" },
    { from: "Tactical Registry", to: "Match History" },
    { from: "No recent resolutions", to: "No recent games" },
    { from: "Purge tactical logs", to: "Clear game history" },
    { from: "Relativistic redo modeling", to: "Redo move feature" },
    { from: "Sequence three identical signals", to: "Get three in a row" },
    { from: "Neural Core", to: "CPU Opponent" },
    { from: "Objective matrix", to: "Game board" },
    { from: "Achieve dominance via algorithmic precision", to: "Challenge your friends or the computer" },
    { from: "INITIALIZING TACTICAL GRID", to: "Loading board" },
    { from: "VULNERABILITY DETECTED", to: "In Check" },
    { from: "Strategic Mode", to: "Game Mode" },
    { from: "Operational Mode", to: "Game Mode" },
    { from: "Neural Engine", to: "Game Engine" },
    { from: "Recursive heuristic modeling", to: "Advanced AI strategies" },
    { from: "Deep-search AI modeling", to: "Smart AI" },
    { from: "Grandmaster-level situational awareness", to: "Expert level CPU" },
    { from: "Tactical units", to: "Chess pieces" },
    { from: "64-sectored objective matrix", to: "Chess board" },
    { from: "Total positional dominance", to: "Victory" },
    { from: "Strategic logs", to: "Game history" },
    { from: "Multiplayer Hub Active", to: "Online Room Active" },
    { from: "Binary Logic Grid", to: "Tic Tac Toe" },
    { from: "Grand Board", to: "Chess" },

    // Game Lobby
    { from: "High-octane reflexes against an AI that learns from every strike. Can you keep up with the pulse?", to: "Fast-paced arcade action. Dodge obstacles and set high scores against the computer." },
    { from: "Outsmart the quantum solver in complex spatial and mathematical puzzles.", to: "Challenge your mind with strategic board games and puzzles." },
    { from: "Command your fleets against a deep-learning adversary. Strategy over speed.", to: "Classic chess and strategic games. Think ahead to outmaneuver your opponent." },
    { from: "Can you bluff a machine that calculates probabilities in milliseconds?", to: "Play classic card games and test your luck and strategy." },
    { from: "Classic arcade mechanics enhanced by modern CPU processing power.", to: "Simple, fun, and addictive classic games everyone knows." },
    { from: "Sharp focus required for maximum efficiency.", to: "Easy to use tools for your daily tasks." }
];

const filesToUpdate = [
    'frontend/public/calculators/fun/game_tic_tac_toe.html',
    'frontend/public/calculators/fun/game_chess.html',
    'frontend/public/calculators/fun/game_connect4.html',
    'frontend/public/calculators/fun/game_car_racing.html',
    'frontend/public/calculators/fun/calc_rock_paper_scissors.html',
    'frontend/public/GameLobby.html',
    'frontend/public/index.html'
];

filesToUpdate.forEach(file => {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;

        replacements.forEach(r => {
            if (content.includes(r.from)) {
                const regex = new RegExp(r.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                content = content.replace(regex, r.to);
                modified = true;
            }
        });

        if (modified) {
            fs.writeFileSync(fullPath, content);
            console.log(`Updated: ${file}`);
        }
    } else {
        console.log(`Skipped (Not Found): ${file}`);
    }
});
