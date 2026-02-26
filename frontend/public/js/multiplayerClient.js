// multiplayerClient.js

class MultiplayerClient {
    constructor(gameName, onPlayerJoined, onOpponentAction, onPlayerLeft) {
        this.socket = window.io ? io({
            reconnection: true,             // 3. Auto-reconnect enabled
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000
        }) : null;

        if (!this.socket) {
            console.error("Socket.io not found! Multiplayer unavailable.");
            return;
        }

        this.gameName = gameName;
        this.roomCode = null;
        this.username = localStorage.getItem('username') || `Guest${Math.floor(Math.random() * 1000)}`;
        this.isHost = false;

        // Listeners for UI
        this.onPlayerJoined = onPlayerJoined || function () { };
        this.onOpponentAction = onOpponentAction || function () { };
        this.onPlayerLeft = onPlayerLeft || function () { };

        this.setupSocketListeners();

        // 4. Auto-rejoin if navigating from settings lobby!
        const urlParams = new URLSearchParams(window.location.search);
        const roomFromUrl = urlParams.get('room');
        const isHostFromUrl = urlParams.get('host');
        if (roomFromUrl) {
            this.roomCode = roomFromUrl;
            this.isHost = isHostFromUrl === 'true';
            this.socket.emit('join_room', { roomCode: this.roomCode, username: this.username });
        }
    }

    setupSocketListeners() {
        this.socket.on('room_created', (data) => {
            this.roomCode = data.roomCode;
            this.isHost = true;
            if (this.onRoomReady) this.onRoomReady(this.roomCode);
        });

        this.socket.on('player_joined', (data) => {
            this.onPlayerJoined(data.players);
        });

        this.socket.on('opponent_action', (data) => {
            if (data.action === 'launch_game') {
                // Instantly navigate both players synchronously
                window.location.href = `${data.payload}?room=${this.roomCode}&host=false`;
                return;
            }
            this.onOpponentAction(data);
        });

        this.socket.on('player_left', (data) => {
            this.onPlayerLeft(data);
        });

        this.socket.on('room_error', (data) => {
            alert(data.message);
        });
    }

    createRoom() {
        this.socket.emit('create_room', { username: this.username, gameName: this.gameName });
    }

    joinRoom(code) {
        this.roomCode = code.toUpperCase();
        this.socket.emit('join_room', { roomCode: this.roomCode, username: this.username });
        this.isHost = false;
    }

    sendAction(actionName, payload) {
        if (!this.roomCode) return;

        // Ensure latency compensation (assume action succeeded locally already)
        this.socket.emit('game_action', {
            roomCode: this.roomCode,
            action: actionName,
            payload: payload,
            timestamp: Date.now() // For latency tracking if needed
        });
    }

    syncGameState(stateData) {
        if (!this.roomCode) return;
        this.socket.emit('game_action', {
            roomCode: this.roomCode,
            action: 'SYNC_STATE',
            payload: stateData
        });
    }

    launchGame(gameUrl) {
        if (!this.roomCode || !this.isHost) return;

        // Navigate the opponent
        this.sendAction('launch_game', gameUrl);

        // Navigate the host
        setTimeout(() => {
            window.location.href = `${gameUrl}?room=${this.roomCode}&host=true`;
        }, 300); // Slight delay to ensure socket event sends before reload
    }
}

window.MultiplayerClient = MultiplayerClient;
