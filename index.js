var express = require("express")
var path = require("path")
var app = express();
var server = require('http').createServer(app)
var io = require('socket.io')(server)

let userCount = 0

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/webhook', function (req, res) {
    // console.log('webhook request')
    console.log(req.body)
    console.log(req.body.queryResult.parameters.any)
    res.setHeader("Content-Type","application/json")
    const naam = req.body.queryResult.parameters.any
    let respons = " " 
    let responsObj = {"fulfillmentText":respons,"fulfillmentMessages": [{"text": {"text": naam}}],"source":""}
    console.log(responsObj);
    io.emit('chat message', "google home zegt: "+ naam);
    return res.json(responsObj)

});

io.on('connection', function (socket) {
    console.log('a user connected');
    io.emit('chat message', 'user connected');

    userCount ++;
    io.emit('usercount', userCount);

    socket.on('disconnect', function () {
        console.log('user disconnected');
        io.emit('chat message', 'user disconnected'); 
        userCount --;
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