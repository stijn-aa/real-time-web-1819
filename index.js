var express = require("express");
var path = require("path");
var bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var fetch = require('node-fetch');



app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});


io.on('connect', function (socket) {
	socket.join('storingen')
	console.log(socket.id + "user connected")
	api.request();

	socket.on('joinRoom', function (room) {
		socket.leave("storingen")
		socket.join(room);

		const roomExist = userData.find((x) => {

			return x.room === room;
		});

		if (roomExist === undefined) {
			var newRoom = {
				room,
				users: [socket.id]
			}
			userData.push(newRoom)

		} else {
			roomExist.users.push(socket.id)
		}
		console.log('this is userdata', userData)

		io.to(room).emit('user', userData.find((x) => {

			return x.room === room;
		}).users)

	})

	socket.on('liked', function (id) {
		match = matchData.trymatch(socket.id, id)
		console.log(match)
		if (match === true) {
			io.to(id).emit('match', socket.id)
			io.to(socket.id).emit('match', id)
		}
	});



	socket.on('disconnect', function () {
		console.log('user disconnected');
	});
});

const matchData = {
	trymatch: function (socketid, id) {
		const match = this.matchSet.find((x) => {

			return x.match === id + socketid || x.match === socketid + id
		});

		if (match === undefined) {
			var newMatch = {
				match: id + socketid
			}
			this.matchSet.push(newMatch)
			console.log(this.matchSet)
		} else {

			console.log("its a match")
			return true;
		}




	},
	matchSet: [{

	}]
}

const storage = {

	endpoint: 'https://gateway.apiportal.ns.nl/public-reisinformatie/api/v2/disruptions?type=storing&lang=nl',
	apiKey: '6ebfb863de5a407e8d696d99a0275fea'

}
var userData = [{
		room: 'alpha',
		users: []
	},
	{
		room: 'beta',
		users: []
	}
]


const api = {
	url: '',
	request: function () {

		fetch(storage.endpoint, {
				method: 'GET',
				headers: {
					'Ocp-Apim-Subscription-Key': storage.apiKey
				},
			})
			.then(res => res.json()) // expecting a json response
			.then(json => proces.storingen(json))
			.catch(err => console.error(err));
	}
}

const proces = {
	storingen: function (data) {
		let array = [{
			id: 10,
			type: 'test',
			name: 'heino-zwolle',
			omschrijving: "wisselstoring",
			verwachting: 'over 10 min klaar'
		}, {
			id: 20,
			type: 'test2',
			name: 'zwolle',
			omschrijving: "wisselsasdtoring",
			verwachting: 'over 10 min klaar'
		}]
		let newArray = []

		data.payload.forEach(function (element) {
			const storing = {}
			storing.id = element.id
			storing.type = element.type
			storing.name = element.titel
			storing.omschrijving = element.verstoring.oorzaak
			storing.verwachting = element.verstoring.verwachting
			newArray.push(storing);
		});

		if (newArray.length === 0) {


			io.to("storingen").emit('storingen', array);

		} else if (newArray !== array) {
			array = newArray

			io.to("storingen").emit('storingen', array);
		} else {
			console.log("zelfde")
		}
	}
}



var init = {
	setup: function () {
		api.request();
		this.reloadTimer()
	},
	intervalSetup: null,
	reloadTimer: function () {
		this.intervalSetup = setInterval(function () {
			api.request();
			console.log("reload")
		}, 30000)
	}
}

init.setup();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Our app is running on port ${ PORT }`);
})