var express = require("express")
const path = require("path")
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
        socket.broadcast.emit('user disconnected');
    });
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        socket.broadcast.emit(msg);
    });
});

io.on('connection', function (socket) {
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
})