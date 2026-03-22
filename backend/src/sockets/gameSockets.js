module.exports = function (io) {
    const activeRooms = {};
    const globalLeaderboard = []; // In-memory leaderboard for racing game
    const globalWinsLeaderboard = {}; // { 'tictactoe': [{username, wins}], 'connect4': [...] }

    // Expose activeRooms for REST API if needed
    io.activeRooms = activeRooms;

    io.on('connection', (socket) => {
        console.log(`[Socket] User Connected: ${socket.id}`);
        
        socket.emit('leaderboard_update', globalLeaderboard);

        socket.on('create_room', (data) => {
            const username = data.username || `Guest_${socket.id.substring(0,4)}`;
            // Generate a guaranteed 6-character alphanumeric room code to match UI length requirements
            const roomCode = Math.random().toString(36).substring(2, 8).padEnd(6, 'X').toUpperCase();

            socket.join(roomCode);
            activeRooms[roomCode] = {
                players: [{ id: socket.id, username: username, score: 0 }],
                gameData: {},
                createdAt: new Date()
            };

            // Send back the room code to the creator
            socket.emit('room_created', { roomCode });
            console.log(`[Socket] Room ${roomCode} created by ${username}`);
        });

        socket.on('join_room', (data) => {
            const { roomCode, username } = data;

            if (!roomCode || !username) return;

            const room = activeRooms[roomCode];

            if (room) {
                if (room.players.length >= 2) {
                    socket.emit('room_error', { message: 'Room is full! Only 2 players allowed.' });
                    return;
                }

                // Stop delete timeout if it exists
                if (room.deleteTimeout) {
                    clearTimeout(room.deleteTimeout);
                    room.deleteTimeout = null;
                }

                socket.join(roomCode);

                // Avoid duplicating the same username if they just navigated
                if (!room.players.find(p => p.username === username)) {
                    room.players.push({ id: socket.id, username, score: 0 });
                } else {
                    const idx = room.players.findIndex(p => p.username === username);
                    room.players[idx].id = socket.id; // Update socket ID
                }

                // Notify everyone in the room that a player joined
                io.to(roomCode).emit('player_joined', {
                    message: `${username} joined the game!`,
                    players: room.players
                });

                console.log(`[Socket] ${username} joined Room ${roomCode}`);
            } else {
                socket.emit('room_error', { message: 'Invalid Room Code!' });
            }
        });

        // Generalized game action relayer
        socket.on('game_action', (data) => {
            const { roomCode, action, payload } = data;
            if (roomCode && activeRooms[roomCode]) {
                // Broadcast to the OTHER person in the room
                socket.to(roomCode).emit('opponent_action', { action, payload });
            }
        });

        // Global Leaderboard Events
        socket.on('submit_score', (data) => {
            const { username, score, vehicle } = data;
            if (!username || typeof score !== 'number') return;

            // Check if user already exists and update their highest score
            const existingIdx = globalLeaderboard.findIndex(entry => entry.username === username);
            if (existingIdx !== -1) {
                if (score > globalLeaderboard[existingIdx].score) {
                    globalLeaderboard[existingIdx] = { username, score, vehicle };
                }
            } else {
                globalLeaderboard.push({ username, score, vehicle });
            }
            
            globalLeaderboard.sort((a, b) => b.score - a.score);
            if (globalLeaderboard.length > 8) globalLeaderboard.pop(); // Keep top 8
            
            io.emit('leaderboard_update', globalLeaderboard);
        });

        // Global Wins Leaderboard (Tic Tac Toe, Connect 4, etc.)
        socket.on('submit_win', (data) => {
            const { username, gameType } = data; // gameType e.g., 'tictactoe' or 'connect4'
            if (!username || !gameType) return;

            if (!globalWinsLeaderboard[gameType]) {
                globalWinsLeaderboard[gameType] = [];
            }
            
            let gameBoard = globalWinsLeaderboard[gameType];
            const existingIdx = gameBoard.findIndex(entry => entry.username === username);
            
            if (existingIdx !== -1) {
                gameBoard[existingIdx].wins += 1;
            } else {
                gameBoard.push({ username, wins: 1 });
            }
            
            gameBoard.sort((a, b) => b.wins - a.wins);
            if (gameBoard.length > 10) gameBoard.pop(); // Keep top 10

            io.emit(`${gameType}_leaderboard_update`, gameBoard);
        });

        socket.on('disconnect', () => {
            console.log(`[Socket] User Disconnected: ${socket.id}`);
            // Check if player is in any room and handle disconnect
            for (const roomCode in activeRooms) {
                const roomElement = activeRooms[roomCode];
                const playerIndex = roomElement.players.findIndex(p => p.id === socket.id);

                if (playerIndex !== -1) {
                    const disconnectedPlayer = roomElement.players[playerIndex].username;
                    roomElement.players.splice(playerIndex, 1);

                    if (roomElement.players.length === 0) {
                        roomElement.deleteTimeout = setTimeout(() => {
                            if (activeRooms[roomCode] && activeRooms[roomCode].players.length === 0) {
                                delete activeRooms[roomCode]; // Cleanup empty rooms
                                console.log(`[Socket] Room ${roomCode} deleted`);
                            }
                        }, 15000); // 15 seconds allowance for page navigation
                    } else {
                        io.to(roomCode).emit('player_left', { message: `${disconnectedPlayer} left the game.` });
                    }
                    break;
                }
            }
        });
    });
};
