var userDataRoom = undefined;
var room = undefined;
var inChatWith = undefined;

var socket = io();
(function () {



    socket.on('storingen', function (data) {
        clear();
        data.forEach(function (element) {
            BuildStoringen(element);
        });
        load(document.querySelectorAll(".room"));
    })

    socket.on('user', function (userData) {
        userDataRoom = userData
        clear();
        loadUsers()


        document.querySelectorAll(".user").forEach(element => {
            console.log(element)
            const slashpos = element.href.lastIndexOf("/") + 1
            const id = element.href.substring(slashpos)

            socket.emit('rematch', id)
        });
    })

    socket.on('match', function (user) {
        console.log("its a match met " + user)
        console.log(document.body.querySelector(`.user${user}`))
        BuildMatches(user)
        const button = document.body.querySelector(`.match${user}`).querySelector(`.chatButton`)

        if (!button) {
            createChatButton(user)
        }
    })

    socket.on('chat message', function (msg , user) {

        if (inChatWith === user) {
            console.log(msg)

            const li = document.createElement("li")
            const msgtext = document.createTextNode(msg);
            li.appendChild(msgtext);
            document.querySelector('#messages').appendChild(li);


            document.querySelector('section').scrollTo({
                top: document.querySelector('ul').scrollHeight,
                behavior: 'smooth'
            });
        }else if (inChatWith === "main"){

            console.log("nieuw bericht van match")

        }else{
            console.log("nieuw bericht van iemand anders")
        }
    });

    function loadUsers() {
        userDataRoom.forEach(function (element) {
            if (element !== socket.id) {
                BuildUsers(element);
                console.log(element)
            }
        })
        load(document.querySelectorAll(".user"));
    }

    function load(elements) {
        elements.forEach(a => {
            a.addEventListener("click", function (event) {
                if (a.classList.contains("user")) {
                    console.log("is users")
                    a.setAttribute('data-liked', true);
                }
                const slashpos = a.href.lastIndexOf("/") + 1
                const id = a.href.substring(slashpos)
                event.preventDefault();
                enterRoom(id)
            })
        });
    }

    function enterRoom(id) {
        if (id.length > 8 && id.length < 30) {
            socket.emit('liked', id)
        } else {
            room = id
            inChatWith = "main"
            socket.emit('joinRoom', id)
        }
    }


    function loadChat(user) {
        socket.emit('inChat', user)
        inChatWith = user
        console.log(user)

        document.querySelector('.msg').addEventListener("submit", function (e) {
            e.preventDefault();
            socket.emit('chat message', document.querySelector('#m').value, user);
            document.querySelector('#m').value = "";
        });

        document.querySelector('.back').addEventListener("click", function (e) {
            e.preventDefault();
            socket.emit('chat message', "user left chat");
            socket.emit('joinRoom', room)
        });
    }

    function createChatButton(user) {
        const chatButton = document.createElement("div");
        chatButton.innerHTML = `<button class="chatButton user${user}">Chat!</button>`
        document.body.querySelector(`.match${user}`).appendChild(chatButton);

        chatButton.addEventListener("click", function (event) {
            event.preventDefault();
            clear()
            BuildChat()
            loadChat(user)
        })
    }
}());



function BuildStoringen(storing) {
    const storingelement = document.createElement("div");
    storingelement.innerHTML = `
    <a href="/${storing.id}" class="room">
    <article>
    <p>type: ${storing.type}</p>
    <p>naam: ${storing.name}</p>

    </article>
    </a>
    `
    document.body.querySelector("main").appendChild(storingelement);
}

function BuildUsers(user) {
    const userelement = document.createElement("div");
    userelement.innerHTML = `
    <div class="user${user}">
    <a href="/${user}" class="user">
    <article>
    <p>user: ${user}</p>
    </article>
    </a>
    </div>
    `
    document.body.querySelector("main").appendChild(userelement);
}

function clear() {
    document.body.querySelector("main").innerHTML = ''

}




function BuildChat() {
    const chat = document.createElement("div");
    chat.innerHTML = `
    <button class="back">Back</button>
    <header>
    <form class="msg" action="" >
        <input id="m" autocomplete="off"/><button class="sendmsg">Send</button>
    </form>
    </header>
    <section>

        <ul id="messages"></ul>


    </section>`
    document.body.querySelector("main").appendChild(chat)

}
function BuildMatches(user) {
    const match = document.createElement("div");
    match.innerHTML = `
    <div class="match${user}">
    <article>
    <p>user: ${user}</p>
    </article>
    </div>
    `
    document.body.querySelector("footer").appendChild(match)

}