(function () {
    var socket = io();

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
        if (id.length < 8) {
            socket.emit('joinRoom', id)
        } else {
            socket.emit('liked', id)
        }
    }



    socket.on('storingen', function (data) {
        clear();
        data.forEach(function (element) {
            BuildStoringen(element);
        });
        load(document.querySelectorAll(".room"));
    })

    socket.on('user', function (userData) {
        clear();
        userData.forEach(function (element) {
            BuildUsers(element);
            console.log(element)
        })

        load(document.querySelectorAll(".user"));
    })

    socket.on('match', function (user) {
        clear();
        console.log("its a match met " + user)
    })


}());

function BuildStoringen(storing) {
    const storingelement = document.createElement("div");
    storingelement.innerHTML = `
    <a href="/${storing.id}" class="room">
    <article>
    <p>type: ${storing.type}</p>
    <p>naam: ${storing.name}</p>
    <p>omschrijving: ${storing.omschrijving}</p>
    <p>verwachting: ${storing.verwachting}</p>
    </article>
    </a>
    `
    document.body.querySelector("main").appendChild(storingelement);
}

function BuildUsers(user) {
    const userelement = document.createElement("div");
    userelement.innerHTML = `
    <a href="/${user}" class="user">
    <article>
    <p>user: ${user}</p>
    </article>
    </a>
    `
    document.body.querySelector("main").appendChild(userelement);
}

function clear() {
    document.body.querySelector("main").innerHTML = ''

}