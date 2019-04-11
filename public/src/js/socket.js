(function () {
    var socket = io();
    console.log(document)

    document.querySelector('.username').addEventListener("submit", function (e) {
        e.preventDefault();
        socket.emit('set user', document.querySelector('#u').value);

        document.querySelector('.sendmsg').disabled = false;
    })

    document.querySelector('.msg').addEventListener("submit", function (e) {
        e.preventDefault();
        socket.emit('chat message', document.querySelector('#m').value);
        document.querySelector('#m').value = "";
 
    });
    socket.on('chat message', function (msg) {
        const li = document.createElement("li")
        const msgtext = document.createTextNode(msg);
        li.appendChild(msgtext);
        document.querySelector('#messages').appendChild(li);
    });
    socket.on('usercount', function (count) {
        console.log(count);
        document.querySelector('#count').innerHTML = "Online: " + count;
    });
}());

