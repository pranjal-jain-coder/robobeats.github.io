let drumSet;
let crashSound;
let floorTomSound;
let rideSound;

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}
class Drums {
    constructor(x, y, image) {
        this.x = x;
        this.y = y;
        this.image = new Image();
        this.image.src = "./images/" + image + ".png";
        this.type = image;
    }
    draw(ctx) {
        this.width = this.image.width;
        this.height = this.image.height;
        this.right = this.x + this.width;
        this.bottom = this.y + this.height;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

document.body.onmousedown = function() {
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    for (var i = 0; i < drumSet.length; i++) {
        if (drumSet[i].x <= mouseX && drumSet[i].right >= mouseX && drumSet[i].y <= mouseY && drumSet[i].bottom >= mouseY) {
            if (drumSet[i].type === "ride") {
                rideSound.play();
            }
            if (drumSet[i].type === "crash") {
                crashSound.play();
            }
            if (drumSet[i].type === "floorTom") {
                floorTomSound.play();
            }
        }
    }
}

function initGame() {
    drumSet = [new Drums(300, 160, "crash"),
    new Drums(760, 130, "ride"),
    new Drums(750, 300, "floorTom")]
    crashSound = new sound("./Sounds/crash.mov");
    floorTomSound = new sound("./Sounds/floorTom.mov");
    rideSound = new sound("./Sounds/ride.mov");
}
function startGame() {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    c.width = window.innerWidth - 30;
    c.height = window.innerHeight - 30;
    canvasWidth = c.width;
    canvasHeight = c.height;
    initGame();
    setInterval( function () {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        for (let i = 0; i < drumSet.length; i++) {
            drumSet[i].draw(ctx);
        }
    }, 1);
}
