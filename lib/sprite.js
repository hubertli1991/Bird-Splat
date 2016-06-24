

var Sprite = function(spriteOptions) {

  this.spriteCategory = {
    'BIRD_FLYING_IMG': Sprite.BIRD_FLYING_IMG,
    'BIRD_FALLING_IMG': Sprite.BIRD_FALLING_IMG,
    'BIRD_SPLAT_IMG': Sprite.BIRD_SPLAT_IMG,
    'ASTEROID': Sprite.ASTEROID
  };

  this.ctx = spriteOptions.ctx;
  this.dWidth = spriteOptions.dWidth;
  this.dHeight = spriteOptions.dHeight;

  this.render = function(img, dx, dy) {
    // if ( img.src === 'file:///Users/hubertli/Desktop/Bird-Splat/images/redTwo.png' ) {debugger;}
    this.ctx.drawImage( img, dx, dy, this.dWidth, this.dHeight );
    // if ( img.src === 'file:///Users/hubertli/Desktop/Bird-Splat/images/redTwo.png' ) {debugger;}
  };

};

Sprite.BIRD_FLYING_IMG = [
  'images/redOne.png',
  'images/redTwo.png',
  'images/redThree.png',
  'images/redFour.png',
  'images/redFive.png'
  // 'images/redSix.png'
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

Sprite.ASTEROID = [
  'images/asteroid.png'
];

module.exports = Sprite;
