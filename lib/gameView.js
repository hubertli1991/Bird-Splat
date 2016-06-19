var GameView = function(game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.bird = this.game.bird[0];

  this.onKeydownHandler = this.onKeydown.bind(this);

};

GameView.prototype.onKeydown = function(e) {
// comment out this part before deployment - BEGIN
  // press "s" to remove all asteroids
  // debugger;
  if ( e.keyCode === 83 ) {
    this.removeAllAsteroids();
  }
  // press "x" to lose
  if ( e.keyCode === 88 ) {
    this.game.shouldGameContinue = false;
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
  // document.addEventListener( "click", this.stopGame );
};

GameView.prototype.removeEventListener = function() {
  document.removeEventListener( "keydown", this.onKeydownHandler );
};

GameView.prototype.stop = function() {
  this.removeEventListener();
  // debugger

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
  this.game.step(timeDelta);
  // Make sure this.game.draw gets invoked before this.ctx.fillText get invoked
  // Otherwise, the text will not render
  this.game.draw(this.ctx);

  if ( this.game.shouldGameContinue ) {
    this.score = parseInt(time / 1000);
  } else {
    this.stop();
    this.ctx.font = "30px Ariel";
    this.ctx.fillStyle = "white";
    this.ctx.fillText("You suck. Game Over.", 350, 200);
    this.ctx.fillText("Your score was: " + this.score, 350, 250);
    this.ctx.fillText("Click to Play Again", 350, 300);
  }

  this.ctx.font = "30px Ariel";
  this.ctx.fillStyle = "white";

  this.lastTime = time;

  //every call to animate requests causes another call to animate
  requestAnimationFrame(this.animate.bind(this));

};

module.exports = GameView;
