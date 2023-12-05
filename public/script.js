const run = () => {
    let username = document.getElementById('playername').value

    let color = document.getElementById('color').value

    let canvas = document.getElementById('canvas');
    canvas.style.display = "block";

    document.getElementById('playername').style.display = "none";
    document.getElementById('color').style.display = "none";
    document.getElementById('btn').style.display = "none";
    document.getElementById('colorp').style.display = "none";
    document.getElementById('namep').style.display = "none";

    canvas.width = window.innerWidth - 30;
    canvas.height = window.innerHeight - 30;

    let ctx = canvas.getContext('2d');

    let players = {}

    class Box {
        x = 0;
        y = 0;
        width = 0;
        height = 0;
        color;

        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.width = 60;
            this.height = 60;
            this.color = color;
        }

        /**
         * @param {CanvasRenderingContext2D} ctx
         **/
        render(ctx) {
            ctx.fillStyle = this.color;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.fillText(username, this.x + 5 + username.length, this.y + this.height + 10)
        }
    }

    let box = new Box(120, 120, color);


    let websocket = new WebSocket("ws://127.0.0.1:8001");

    let once = false
    websocket.onopen = function () {
        if (!once) {
            websocket.send(
                JSON.stringify(
                    {
                        status: "join",
                        username: username,
                        data: { x: box.x, y: box.y, color: box.color }
                    }
                )
            )
            once = true;
        }
    }

    websocket.onclose = function () {
        console.log("connection closed");
    }

    websocket.onmessage = function (e) {
        console.log(e.data);
        let message = JSON.parse(e.data);


        switch (message.status) {
            case "join":
                players[message.username] = { x: message.data.x, y: message.data.y, color: message.data.color }
                break;

            case "update":
                players[message.username] = { x: message.data.x, y: message.data.y, color: message.data.color }
                break;

            case "leave":
                delete players[message.username];
                break;

            default:
                break;
        }
    }


    let speed = 10;

    function update() {
        // console.log(box.x)

        if (box.y <= 0) {
            box.y = 1;
        }

        if (box.y + box.height >= canvas.height) {
            box.y = canvas.height - box.height - 1;
        }

        if (box.x + box.width >= canvas.width) {
            box.x = canvas.width - box.width - 1;
        }
        if (box.x <= 0) {
            box.x = 1;
        }

        if (IsKeyClicked("ArrowRight")) {
            box.x += speed
        }

        if (IsKeyClicked("ArrowLeft")) {
            box.x += -speed
        }

        if (IsKeyClicked("ArrowDown")) {
            box.y += speed
        }

        if (IsKeyClicked("ArrowUp")) {
            box.y += -speed
        }

        box.render(ctx);


        if (websocket != null) {
            websocket.send(
                JSON.stringify(
                    {
                        status: "update",
                        username: username,
                        data: { x: box.x, y: box.y, color: box.color }
                    }
                )
            );
        }

        for (const player in players) {
            ctx.fillStyle = players[player].color;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillRect(players[player].x, players[player].y, players[player].width, players[player].height);
            ctx.fillText(players[player].username, players[player].x + 5 + players[player].username.length, players[player].y + players[player].height + 10)
        }
        
        window.requestAnimationFrame(update)
    }

    window.requestAnimationFrame(update)

    let keysPressed = {}

    window.addEventListener("keydown", e => {
        keysPressed[e.key] = true;
    })

    window.addEventListener("keyup", e => {
        keysPressed[e.key] = false;
    })

    function IsKeyClicked(key) {
        return !!keysPressed[key];
    }
}