//Global variables
var melons;
var fruitVelocity;
var lives;
var score;
var slashed;

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Melon {
    constructor() {
        this.x = Math.random() * (canvasWidth - 125);
        this.y = Math.random() * (canvasHeight - 100);
        this.width = 87.5;
        this.height = 70;
        this.speed = fruitVelocity;
        this.points = this.getPoints();
        this.isFunc = true;
        this.image = new Image();
        this.image.src = "images/melon.png";
    }
    getPoints() {
        return [
            [this.x, this.y],
            [this.x + this.width, this.y],
            [this.x + this.width, this.y + this.height],
            [this.x, this.y + this.height],
            [this.x, this.y]
        ];
    }
    draw(ctx) {
        ctx.fillStyle = "aqua";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        this.width += 1.25/fruitVelocity;
        this.height += 1/fruitVelocity;
        this.x -= (1.25/fruitVelocity)/2;
        this.y -= (1/fruitVelocity)/2;

        this.points = this.getPoints();
        if (this.width > 120 && this.height > 100) {
            //this.isFunc = false;
            //lives--;
        }
    }
}

function handleSlash(startX, startY, endX, endY, ctx) {
    var startCoordinates = [startX, startY];
    var endCoordinates = [endX, endY];
    var slashEquation = getLineEquation(startCoordinates, endCoordinates);
    for (var i = 0; i < melons.length; i++) {
        var melon = melons[i];
        var numInter = 0;
        for (var j = 0; j < 4; j++) {
            var fruitEquation = getLineEquation(melon.points[j], melon.points[j+1]);
            var intPoint = getIntersection(fruitEquation, slashEquation);
            ctx.fillStyle = "orange";
            ctx.fillRect(intPoint[0], intPoint[1], 1, 1);
            var pointX = intPoint[0];
            var pointY = intPoint[1];
            if (
                (pointX >= melon.points[j][0] &&
                pointX <= melon.points[j+1][0] &&
                pointY >= melon.points[j][1] &&
                pointY <= melon.points[j+1][1]) ||
                (pointX <= melon.points[j][0] &&
                pointX >= melon.points[j+1][0] &&
                pointY <= melon.points[j][1] &&
                pointY >= melon.points[j+1][1])
            ) {
                numInter++;
                console.log(numInter);
            }
        }
        if (numInter >= 2) {
            melon.isFunc = false;
            score++;
        }
    }
}
function getLineEquation(p1, p2) {
    var m = (p2[1] - p1[0])/(p2[0] - p1[0]);
    return [m, p1[1] - m*p1[0]];
}
function getIntersection(eq1, eq2) {
    return [(eq1[1] - eq2[1])/(eq2[0]-eq1[0]), ((eq1[1]*eq2[0]) - (eq2[1]*eq1[0]))/(eq2[0] - eq1[0])];
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
    score = 0;
    slashed = false;
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
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(canvasWidth, canvasHeight);
        ctx.stroke();

        handleSlash(0, 0, canvasWidth, canvasHeight, ctx);

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
