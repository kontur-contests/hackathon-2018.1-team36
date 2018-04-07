const PORT = process.env.PORT || 5000;
const FRAME_RATE = 1000.0 / 60.0;

const express = require('express');
const http = require('http');
const morgan = require('morgan');
const socketIO = require('socket.io');
const Game = require('../engine/Game');

const app = express();
const server = http.Server(app);
const io = socketIO(server);

app.set('port', PORT);
app.use(morgan('dev'));

class Player {
    constructor(socket) {
        this.socket = socket;
    }
}

class Players {
    constructor() {
        this.players = [];
    }

    sendUpdates(gameState) {
    }
}
const players = new Players();
const game = new Game();

setInterval(function() {
    game.update();
    players.sendUpdates(game.currentState());
}, FRAME_RATE);

io.on('connection', function(socket) {
    console.log('New Connection', socket.id);

    socket.emit("world", {a: "sdfsdf"});

    socket.on('new-player', function(data, callback) {
        console.log('new-player', data);
        callback('test ' +socket.id);
    });

    socket.on('disconnect', function() {
        console.log('disconnect', socket.id);
    });
});

server.listen(PORT, function () {
    console.log('Starting server on port ' + PORT);
});

