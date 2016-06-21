var Sprite = function(spriteOptions) {

  this.ctx = spriteOptions.ctx;
  this.img = spriteOptions.img;
  // this.dx = spriteOptions.dx;
  // this.dy = spriteOptions.dy;
  this.dWidth = spriteOptions.dWidth;
  this.dHeight = spriteOptions.dHeight;

  this.render = function(dx, dy) {
    // debugger
    this.ctx.drawImage( this.img, dx, dy, this.dWidth, this.dHeight );
  };

};

module.exports = Sprite;
