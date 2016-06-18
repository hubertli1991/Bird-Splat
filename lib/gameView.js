var GameView = function(game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.bird = this.game.bird[0];

  this.onKeydownHandler = this.onKeydown.bind(this);

};

GameView.prototype.onKeydown = function(e) {
// comment out this part before deployment - BEGIN
// press "s" to "save yourself" or remove all asteroids
  if ( e.keyCode === 83 ) {
    this.removeAllAsteroids();
  }
// comment out this part before deployment - END

  this.bird.jump(e);
};


// development methods - BEGIN
GameView.prototype.stopGame = function() {
  debugger;
};

GameView.prototype.removeAllAsteroids = function() {
  this.game.removeAllAsteroids();
};
// development methods - END

GameView.prototype.addEventListener = function() {
  document.addEventListener( "keydown", this.onKeydownHandler );

  //only use during development to pause the game
  document.addEventListener( "click", this.stopGame );
};

GameView.prototype.removeEventListener = function() {
  document.removeEventListener( "keydown", this.onKeydownHandler );
};

GameView.prototype.stop = function() {
  this.removeEventListener();
};

GameView.prototype.start = function () {
  this.addEventListener();
  this.lastTime = 0;
  this.millisecondCount = 0;
  //start the animation
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function(time){

  var timeDelta = time - this.lastTime;

  if ( this.game.shouldGameContinue === false ) {
    this.stop();
    // return;
  }

  this.game.step(timeDelta);
  this.game.draw(this.ctx);
  this.lastTime = time;

  //every call to animate requests causes another call to animate
  requestAnimationFrame(this.animate.bind(this));
};

module.exports = GameView;
