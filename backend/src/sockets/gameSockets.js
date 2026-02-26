module.exports = function (io) {
    const activeRooms = {};

    io.on('connection', (socket) => {
        console.log(`[Socket] User Connected: ${socket.id}`);

        socket.on('create_room', (data) => {
            if (!data.username) return;
            // Generate a 5-character alphanumeric room code
            const roomCode = Math.random().toString(36).substring(2, 7).toUpperCase();

            socket.join(roomCode);
            activeRooms[roomCode] = {
                players: [{ id: socket.id, username: data.username, score: 0 }],
                gameData: {}
            };

            // Send back the room code to the creator
            socket.emit('room_created', { roomCode });
            console.log(`[Socket] Room ${roomCode} created by ${data.username}`);
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
