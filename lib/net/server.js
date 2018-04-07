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
        {name: 'join-tank', from: 'idle', to: 'in-tank'}
    ],
    data: function (socket) {
        return {
            tank: null,
            score: 0,
            socket: socket
        }
    },
    methods: {
        serialize: function () {
            return {
                id: this.socket.id,
                score: this.score,
                state: this.state
            };
        },
        onJoinTank: function ({transition, from, to}, tank) {
            console.log('I joined', tank);
        }
    }
});

class Players {
    constructor() {
        this.players = new HashMap();
    }

    sendUpdates(game) {
    }

    disconnect(socket) {
        this.players.delete(socket.id);
    }

    connect(socket) {
        if (!this.players.has(socket.id)) {
            this.players.set(socket.id, new Player(socket));
        }
    }

    getPlayers() {
        let result = [];
        this.players.forEach(function(value, key) {
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
    players.connect(socket);
    io.sockets.emit('players', players.getPlayers());

    socket.on('create-tank', function (data, callback) {
        console.log('create-tank', socket.id, data);
        //io.sockets.emit('tanks', {});
        //callback('test ' +socket.id);
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

