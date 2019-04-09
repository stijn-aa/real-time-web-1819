var express = require("express")
var path = require("path")
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io')(server)


app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    io.emit('chat message', 'user connected');
    
    socket.on('disconnect', function () {
        console.log('user disconnected');
        io.emit('chat message', 'user disconnected');
        
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