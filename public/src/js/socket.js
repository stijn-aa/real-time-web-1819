(function () {
    var socket = io();
    console.log(document)
    document.querySelector('form').addEventListener("submit", function (e) {
        e.preventDefault();
        socket.emit('chat message', document.querySelector('#m').value);
        document.querySelector('#m').value = "";
        return false;
    });
    socket.on('chat message', function (msg) {
        console.log(msg);
        const li = document.createElement("li")
        const msgtext = document.createTextNode(msg);
        li.appendChild(msgtext);
        document.querySelector('#messages').appendChild(li);
    });
    socket.on('usercount', function (count) {
        console.log(count);
        document.querySelector('#count').innerHTML = "online: " + count;
    });
}());