var Sprite = function(spriteOptions) {

  this.ctx = spriteOptions.ctx;
  this.dWidth = spriteOptions.dWidth;
  this.dHeight = spriteOptions.dHeight;

// Upload image files when sprite is initiated --BEGIN
  if ( spriteOptions.obj === 'bird' ) {
    // bird flying
    this.birdFlyingAnimationArray = [];
    for (var i = 0; i < Sprite.BIRD_FLYING_IMG.length; i++) {
      this.birdFlyingAnimationArray[i] = new Image();
      this.birdFlyingAnimationArray[i].src = Sprite.BIRD_FLYING_IMG[i];
    }
    // bird falling
    this.birdFallingAnimationArray = [];
    for (var j = 0; j < Sprite.BIRD_FALLING_IMG.length; j++) {
      this.birdFallingAnimationArray[j] = new Image();
      this.birdFallingAnimationArray[j].src = Sprite.BIRD_FALLING_IMG[j];
    }
    // bird splatting
    this.birdSplatAnimationArray = [];
    for (var k = 0; k < Sprite.BIRD_SPLAT_IMG.length; k++) {
      this.birdSplatAnimationArray[k] = new Image();
      this.birdSplatAnimationArray[k].src = Sprite.BIRD_SPLAT_IMG[k];
    }
  }

  if ( spriteOptions.obj === 'asteroid' ) {
    this.asteroidAnimationArray = [];
    for (var l = 0; l < Sprite.ASTEROID_IMG.length; l++) {
      this.asteroidAnimationArray[l] = new Image();
      this.asteroidAnimationArray[l].src = Sprite.ASTEROID_IMG[l];
    }
  }
// --END

  this.spriteCategory = {
    'BIRD_FLYING': this.birdFlyingAnimationArray,
    'BIRD_FALLING': this.birdFallingAnimationArray,
    'BIRD_SPLAT': this.birdSplatAnimationArray,
    'ASTEROID': this.asteroidAnimationArray
  };
};

Sprite.prototype.render = function(img, dx, dy) {
  this.ctx.drawImage( img, dx, dy, this.dWidth, this.dHeight );
};



Sprite.BIRD_FLYING_IMG = [
  'images/redOne.png',
  'images/redTwo.png',
  'images/redThree.png',
  'images/redFour.png',
  'images/redThree.png',
  'images/redTwo.png'
];

Sprite.BIRD_FALLING_IMG = [
  'images/redFallingOne.png',
  'images/redFallingTwo.png',
  'images/redFallingThree.png',
  'images/redFallingFour.png',
];

Sprite.BIRD_SPLAT_IMG = [
  'images/birdSplat.png'
];

Sprite.ASTEROID_IMG = [
  'images/asteroid.png'
];

module.exports = Sprite;
