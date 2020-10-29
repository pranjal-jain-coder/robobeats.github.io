//Global variables
var mouseX;
var mouseY;
var melons;


class Melon {
    constructor() {
        this.x = Math.random() * (canvasWidth - 110);
        this.y = Math.random() * (canvasHeight - 85);
        this.width = 80;
        this.height = 60;
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;
        this.image = new Image();
        this.image.src = "images/melon.png";
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

document.onmousemove = function(event) {
    mouseClicked = true;
    mouseX = event.screenX;
    mouseY = event.screenY;
}

function initGame() {
    var firstMelon = new Melon();
    melons = [firstMelon];
}
function startGame(event) {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    c.width = window.innerWidth - 22;
    c.height = window.innerHeight- 22;
    canvasWidth = c.width;
    canvasHeight = c.height;
    initGame();
    setInterval(function () {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        var background = new Image;
        background.src = "images/background.jpg";
        ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

        for (var i = 0; i < melons.length; i++) {
            melons[i].draw(ctx);
        }

    }, 4)
}
