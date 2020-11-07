const canvasHeight = window.innerHeight - 20;
const canvasWidth = window.innerWidth - 400;
const melonHeight = 70;
const melonWidth = 87.5;
const gravity = 7;

export function getDistance(p, q) {
  return (Math.sqrt(Math.pow(p.x-q.x, 2) + Math.pow(p.y-q.y, 2)));
}

export function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

export class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class Melon {
  constructor(fruitId) {
    this.fruitId = fruitId;
    this.velocityX = randomNumber(-20, 20);
    this.velocityY = randomNumber(-100, -70);
    this.spinSpeed = randomNumber(-Math.PI/3, Math.PI/3);
    this.spin = 0;
    this.points = this.getPoints();
    this.exists = true;
    this.cut = false;
    this.image = new Image();
    this.image.src = require("./assets/images/" + this.fruitId + ".png");
    this.width = this.image.width;
    this.height = this.image.height;
    this.x = randomNumber(150, canvasWidth-150);
    this.y = canvasHeight + this.height/2;
  }

  getPoints() {
    return [
      new Point(this.x, this.y),
      new Point(this.x+this.height*Math.cos(this.spin), this.y+this.height*Math.sin(this.spin)),
      new Point(this.x+this.height*Math.cos(this.spin)-this.width*Math.sin(this.spin), this.y+this.height*Math.sin(this.spin)+this.width*Math.cos(this.spin)),
      new Point(this.x-this.width*Math.sin(this.spin), this.y+this.width*Math.cos(this.spin)),
      new Point(this.x, this.y)
    ];
  }

  updatePosition(ctx) {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.velocityY += gravity;
    if (this.y >= canvasHeight+100) {
      this.exists = false;
    }
    this.points = this.getPoints();
    this.spin += this.spinSpeed;

    ctx.save();
    ctx.translate(this.x + this.width/2, this.y + this.height/2);
    ctx.rotate(this.spin);
    ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);
    ctx.restore();

    if (this.spin >= 2*Math.PI) {
      this.spin -= 2*Math.PI;
    }
  }
}

export class HalfMelon {
  constructor(melonX, melonY, side, velocityX, velocityY, spin, spinSpeed, fruitId) {
    this.fruitId = fruitId
    if (side === 0) {
      this.x = melonX - melonWidth/2;
      this.y = melonY
      this.spinSpeed = -spinSpeed;
      this.image = new Image();
      this.image.src = require("./assets/images/" + this.fruitId + "Left.png");
    } else {
      this.x = melonX + melonWidth/2;
      this.y = melonY;
      this.spinSpeed = spinSpeed;
      this.image = new Image();
      this.image.src = require("./assets/images/" + this.fruitId + "Right.png");
    }
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.spin = spin;
    this.exists = true;
    this.width = melonWidth/2;
    this.height = melonHeight;
    this.mass = 10;
    this.side = side;
  }

  updatePosition(ctx) {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.velocityY += gravity;
    if (this.y >= canvasHeight+10) {
      this.exists = false;
    }

    ctx.save();
    ctx.translate(this.x + this.width/2, this.y + this.height/2);
    ctx.rotate(this.spin);
    ctx.drawImage(this.image, -this.width/2, -this.height/2, this.width, this.height);
    ctx.restore();

    this.spin += this.spinSpeed;
    if (this.spin >= 2*Math.PI) {
      this.spin -= 2*Math.PI;
    } else if (this.spin <= 2*Math.PI) {
      this.spin += 2*Math.PI;
    }
  }
}

export class Splash {
  constructor(x, y, fruitId) {
    this.x = x;
    this.y = y;
    this.life = 22;
    this.image = new Image();
    this.image.src = require("./assets/images/" + fruitId + "Splash.png");
    this.height = this.image.height;
    this.width = this.image.width;
  }
  draw(ctx) {
    ctx.drawImage(this.image, this.x-this.width/8, this.y-this.height/8, this.width/4, this.height/4);
    this.life--;
  }
}

export function melonSlashed(melon, p, q) {
  let intersections = 0;
  for (let j=0; j<4; j++) {
    if (isIntersecting(p, q, melon.points[j], melon.points[j+1])) {
      intersections++;
    }
  }
  if (intersections >= 2) {
    return true;
  }
  return false;
}

function isIntersecting(p1, q1, p2, q2) {
  let o1 = orientation(p1, q1, p2);
  let o2 = orientation(p1, q1, q2);
  let o3 = orientation(p2, q2, p1);
  let o4 = orientation(p2, q2, q1);
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
  let val = ((q.y - p.y) * (r.x - q.x)) - ((q.x - p.x) * (r.y - q.y));
  if (val > 0) {
    return 1;
  } else if (val < 0) {
    return 2;
  } else {
    return 0;
  }
}
