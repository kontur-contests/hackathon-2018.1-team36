var PORT = process.env.PORT || 5000;
var FRAME_RATE = 1000.0 / 60.0;

var express = require('express');
var http = require('http');
var morgan = require('morgan');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var logger = morgan('combined');

app.set('port', PORT);
app.use(morgan('dev'));

// setInterval(function() {
//     game.update();
//     game.sendState();
// }, FRAME_RATE);

io.on('connection', function(socket) {
    console.log('New Connection', socket);
});

server.listen(PORT, function () {
    console.log('Starting server on port ' + PORT);
});
