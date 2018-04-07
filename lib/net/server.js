const config = require('../engine/config');

const PORT = process.env.PORT || 5000;
const FRAME_RATE = config.FRAME_RATE;

const express = require('express');
const http = require('http');
const morgan = require('morgan');
const socketIO = require('socket.io');
const Game = require('../engine/Game');
const HashMap = require('hashmap');
const StateMachine = require('javascript-state-machine');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.set('port', PORT);
app.use(morgan('dev'));

app.use(express.static('lib/front'));

const Player = StateMachine.factory({
    init: 'idle',
    transitions: [
        {name: 'join-turret', from: 'idle', to: 'in-turret'},
        {name: 'join-left-track', from: 'idle', to: 'in-left-track'},
        {name: 'join-right-track', from: 'idle', to: 'in-right-track'},
        {name: 'join-gun', from: 'idle', to: 'in-gun'},
        {name: 'leave-tank', from: '*', to: 'idle'}
    ],
    data: function (socket) {
        return {
            tank: null,
            score: 0,
            socket: socket,
        }
    },
    methods: {
        serialize: function () {
            return {
                id: this.socket.id,
                score: this.score,
                state: this.state,
                tankId: this.tank ? this.tank.id : null
            };
        },
        onBeforeJoinTurret: function (state, tank) {
            return !!(tank && tank.isTurretEmpty());
        },
        onBeforeJoinLeftTrack: function (state, tank) {
            return !!(tank && tank.isLeftTrackEmpty());
        },
        onBeforeJoinRightTrack: function (state, tank) {
            return !!(tank && tank.isRightTrackEmpty());
        },
        onBeforeJoinGun: function (state, tank) {
            return !!(tank && tank.isGunEmpty());
        },
        onJoinTurret: function ({transition, from, to}, tank) {
            this.tank = tank;
            tank.joinTurret(this);
        },
        onJoinLeftTrack(state, tank) {
            this.tank = tank;
            tank.joinLeftTrack(this);
        },
        onJoinRightTrack(state, tank) {
            this.tank = tank;
            tank.joinRightTrack(this);
        },
        onJoinGun(state, tank) {
            this.tank = tank;
            tank.joinGun(this);
        },
        onLeaveTank: function (state) {
            if (this.tank) {
                this.score += this.tank.getFrags();
                this.tank = null;
            }
        },
        pushUpButton: function () {
            switch (this.state) {
                case 'in-gun':
                    this.tank.setFire(1); // нажать гашетку
                    break;
                case 'in-turret':
                    this.tank.setTurretMoving(-1); // left
                    break;
                case 'in-left-track':
                    this.tank.setLeftTrackMoving(1); // forward
                    break;
                case 'in-right-track':
                    this.tank.setRightTrackMoving(1); // forward
                    break;
            }
        },
        pushDownButton: function () {
            switch (this.state) {
                case 'in-gun':
                    this.tank.setFire(1); // нажать гашетку
                    break;
                case 'in-turret':
                    this.tank.setTurretMoving(1); // right
                    break;
                case 'in-left-track':
                    this.tank.setLeftTrackMoving(-1); // back
                    break;
                case 'in-right-track':
                    this.tank.setRightTrackMoving(-1); // back
                    break;
            }
        },
        releaseButton: function () {
            switch (this.state) {
                case 'in-gun':
                    this.tank.setFire(0); // отпустить гашетку
                    break;
                case 'in-turret':
                    this.tank.setTurretMoving(0); // stop
                    break;
                case 'in-left-track':
                    this.tank.setLeftTrackMoving(0); // stop
                    break;
                case 'in-right-track':
                    this.tank.setRightTrackMoving(0); // stop
                    break;
            }
        }
    }
});

class Players {
    constructor() {
        this.players = new HashMap();
    }

    sendUpdates(game) {
        this.players.forEach(function (player, key) {
            const socket = player.socket;
            socket.emit('game-state', {
                player: player.serialize(),
                game: game.currentState()
            });
        });
    }

    disconnect(socket) {
        if (this.players.has(socket.id)) {
            const player = this.players.get(socket.id);
            player.releaseButton();
        }
        this.players.delete(socket.id);
    }

    connect(socket) {
        if (!this.players.has(socket.id)) {
            this.players.set(socket.id, new Player(socket));
        }
        return this.players.get(socket.id);
    }

    getPlayers() {
        let result = [];
        this.players.forEach(function (value, key) {
            result.push(value.serialize());
        });
        return result;
    }
}

const players = new Players();
const game = new Game();

setInterval(function () {
    game.update(FRAME_RATE);
    players.sendUpdates(game);
}, FRAME_RATE);

io.on('connection', function (socket) {
    console.log('New Connection', socket.id);
    const player = players.connect(socket);
    io.sockets.emit('players', players.getPlayers());

    socket.on('create-tank', function (data, callback) {
        const tankId = game.createTank();
        console.log("created", tankId);
    });

    socket.on('join-tank', function (data, callback) {
        const {position, tankId} = data;
        const tank = game.getTank(tankId);

        if (player.can(position, tank)) {
            switch (position) {
                case 'join-turret':
                    player.joinTurret(tank);
                    break;
                case 'join-left-track':
                    player.joinLeftTrack(tank);
                    break;
                case 'join-right-track':
                    player.joinRightTrack(tank);
                    break;
                case 'join-gun':
                    player.joinGun(tank);
                    break;
            }
        }
    });

    socket.on('push-button', function (data, callback) {
        switch (data) {
            case 'up':
                player.pushUpButton();
                break;
            case 'down':
                player.pushDownButton();
                break;
        }

    });

    socket.on('release-button', function (data, callback) {
        player.releaseButton();
    });

    socket.on('disconnect', function () {
        console.log('disconnect', socket.id);
        players.disconnect(socket);
        io.sockets.emit('players', players.getPlayers());
    });
});

server.listen(PORT, function () {
    console.log('Starting server on port ' + PORT);
});
