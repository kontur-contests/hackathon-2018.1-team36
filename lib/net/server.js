const PORT = process.env.PORT || 5000;
const FRAME_RATE = 1000.0 / 60.0;

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

const Player = StateMachine.factory({
    init: 'idle',
    transitions: [
        {name: 'join-turret', from: 'idle', to: 'in-turret'}
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
                tank: this.tank
            };
        },
        onBeforeJoinTurret: function (state, tank) {
            //return tank && tank.isTurretEmpty();
            return true;
        },
        onJoinTurret: function ({transition, from, to}, tank) {
            this.tank = tank;
            //tank.joinTurret(this);
            console.log(this.socket.id + ' joined tank ' + tank);
        },
        pushUpButton: function () {
        },
        pushDownButton: function () {
        },
        releaseButton: function () {
        }
    }
});

class Players {
    constructor() {
        this.players = new HashMap();
    }

    sendUpdates(game) {
        this.players.forEach(function (player, key) {
        });
    }

    disconnect(socket) {
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
    game.update();
    players.sendUpdates(game);
}, FRAME_RATE);

io.on('connection', function (socket) {
    console.log('New Connection', socket.id);
    const player = players.connect(socket);
    io.sockets.emit('players', players.getPlayers());

    socket.on('create-tank', function (data, callback) {
        console.log('create-tank', socket.id, data);
        //game.createTank();
        //io.sockets.emit('tanks', {});
        //callback('test ' +socket.id);
    });

    socket.on('join-tank', function (data, callback) {
        const {position, tankId} = data;
        const tank = null;//game.getTank(tankId);

        if (player.can(position, tank)) {
            switch (position) {
                case 'join-turret':
                    player.joinTurret(tank);
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

