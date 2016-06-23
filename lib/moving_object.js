var Util = require("./util.js");
var Sprite = require("./sprite.js");

var MovingObject = function(options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;

  this.spriteImg = new Image();
  this.spriteCategory = Sprite.BIRD_FLYING_IMG;
  this.flyingAnimationOn = false;
  this.birdImageIndex = 0;

  this.hasCollided = false;
  this.collisionType = false;
};

MovingObject.prototype.initiateSprite = function(ctx) {
  this.sprite = this.sprite || new Sprite( {
    ctx: ctx,
    img: this.spriteImg,
    dWidth: 60,
    dHeight: 60
  } );
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

  // var imageIdx = Math.floor(this.birdImageIndex);
  this.spriteImg.src = this.spriteCategory[this.birdImageIndex];

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
  if ( this.hasCollided && this.collisionType === 'splat' ) {
    this.sprite.render(this.spriteImg, this.pos[0], this.pos[1]-27);
  } else {
    this.sprite.render(this.spriteImg, this.pos[0]-29, this.pos[1]-27);
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
