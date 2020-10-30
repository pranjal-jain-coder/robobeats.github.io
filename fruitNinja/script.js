//Global variables
var melons;
var fruitVelocity;
var lives;
var score;

class Melon {
    constructor() {
        this.x = Math.random() * (canvasWidth - 125);
        this.y = Math.random() * (canvasHeight - 100);
        this.width = 87.5;
        this.height = 70;
        this.speed = fruitVelocity;
        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;
        this.isFunc = true;
        this.image = new Image();
        this.image.src = "images/melon.png";
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.width += 1.25/fruitVelocity;
        this.height += 1/fruitVelocity;
        this.x -= (1.25/fruitVelocity)/2;
        this.y -= (1/fruitVelocity)/2;

        this.left = this.x;
        this.right = this.x + this.width;
        this.top = this.y;
        this.bottom = this.y + this.height;
        if (this.width > 120 && this.height > 100) {
            //this.isFunc = false;
            //lives--;
        }
    }
}

function initGame() {
    melons = [];
    var firstMelon = new Melon();
    melons.push(firstMelon);
    fruitVelocity = 30;
    lives = 3;
    startX = 0;
    startY = 0;
    endX = canvasWidth;
    endY = canvasHeight;
    slashed = true;
    score = 0;
}

function handleSlash(startX, startY, endX, endY) {
    for (var i = 0; i < melons.length; i++) {
        if (startX <= melons[i].left && endX >= melons[i].right && startY <= melons[i].top && endY >= melons[i].bottom) {
            console.log("melon eliminated");
            melons.splice(i, 1);
            score++;
        }
    }
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
            if (!melons[i].isFunc) {
                melons.splice(i, 1);
            }
            melons[i].draw(ctx);
        }

        ctx.font = "30px Arial";
        ctx.fillStyle = "aqua";
        ctx.fillText("Lives: " + lives, canvasWidth -200, 25);
        ctx.fillText("Score: " + score, 200, 25);
        slashed = true;

    }, 4);
}
