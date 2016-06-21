var Util = require("./util.js");
var Sprite = require("./sprite.js");

var MovingObject = function(options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
};

MovingObject.prototype.initiateSprite = function(ctx) {
  // debugger;
  var spriteImg = new Image();
  spriteImg.src = "images/redOne.png";

  this.sprite = new Sprite( {
    ctx: ctx,
    img: spriteImg,
    dWidth: 60,
    dHeight: 60
  } );
};

MovingObject.prototype.draw = function(ctx) {

  ctx.fillStyle = this.color;

  ctx.beginPath();
  ctx.arc(
    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
  );
  ctx.fill();

  this.initiateSprite(ctx);
  this.sprite.render(this.pos[0]-29, this.pos[1]-27);
};

MovingObject.NORMAL_FRAME_TIME_DELTA = 1000/60;

MovingObject.prototype.move = function(timeDelta) {
  var velocityScale = timeDelta / MovingObject.NORMAL_FRAME_TIME_DELTA,
    offsetX = this.vel[0] * velocityScale,
    offsetY = this.vel[1] * velocityScale;

this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
};

module.exports = MovingObject;
