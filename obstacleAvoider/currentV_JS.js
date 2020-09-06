var runner;
var obstacle;
var newObsCoun;
var moveDir;
var move;
var newObsSpeed;
var runnerObsCol;
var gameBegun;
var distance;
var shieldActive;
var shieldCount;
var shieldActiveTime;
var asteroidSmashed;
var myScore;

class Runner {
    constructor() {
        this.x = 80;
        this.width = 140;
        this.height = 86;
        this.y = canvasHeight/2;
        this.isAlive = true;
        this.top = this.y;
        this.bottom = this.y + this.height;
        this.left = this.x;
        this.right = this.x + this.width;
        this.image = new Image();
        this.image.src = "images/runner.png";
    }
    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    isCollide() {
        for (var i = 0; i < obstacle.length; i++) {
            if (obstacle[i].bottom >= runner.top && obstacle[i].top <= runner.bottom && obstacle[i].left <= runner.right && obstacle[i].right >= runner.left) {
                obstacle.splice(i, 1);
                asteroidSmashed++;
                myScore += 2;
                if (!shieldActive) {
                  gameBegun = false;
                }
            }
        }
    }
    changeY() {
        if(move) {
            if (!moveDir) {
                this.y += distance;
                if (this.y > canvasHeight - this.height) {
                    this.y = canvasHeight - this.height;
                }
            } else {
                this.y -= distance;
                if (this.y < 0) {
                    this.y = 0;
                }
            }
            this.top = this.y;
            this.bottom = this.y + this.height;
        }
    }
}
class Obstacle {
    constructor(x, y, asteroid, width, height) {
        this.y = y;
        this.x = x;
        this.width = Math.random() * 100 + 10;
        this.height = this.width + Math.random() * 12 || this.width - Math.random() * 12;
        this.isAlive = true;
        this.top = this.y;
        this.bottom = this.y + this.height;
        this.left = this.x;
        this.right = this.x + this.width;
        this.image = new Image();
        this.image.src = asteroid;
    }
    draw(ctx) {
        if (gameBegun) {
            this.x -= 3;
        }
        this.left = this.x;
        this.right = this.x + this.width;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

function checkKey(e) {
    e = e || window.event;
    if (e.keyCode == '38') {
        //up
        move = true;
        moveDir = true;
        setTimeout(function stopMove() {
            move = false
        }, 300);
    }
    else if (e.keyCode == '40') {
        //down
        move = true;
        moveDir = false;
        setTimeout(function stopMove() {
            move = false
        }, 300);
    }
    if (e.keyCode == '16') {
        distance = 2.2;
    }
    if (e.keyCode == '83' && !shieldActive && shieldCount >= 2500) {
        shieldActive = true;
        shieldActiveTime = 2500;
    }
}
function normalDistance(e) {
    e = e || window.event;
    if (e.keyCode == '16') {
        distance = 1;
    }
}
function touch(event) {
    var y = event.touches[0].clientY;
    if (y > canvasHeight/2) {
        runner.y += 20;
        runner.top = runner.y;
        runner.bottom = runner.y + runner.heightl;
    }
    else {
        runner.y -= 20;
        runner.top = runner.y;
        runner.bottom = runner.y + runner.heightl;
    }
}

function reloadDraw(ctx) {
       ctx.fillStyle = "darkBlue";
       ctx.fillRect(25, canvasHeight/2 - 100, 20, 200);
       ctx.fillStyle = "lightBlue";

       if (shieldActiveTime >= 2375) {
           ctx.fillRect(25, canvasHeight/2 - 100, 20, 200);
       }
       else if (shieldActiveTime >= 2250) {
           ctx.fillRect(25, canvasHeight/2 - 100, 20, 180);
       }
       else if (shieldActiveTime >= 2000) {
           ctx.fillRect(25, canvasHeight/2 - 100, 20, 160);
       }
       else if (shieldActiveTime >= 1750) {
           ctx.fillRect(25, canvasHeight/2 - 100, 20, 140);
       }
       else if (shieldActiveTime >= 1500) {
           ctx.fillRect(25, canvasHeight/2 - 100, 20, 120);
       }
       else if (shieldActiveTime >= 1250) {
           ctx.fillRect(25, canvasHeight/2 - 100, 20, 100);
       }
       else if (shieldActiveTime >= 1000) {
           ctx.fillRect(25, canvasHeight/2 - 100, 20, 80);
       }
       else if (shieldActiveTime >= 750) {
           ctx.fillRect(25, canvasHeight/2 - 100, 20, 60);
       }
       else if (shieldActiveTime >= 500) {
           ctx.fillRect(25, canvasHeight/2 - 100, 20, 40);
       }
       else if (shieldActiveTime >= 250) {
           ctx.fillRect(25, canvasHeight/2 - 100, 20, 20);
       }
   }

function initGame() {
    runner = new Runner();
    newObsCoun = Math.random() * 100 + 60;
    obstacle = [];
    move = false;
    direction = false;
    newObsSpeed = 300;
    runnerObsCol = false;
    gameBegun = true;
    distance = 1.1;
    shieldActive = false;
    shieldCount = 2500;
    shieldActiveTime = 1;
    asteroidSmashed = 0;
    myScore = 0;
}
function startGame() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    c.width = window.innerWidth - 30;
    c.height = window.innerHeight - 30;
    canvasWidth = c.width;
    canvasHeight = c.height;
    if (canvasWidth - canvasHeight < 0) {
      ctx.fillStyle = "red";
      ctx.fillText("hold device in landscape in lanscape mode or enlargen browser window.", 100, canvasHeight/2);
      setTimeout(function wait() {
        c.width = window.innerWidth - 30;
        c.height = window.innerHeight - 30;
        canvasWidth = c.width;
        canvasHeight = c.height;
      }, 5000)
    }

    initGame();
    setInterval(function () {
        if (!gameBegun) {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            runner.draw(ctx);
            for (var i = 0; i < obstacle.length; i++) {
                obstacle[i].draw(ctx);
            }
            ctx.fillStyle = "red";
            ctx.font = "50px Arial";
            ctx.fillText("Game Over", canvasWidth/2 - 100, canvasHeight/2);
            return;
        }
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        runner.draw(ctx);
        runner.isCollide();
        runner.changeY();

        if (shieldCount >= 2500) {
            ctx.fillStyle = "blue";
            ctx.font = "35px Arial";
            ctx.fillText("Shield Ready", canvasWidth/2 - 100, 50);
        }

        for (var i = 0; i < obstacle.length; i++) {
            if (obstacle[i].x <= 0) {
                obstacle.splice(i, 1);
                myScore++;
            }
        }

        ctx.font = "30px Arial";
        ctx.fillStyle = "lightGreen";
        ctx.fillText("Asteroids Smashed = " + asteroidSmashed, 10, 50);
        ctx.fillText("Score = " + myScore, canvasWidth - 200, 50);

        if (newObsCoun <= 0) {
            var imgPicker = Math.random();
            if (imgPicker <= .3) {
                var obs = new Obstacle(canvasWidth, Math.random() * canvasHeight, "images/asteroid1.png");
            }
            else if (imgPicker >= .6) {
                var obs = new Obstacle(canvasWidth, Math.random() * canvasHeight, "images/asteroid2.png");
            }
            else {
                var obs = new Obstacle(canvasWidth, Math.random() * canvasHeight, "images/asteroid3.png");
            }
            obstacle.push(obs);
            newObsCoun = Math.random() * newObsSpeed + 50;

        }
        for (var i = 0; i < obstacle.length; i++) {
            obstacle[i].draw(ctx);
        }

        if (shieldActive) {
            reloadDraw(ctx);
            shieldActiveTime -= 1;
            runner.image.src = "images/runnerShielded.png";
            runner.width = 192;
            runner.height = 114;
            if (shieldActiveTime <= 0) {
                shieldActive = false;
                shieldCount = 0;
                runner.width = 140;
                runner.height = 86;
                runner.image.src = "images/runner.png";
            }
        }
        newObsCoun -= 2;
        shieldCount++;

        document.onkeydown = checkKey;
        document.ontouchmove = touch;
        document.onkeyup = normalDistance;
    }, 4)
}
