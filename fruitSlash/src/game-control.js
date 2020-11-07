import React from 'react';
import * as posenet from 'posenet';
import {Point, Melon, HalfMelon, Splash} from './util.js';
import {getDistance, melonSlashed, randomNumber} from './util.js';

let history = [];
let frameCount = 0;

const videoWidth = window.innerWidth - 80;
const videoHeight = window.innerHeight - 160;

const minPartConfidence = 0.5;
const partIndex = 10;

class MainVideo extends React.Component {
  constructor(props) {
    super(props);
    this.handleVideoLoaded = this.handleVideoLoaded.bind(this);
  }

  handleVideoLoaded(video) {
    this.props.passVideoUp(video);
  }

  componentDidMount() {
    let constraints = { audio: false, video: { width: videoWidth, height: videoHeight } };
    let video;
    navigator.mediaDevices.getUserMedia(constraints).then((mediaStream) => {
      video = document.querySelector("video");
      video.height = videoHeight;
      video.width = videoWidth;

      video.srcObject = mediaStream;
      video.onloadedmetadata = (e) => {
        video.play();
        this.handleVideoLoaded(video);
      };
    });
  }

  render() {
    return (
      <video autoPlay={true} id="videoElement" style={{display:'none'}} playsInline></video>
    );
  }
}

class MainCanvas extends React.Component {
  componentDidMount() {
    const canvas = document.querySelector("canvas");
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    this.props.passCanvasUp(canvas);
  }

  render() {
    return (
        <canvas id="canvas"></canvas>
    );
  }
}

export class GameControl extends React.Component {
  constructor(props) {
    super(props);
    this.video = null;
    this.canvas = null;
    this.melons = [];
    this.halfMelons = [];
    this.splashes = [];
    this.score = 0;
    this.timeLeft = 90;
    this.getVideo = this.getVideo.bind(this);
    this.getCanvas = this.getCanvas.bind(this);
    this.detectPoseInRealTime = this.detectPoseInRealTime.bind(this);
    this.startDetection = this.startDetection.bind(this);
  }

  getVideo(inpVideo) {
    this.video = inpVideo;
  }
  getCanvas(inpCanvas) {
    this.canvas = inpCanvas;
  }

  async startDetection(e) {
    document.querySelector("button").remove();
    const net = await posenet.load({
      architecture: 'ResNet50',
      outputStride: 32,
      inputResolution: 250,
      multiplier: 1.0,
      quantBytes: 2
    });
    this.interval = setInterval(() => this.tick(), 1000);
    this.detectPoseInRealTime(this.video, net, this.canvas.getContext('2d'));
  }

  tick() {
    this.timeLeft--;
  }

  async detectPoseInRealTime(video, net, ctx) {
    let pose = await net.estimateSinglePose(video, {
      flipHorizontal: true,
      decodingMethod: 'single-person'
    });

    this.drawBackground(ctx, video);
    this.detectAndManageSlash(pose, ctx);
    this.updateMelons(ctx);

    ctx.font = "30px Arial";
    ctx.fillStyle = "aqua";
    ctx.fillText("Time: " + this.timeLeft, videoWidth-200, 25);
    ctx.fillText("Score: " + this.score, 200, 25);

    frameCount++;
    if (this.timeLeft >= 0)
      this.detectPoseInRealTime(video, net, ctx);
    else {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, videoWidth, videoHeight);
      ctx.fillStyle = "white";
      ctx.fillText("Game Over. Your score was " + this.score + ". Refresh to play again.", videoWidth/2-200, videoHeight/2);
    }
  }

  drawBackground(ctx, video) {
    ctx.clearRect(0, 0, videoWidth, videoHeight);
    let background = new Image();
    background.src = require("./assets/images/background.jpg");
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-videoWidth, 0);
    ctx.drawImage(background, 0, 0, videoWidth, videoHeight);
    ctx.restore();
  }

  detectAndManageSlash(pose, ctx) {
    const {y, x} = pose.keypoints[partIndex].position;
    history.push(new Point(x, y));
    if (pose.keypoints[partIndex].score >= minPartConfidence) {
      this.drawMotionTrail(ctx, "red");
      if (history.length >= 4) {
        for (let i=0; i<3; i++) {
          if (getDistance(history[history.length-i-2], history[history.length-1]) >=300) {
            for (let j=0; j<this.melons.length; j++) {
              if (melonSlashed(this.melons[j], history[history.length-1], history[history.length-i-2])) {
                if (this.melons[j].fruitId !== 1) {
                  this.splashes.push(new Splash(this.melons[j].x, this.melons[j].y, this.melons[j].fruitId));
                }
                this.melons[j].cut = true;
              }
            }
          }
        }
      }
    }
    if (history.length > 4) {
      history.shift();
    }
  }

  updateMelons(ctx) {
    if (frameCount % Math.floor(randomNumber(20, 25)) === 0) {
      this.generateFruits();
      frameCount = 0;
    }

    for (let i=0; i<this.splashes.length; i++) {
      if (this.splashes[i].life > 0) {
        this.splashes[i].draw(ctx);
      } else {
        this.splashes[i] = null;
        this.splashes.splice(i, 1);
        i--;
      }
    }

    for (var i = 0; i < this.halfMelons.length; i++) {
      if (this.halfMelons[i].exists) {
        this.halfMelons[i].updatePosition(ctx);
      } else {
        this.halfMelons[i] = null;
        this.halfMelons.splice(i, 1);
        i--;
      }
    }

    for (let i = 0; i < this.melons.length; i++) {
      let melon = this.melons[i];
      if (melon.cut) {
        this.score++;
        this.halfMelons.push(new HalfMelon(melon.x, melon.y, 0, melon.velocityX, melon.velocityY, melon.spin, melon.spinSpeed, melon.fruitId));
        this.halfMelons.push(new HalfMelon(melon.x, melon.y, 1, melon.velocityX, melon.velocityY, melon.spin, melon.spinSpeed, melon.fruitId));
        melon.exists = false;
      }
      if (melon.exists) {
        melon.updatePosition(ctx);
      } else {
        this.melons[i] = null;
        this.melons.splice(i, 1);
        i--;
      }
    }
  }

  generateFruits() {
    let fruitID = Math.floor(randomNumber(0, 5));
    if (Math.random() >= 0.5) {
      for (let i=0; i<3; i++) {
        this.melons.push(new Melon(fruitID));
      }
    } else {
      for (let i=0; i<3; i++) {
        this.melons.push(new Melon(Math.floor(randomNumber(0, 5))));
      }
    }
  }

  drawMotionTrail(ctx, color) {
    ctx.lineWidth = 6;
    ctx.lineJoin = 'round';
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(history[0].x, history[0].y);
    for (let i=1; i<history.length-3; i++) {
      // this.drawPoint(ctx, history[i], 3, "white")
      ctx.lineTo(history[i].x, history[i].y);
      ctx.stroke();
    }
  }

  drawPoint(ctx, p, r, color) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  render() {
    return (
      <div>
        <MainVideo passVideoUp={this.getVideo} />
        <MainCanvas passCanvasUp={this.getCanvas} />
        <button className="btn striped-shadow dark" onClick={this.startDetection}><span>Start Game</span></button>
      </div>);
  }
}
