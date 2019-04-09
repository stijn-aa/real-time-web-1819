var express = require("express")
var path = require("path")
var app = express();
const axios = require('axios')
var server = require('http').createServer(app)
var io = require('socket.io')(server)

let userCount = 0

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

axios.post('/webhook', function (req, res) {

    const name = req.body.queryResult.parameters.any
    io.emit('chat message', "google zegt" + name);
    
})
.catch((error) => {
    console.error(error)
    io.emit('chat message', "google zegt" + error);
});


io.on('connection', function (socket) {
    console.log('a user connected');
    io.emit('chat message', 'user connected');

    userCount++;
    io.emit('usercount', userCount);

    socket.on('disconnect', function () {
        console.log('user disconnected');
        io.emit('chat message', 'user disconnected');
        userCount--;
        io.emit('usercount', userCount);
    });
    socket.on('chat message', function (msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });

});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
})