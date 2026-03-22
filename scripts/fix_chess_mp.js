const fs = require('fs');
const path = require('path');

const chessPath = path.join(__dirname, 'frontend/public/calculators/fun/game_chess.html');
let content = fs.readFileSync(chessPath, 'utf8');

// Replace DOMContentLoaded
content = content.replace(
    'document.addEventListener(\'DOMContentLoaded\', () => { renderSidebarHistory(); initBoard(); });',
    `let mpClient = null;
    document.addEventListener('DOMContentLoaded', () => {
        renderSidebarHistory();
        initBoard();
        if (window.MultiplayerClient) {
            mpClient = new window.MultiplayerClient("Chess", (players) => {
                const opp = players.find(p => p.id !== mpClient.socket.id);
                document.getElementById('mp-lobby-container').classList.remove('hidden');
                document.getElementById('mp-active-code').textContent = 'CODE: ' + mpClient.roomCode;
                if (opp) {
                    document.getElementById('mp-opponent-name').textContent = opp.username;
                    playMode = 'online';
                    myColor = mpClient.socket.id === players[0].id ? 'white' : 'black';
                    labelWhite.textContent = players[0].username.toUpperCase();
                    labelBlack.textContent = players[1].username.toUpperCase();
                    if (myColor === 'black') { board.orientation('black'); }
                    performRestart(false);
                } else {
                    document.getElementById('mp-opponent-name').textContent = 'WAITING...';
                }
            }, (data) => {
                if (data.action === 'move') {
                    game.move({ from: data.payload.source, to: data.payload.target, promotion: 'q' });
                    board.position(game.fen());
                    updateStatus();
                } else if (data.action === 'reset') {
                    performRestart(false);
                }
            }, () => {
                alert('Peer node terminated connection.');
                location.reload();
            });
        }
    });`
);

// Replace onDrop
content = content.replace(
    'onDrop: (source, target) => { removeHighlights(); let move = game.move({ from: source, to: target, promotion: \'q\' }); if (move === null) return \'snapback\'; redoStack = []; updateStatus(); if (playMode === \'cpu\' && !game.game_over()) setTimeout(makeCPUMove, 600); },',
    `onDrop: (source, target) => { 
        removeHighlights(); 
        let move = game.move({ from: source, to: target, promotion: 'q' }); 
        if (move === null) return 'snapback'; 
        if (playMode === 'online') { mpClient.sendAction('move', { source, target }); }
        redoStack = []; 
        updateStatus(); 
        if (playMode === 'cpu' && !game.game_over()) setTimeout(makeCPUMove, 600); 
    },`
);

// Update performRestart to accept an 'emit' flag
content = content.replace(
    'function performRestart() { game.reset(); board.position(\'start\'); redoStack = []; updateStatus(); }',
    'function performRestart(emit = true) { game.reset(); board.position(\'start\'); redoStack = []; updateStatus(); if (playMode === \'online\' && emit) mpClient.sendAction(\'reset\', {}); }'
);

fs.writeFileSync(chessPath, content);
console.log('Fixed Chess MP Logic');
