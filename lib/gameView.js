var GameView = function(game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.bird = this.game.bird[0];

  this.onKeydownHandler = this.onKeydown.bind(this);

};

GameView.prototype.onKeydown = function(e) {
  this.bird.jump(e);
};

GameView.prototype.addEventListener = function() {
  // document.addEventListener( "keydown", this.onKeydown.bind(this) );
  document.addEventListener( "keydown", this.onKeydownHandler );
};

GameView.prototype.removeEventListener = function() {
  // document.removeEventListener( "keydown", this.onKeydown.bind(this) );
  document.removeEventListener( "keydown", this.onKeydownHandler );
};

GameView.prototype.stop = function() {
  this.removeEventListener();
};

GameView.prototype.start = function () {
  this.addEventListener();
  this.lastTime = 0;
  //start the animation
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function(time){
  var timeDelta = time - this.lastTime;

  if ( this.game.shouldGameContinue === false ) {
    this.stop();
    // return;
  }

  this.game.collideCheckAll();
  this.game.step(timeDelta);
  this.game.draw(this.ctx);
  this.lastTime = time;

  //every call to animate requests causes another call to animate
  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
