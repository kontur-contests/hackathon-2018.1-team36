var PORT = process.env.PORT || 5000;
var FRAME_RATE = 1000.0 / 60.0;

var express = require('express');
var http = require('http');
var morgan = require('morgan');
var socketIO = require('socket.io');
var Game = require('../engine/Game');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', PORT);
app.use(morgan('dev'));

var game = new Game();
setInterval(function() {
    game.update();
}, FRAME_RATE);

io.on('connection', function(socket) {
    console.log('New Connection', socket);
});

io.on('enter_tank', function(socket) {
    // tank list add player
});

io.on('right_track_forward', function(socket) {
    // console.log('New Connection', socket);
});

server.listen(PORT, function () {
    console.log('Starting server on port ' + PORT);
});

