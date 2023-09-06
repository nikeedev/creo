const canvas = document.getElementById('canvas');

canvas.width = window.innerWidth - 30;
canvas.height = window.innerHeight - 30;

const ctx = canvas.getContext('2d');

class Box {
    x = 0;
    y = 0;
    width = 0;
    height = 0;
    color;

    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    /**
     * @param {CanvasRenderingContext2D} ctx
     **/
    render(ctx) {
        ctx.fillStyle = this.color;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

const box = new Box(120, 120, 60, 60,  "#f1cb50");


let oldTimeStamp;
let MoveDeltaTime;


const gameLoop = (timeStamp) =>
{
    MoveDeltaTime = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    update(MoveDeltaTime);

    // The loop function has reached its end. Keep requesting new frames
    window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);

const speed = 250;

function update(ts) {

    if (box.y <= 0) {
        box.y = 1;
    }

    if (box.y + box.height >= canvas.height ) {
        box.y = canvas.height - box.height - 1;
    }

    console.log(box)
    if (box.x + box.width >= canvas.width ) {
        box.x = canvas.width - box.width - 1;
    }

    if (box.x <= 0) {
        box.x = 1;
    }

    if (IsKeyClicked("ArrowUp"))
        box.y -= speed * ts;

    if (IsKeyClicked("ArrowDown"))
        box.y += speed * ts;

    if (IsKeyClicked("ArrowLeft"))
        box.x -= speed * ts;

    if (IsKeyClicked("ArrowRight"))
        box.x += speed * ts;

    box.render(ctx);
}

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