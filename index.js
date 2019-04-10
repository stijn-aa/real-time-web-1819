var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
const {
    dialogflow,
    actionssdk,
    Image,
    Table,
    Carousel,
} = require('actions-on-google');
const reqproces = dialogflow({
    debug: true
});


let userCount = 0;
let username = nun;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});



reqproces.intent('talkToChat', (conv, params) => {
    conv.ask(`Oke and with what name?`);
});
reqproces.intent('setName', (conv, params) => {
    conv.ask(`Oke, ${params.name}?`);
    conv.ask(`And what do you want to say?`);
    username = params.name;
});
reqproces.intent('chat', (conv, params) => {
    conv.ask(`You just said: ${params.any} in the chatroom with username ${username}`);
    io.emit('chat message', username + ": "+ params.any);
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

app.post('/webhook',reqproces);

// app.post('/webhook', function (req, res) {

//     const msg = req.body.queryResult.parameters.any
//     io.emit('chat message', "google zegt " + msg);
//     console.log(req.body)
//     res.end();
// })

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
})