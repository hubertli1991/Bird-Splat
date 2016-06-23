var Util = require("./util.js");
var Sprite = require("./sprite.js");

var MovingObject = function(options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;

  this.spriteImg = new Image();
  // this.spriteCategory = Sprite.BIRD_FLYING_IMG;
  this.spriteCategory = "";
  this.flyingAnimationOn = false;
  this.birdImageIndex = 0;
  this.asteroidImageIndex = 0;
  this.movingObjectImageIndex = 0;

  this.hasCollided = false;
  this.collisionType = false;
};

MovingObject.prototype.initiateSprite = function(ctx) {
  var spriteOptions = {};
  if (this.obj === "asteroid") {
    spriteOptions = {
      ctx: ctx,
      img: this.spriteImg,
      dWidth: this.radius * 2.3,
      dHeight: this.radius * 2.3
    };
  } else {
    spriteOptions = {
      ctx: ctx,
      img: this.spriteImg,
      dWidth: 60,
      dHeight: 60
    };
  }

  this.sprite = this.sprite || new Sprite( spriteOptions );
};

MovingObject.prototype.turnOnFlyingAnimation = function() {
  this.spriteCategory = this.sprite.spriteCategory['BIRD_FLYING_IMG'];
  this.flyingAnimationOn = true;
};

MovingObject.prototype.turnOffFlyingAnimation = function() {
  this.flyingAnimationOn = false;
  this.birdImageIndex = 0;
};

MovingObject.prototype.turnOnFallingAnimation = function() {
  this.hasCollided = true;
  this.collisionType = 'fall';
  this.spriteCategory = this.sprite.spriteCategory['BIRD_FALLING_IMG'];
  this.birdImageIndex = 0;
};

MovingObject.prototype.turnOnSplatAnimation = function() {
  this.hasCollided = true;
  this.collisionType = 'splat';
  this.spriteCategory = this.sprite.spriteCategory['BIRD_SPLAT_IMG'];
  this.birdImageIndex = 0;
};

MovingObject.prototype.draw = function(ctx) {

  ctx.fillStyle = this.color;

  ctx.beginPath();
  ctx.arc(
    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
  );
  ctx.fill();

  this.initiateSprite(ctx);

  if( this.obj === "asteroid" ) {
    this.movingObjectImageIndex = this.asteroidImageIndex;
    this.spriteCategory = this.sprite.spriteCategory['ASTEROID'];
  } else {
    this.movingObjectImageIndex = this.birdImageIndex;
    this.spriteCategory = this.spriteCategory || this.sprite.spriteCategory['BIRD_FLYING_IMG'];
  }

  this.spriteImg.src = this.spriteCategory[this.movingObjectImageIndex];

  // flying Anitmation
  if ( this.flyingAnimationOn ) {
    this.birdImageIndex += 1;
    if ( this.birdImageIndex > 5 ) {
      this.turnOffFlyingAnimation();
    }
  }

  // falling Anitmation
  if ( this.hasCollided && this.collisionType === 'fall') {
    this.birdImageIndex += 1;
    if ( this.birdImageIndex > 3 ) {
      this.birdImageIndex = 3;
    }
  }

  // Splat Animation
  // No need for a splat function

  // I want the the splat mark to be on the asteroid instead of on the side
  this.xShift = 29;
  if ( this.hasCollided && this.collisionType === 'splat' ) {
    this.xShift = 0;
  }

  if ( this.obj === "bird" ) {
    this.sprite.render(this.spriteImg, this.pos[0]-this.xShift, this.pos[1]-27);
  }
  if ( this.obj === "asteroid" ) {
    this.sprite.render(this.spriteImg, this.pos[0]-this.radius*1.2, this.pos[1]-this.radius);
  }
};

MovingObject.NORMAL_FRAME_TIME_DELTA = 1000/60;

MovingObject.prototype.move = function(timeDelta) {
  var velocityScale = timeDelta / MovingObject.NORMAL_FRAME_TIME_DELTA,
    offsetX = this.vel[0] * velocityScale,
    offsetY = this.vel[1] * velocityScale;

this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
};

module.exports = MovingObject;
