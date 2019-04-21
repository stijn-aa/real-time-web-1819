(function () {
    var socket = io();
    console.log(document)

    function load(elements) {
        elements.forEach(a => {
            a.addEventListener("click", function (event) {
                const slashpos = a.href.lastIndexOf("/") + 1
                const id = a.href.substring(slashpos)
                event.preventDefault();
                enterRoom(id)
            })
        });
    }

    function enterRoom(id) {
        // if (0 === 0) {
            socket.emit('room', id)
        // } else if (0 === 0) {
        //     socket.emit('match', id)
        // }
    }



    socket.on('storingen', function (data) {
        clear();
        data.forEach(function (element) {
            BuildStoringen(element);
            console.log(element)
        });
        load(document.querySelectorAll(".room"));
    })

    socket.on('users', function (users) {
        clear();
        // users.forEach(function (element) {
        //     BuildUsers(element);
        // })
        console.log(users)
        // load(document.querySelectorAll(".user"));
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