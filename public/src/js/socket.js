(function () {
    var socket = io();
    console.log(document)

    document.querySelector('.username').addEventListener("submit", function (e) {
        e.preventDefault();
        socket.emit('set user', document.querySelector('#u').value);

        document.querySelector('.sendmsg').disabled = false;
        document.querySelector('#m').disabled = false;

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

        if (document.querySelector('#messages').childElementCount > 10) {
            document.querySelector('#messages').removeChild(document.querySelector('#messages').firstChild)
        }

    });
    socket.on('usercount', function (count) {
        console.log(count);
        document.querySelector('#count').innerHTML = "Online: " + count;
    });

    socket.on('change color', function (color) {
        console.log(color);

        document.querySelector("main").style.backgroundColor = RGBAToHexA(color);
    });

}());

function RGBAToHexA(color) {
    d = document.createElement("div");
    d.style.color = color;
    document.body.appendChild(d)
    //Color in RGB 
    rgb = window.getComputedStyle(d).color


    // Choose correct separator
    let sep = rgb.indexOf(",") > -1 ? "," : " ";
    // Turn "rgb(r,g,b)" into [r,g,b]
    rgb = rgb.substr(4).split(")")[0].split(sep);

    let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16),
        a = Math.round(0.3 * 255).toString(16);



    if (r.length == 1)
        r = "0" + r;
    if (g.length == 1)
        g = "0" + g;
    if (b.length == 1)
        b = "0" + b;
    if (a.length == 1)
        a = "0" + a;

    return "#" + r + g + b + a;
}