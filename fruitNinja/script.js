
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
      new Point(this.x, this.y),
      new Point(this.x + this.width, this.y),
      new Point(this.x + this.width, this.y + this.height),
      new Point(this.x, this.y + this.height),
      new Point(this.x, this.y)
    ];
  }
  draw(ctx) {
    ctx.fillStyle = "aqua";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    this.width += 1.25/fruitVelocity;
    this.height += 1/fruitVelocity;
    this.x -= 1.25/(fruitVelocity*2);
    this.y -= 1/(fruitVelocity*2);

    this.points = this.getPoints();
    if (this.width > 120 && this.height > 100) {
      this.isFunc = false;
      lives--;
    }
  }
}

function handleSlash(p, q) {
  for (var i=0; i<melons.length; i++) {
    var intersections = 0;
    var melon = melons[i];
    for (var j=0; j<4; j++) {
      if (isIntersecting(p, q, melon.points[j], melon.points[j+1])) {
        intersections++;
      }
    }
    if (intersections >= 2) {
      console.log("slashing");
    }
  }
}
function isIntersecting(p1, q1, p2, q2) {
  o1 = orientation(p1, q1, p2);
  o2 = orientation(p1, q1, q2);
  o3 = orientation(p2, q2, p1);
  o4 = orientation(p2, q2, q1);
  if ((o1 !== o2) && (o3 !== o4))
    return true;
  if ((o1 === 0) && onSegment(p1, p2, q1))
    return true;
  if ((o3 === 0) && onSegment(p2, p1, q2))
    return true;
  if ((o4 === 0) && onSegment(p2, q1, q2))
    return true;
  return false;
}
function onSegment(p, q, r) {
  if ((q.x <= Math.max(p.x, r.x)) && (q.x >= Math.min(p.x, r.x)) && (q.y <= Math.max(p.y, r.y)) && (q.y >= Math.min(p.y, r.y))) {
    return true;
  }
  return false;
}
function orientation(p, q, r) {
  var val = ((q.y - p.y) * (r.x - q.x)) - ((q.x - p.x) * (r.y - q.y));
  if (val > 0) {
    return 1;
  } else if (val < 0) {
    return 2;
  } else {
    return 0;
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
  score = 0;
  slashed = false;
}
function startGame(event) {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  c.width = window.innerWidth - 22;
  c.height = window.innerHeight - 22;
  canvasWidth = c.width;
  canvasHeight = c.height;
  initGame();
  setInterval(function() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    var background = new Image;
    background.src = "images/background.jpg";
    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvasWidth, canvasHeight);
    ctx.stroke();

    handleSlash(new Point(0, 0), new Point(canvasWidth, canvasHeight), ctx);

    for (var i = 0; i < melons.length; i++) {
      if (!melons[i].isFunc) {
        melons.splice(i, 1);
      }
      melons[i].draw(ctx);
    }

    ctx.font = "30px Arial";
    ctx.fillStyle = "aqua";
    ctx.fillText("Lives: " + lives, canvasWidth - 200, 25);
    ctx.fillText("Score: " + score, 200, 25);
    slashed = true;

  }, 4);
}
