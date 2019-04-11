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
let username = undefined;
let chatcount = 0;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


reqproces.intent('talkToChat', (conv, params) => {
    if (username === undefined) {
        conv.ask(`Oke and with what name?`);
    } else {
        conv.ask(`And what do you want to say,${username}?`);
    }
});
reqproces.intent('setName', (conv, params) => {

    username = params.any;
    conv.ask(`Oke, ${params.any}?`);
    conv.ask(` And what do you want to say?`);

});
reqproces.intent('chat', (conv, params) => {
    conv.ask(`You just said: "${params.any}" in the chatroom with username ${username}`);
    io.emit('chat message', username + ": " + params.any);
});

reqproces.intent('changeColor', (conv, params) => {
    conv.ask(`You just changed the color to: "${params.color}"`);
    io.emit('change color', params.color);
});


reqproces.fallback((conv) => {
    conv.ask(`I couldn't understand. You can change your name or say something in the chat with this app`);
});

reqproces.catch((conv, error) => {
    console.error(error);
    conv.ask('I encountered a glitch. Can you say that again?');
});


io.on('connection', function (socket) {
    socket.timestamp = new Date();

    io.emit('chat message', 'On ' + socket.timestamp + ' a user connected');
    userCount++;
    io.emit('usercount', userCount);


    socket.on('disconnect', function () {
        console.log('user disconnected');
        io.emit('chat message', 'user: "' + socket.username + '" had died');
        userCount--;
        io.emit('usercount', userCount);
    });

    socket.on('chat message', function (msg) {

       const age = " (Age "+ getAge(socket.timestamp) +") "

        console.log('message: ' + msg);
        io.emit('chat message', socket.username + age + ": " + msg);
    });

    socket.on('set user', function (name) {

        if (socket.username === undefined) {
            io.emit('chat message', 'A new user has changed his name to "' + name + '"');
        } else if (name === socket.username) {
            io.emit('chat message', 'User "' + socket.username + '" tried to change his name but failed');
        } else {
            io.emit('chat message', 'User "' + socket.username + '" changed his name to "' + name + '"');
        }
        socket.username = name;
    });

});

function getAge(timestamp) {
    let currentDate = new Date
    let millisec = currentDate.getTime() - timestamp.getTime()
    
    let seconds = (millisec / 1000).toFixed(0);
    let minutes = Math.floor(seconds / 60);
    let hours = "";
    if (minutes > 59) {
        hours = Math.floor(minutes / 60);
        hours = (hours >= 10) ? hours : "0" + hours;
        minutes = minutes - (hours * 60);
        minutes = (minutes >= 10) ? minutes : "0" + minutes;
    }

    seconds = Math.floor(seconds % 60);
    seconds = (seconds >= 10) ? seconds : "0" + seconds;
    if (hours != "") {
        return hours + ":" + minutes + ":" + seconds;
    }
    return minutes + ":" + seconds;
}



app.post('/webhook', reqproces);



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
})