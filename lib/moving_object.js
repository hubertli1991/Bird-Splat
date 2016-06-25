var Util = require("./util.js");
var Sprite = require("./sprite.js");

var MovingObject = function(options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;

  this.spriteImg = new Image();

// // Just for Testing -BEGIN
//   this.spriteImgOne = new Image();
//   this.spriteImgOne.src = 'images/redOne.png';
//   this.spriteImgTwo = new Image();
//   this.spriteImgTwo.src = 'images/redTwo.png';
//   this.spriteImgThree = new Image();
//   this.spriteImgThree.src = 'images/redThree.png';
//   this.spriteImgFour = new Image();
//   this.spriteImgFour.src = 'images/redFour.png';
//   this.tests = [ this.spriteImgOne, this.spriteImgTwo, this.spriteImgThree, this.spriteImgFour, this.spriteImgThree, this.spriteImgTwo ];
// // Just for Testing -END

  this.spriteCategory = "";
  this.flyingAnimationOn = false;
  this.counter = 0;
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
      dWidth: this.radius * 2.1,
      dHeight: this.radius * 2.1,
      obj: this.obj
    };
  } else {
    spriteOptions = {
      ctx: ctx,
      img: this.spriteImg,
      dWidth: this.radius * 3,
      dHeight: this.radius * 3,
      obj: this.obj
    };
  }

  this.sprite = new Sprite( spriteOptions );
};

MovingObject.prototype.turnOnFlyingAnimation = function() {
  this.flyingAnimationOn = true;
  this.spriteCategory = this.sprite.spriteCategory.BIRD_FLYING;
};

MovingObject.prototype.turnOffFlyingAnimation = function() {
  // debugger
  // this.spriteCategory = "";
  this.birdImageIndex = 0;
  this.flyingAnimationOn = false;
};

MovingObject.prototype.turnOnFallingAnimation = function() {
  this.turnOffFlyingAnimation();
  this.hasCollided = true;
  this.collisionType = 'fall';
  this.spriteCategory = this.sprite.spriteCategory.BIRD_FALLING;
  // this.birdImageIndex = 0;
  this.counter = 0;
};

MovingObject.prototype.turnOnSplatAnimation = function(asteroid) {
  this.turnOffFlyingAnimation();
  this.hasCollided = true;
  this.collisionType = 'splat';
  this.spriteCategory = this.sprite.spriteCategory.BIRD_SPLAT;
  this.birdImageIndex = 0;
  if ( asteroid ) {
    this.splatPositionAdjustment = [ (asteroid.pos[0] - this.pos[0])/4, (asteroid.pos[1] - this.pos[1])/4 ];
  } else {
    this.splatPositionAdjustment = [0, 0];
  }
};

MovingObject.prototype.draw = function(ctx) {

  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(
    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
  );
  ctx.fill();

  if ( this.sprite === undefined ) {
    this.initiateSprite(ctx);
  }

  if ( this.obj === "asteroid" ) {
    this.movingObjectImageIndex = this.asteroidImageIndex;
    this.spriteCategory = this.sprite.spriteCategory.ASTEROID;
  } else {
    this.movingObjectImageIndex = this.birdImageIndex;
    this.spriteCategory = this.spriteCategory || this.sprite.spriteCategory.BIRD_FLYING;
  }

  // flying anitmation
  if ( this.flyingAnimationOn ) {
      this.counter += 1;
      if (this.counter > 0) {
        this.birdImageIndex += 1;
        this.counter = 0;
      }
      if ( this.birdImageIndex > 5 ) {
        this.turnOffFlyingAnimation();
      }
  }

  // falling anitmation
  if ( this.hasCollided && this.collisionType === 'fall') {
    this.counter += 1;
    if (this.counter > 4) {
      this.birdImageIndex = ( this.birdImageIndex + 1 ) % 4;
      this.counter = 0;
    }
  }

  // asteroid animation
  if ( this.obj === 'asteroid' ) {
    // This is all you need for NOW
    // Add more code when asteroid is no longer static
    this.asteroidImageIndex = 0;
  }

  // splat animation
  this.XsplatPositionAdjustment = 0;
  this.YsplatPositionAdjustment = 0;
  if ( this.hasCollided && this.collisionType === 'splat' ) {
    // Add more code when splat is no longer static
    this.XsplatPositionAdjustment = this.splatPositionAdjustment[0];
    this.YsplatPositionAdjustment = this.splatPositionAdjustment[1];
    // I want the the splat mark to be on the asteroid instead of on the side
  }

  if ( this.obj === "bird" ) {
    // if ( !this.spriteImg.src ) {debugger;}
    // debugger;
    this.sprite.render(this.spriteCategory[this.movingObjectImageIndex], this.pos[0]-29+this.XsplatPositionAdjustment, this.pos[1]-27+this.YsplatPositionAdjustment);
  }
  if ( this.obj === "asteroid" ) {
    this.sprite.render(this.spriteCategory[this.movingObjectImageIndex], this.pos[0]-this.radius*1.1, this.pos[1]-this.radius*1.1);
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
