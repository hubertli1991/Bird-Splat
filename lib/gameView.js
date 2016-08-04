var GameView = function(game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.bird = this.game.bird[0];

  this.pauseGame = false;
  this.pausedTime = 0;

  this.onKeydownHandler = this.onKeydown.bind(this);
  this.restartHandler = this.restartGame.bind(this);
};

GameView.prototype.onKeydown = function(e) {
  // press "up" to jump/fly up
  if ( e.keyCode === 38 ) {
    this.bird.turnOnFlyingAnimation();
    // debugger;
    this.bird.jump();
  }

  // press "down" to dive down
  if ( e.keycode === 40 ) {

  }

// comment out this part before deployment - BEGIN
// Or use them to cheat
  // press "s" to remove all asteroids
  if ( e.keyCode === 83 ) {
    this.removeAllAsteroids();
  }
  // press "x" to lose
  if ( e.keyCode === 88 ) {
    this.game.shouldGameContinue = false;
  }
  // press "space bar" to pause or continue game
  if ( e.keyCode === 32 ) {
    this.pauseGameToggle();
  }
  // press "g" to turn God Mode on or off
  // if ( e.keyCode === 71 ) {
  //   this.turnOnGodModeToggle();
  // }
// comment out this part before deployment - END
};


// development methods - BEGIN
GameView.prototype.pauseGameToggle = function() {
  if ( this.pauseGame ) {
    this.pauseGame = false;
  } else {
    this.pauseGame = true;
  }
};

// GameView.prototype.turnOnGodModeToggle = function() {
//   if ( this.game.birdIsGod ) {
//     this.game.birdIsGod = false;
//   } else {
//     this.game.birdIsGod = true;
//   }
// };

GameView.prototype.removeAllAsteroids = function() {
  this.game.removeAllAsteroids();
};
// development methods - END


// GameView.prototype.addEventListener = function() {
//   document.addEventListener( "keydown", this.onKeydownHandler );
// };

// GameView.prototype.removeEventListener = function() {
//   document.removeEventListener( "keydown", this.onKeydownHandler );
// };

GameView.prototype.stop = function() {
  // this.removeEventListener();
  document.removeEventListener( "keydown", this.onKeydownHandler );
  document.addEventListener( "keydown", this.restartHandler );

  this.ctx.font = "30px Comic Sans MS";
  this.ctx.fillStyle = "white";

  if ( window.localStorage.getItem( "highScore" ) === undefined || this.score >= window.localStorage.getItem( "highScore" ) ) {
    if ( this.score > window.localStorage.getItem( "highScore" ) ) {
      window.localStorage.setItem( "highScore", this.score );
    }
    this.ctx.fillText("BUT NEW HIGH SCORE!!!!!", 375, 250);
  }

  this.ctx.fillText("OUCH!", 375, 200);
  this.ctx.fillText("YOUR SCORE: " + this.score, 375, 300);
  this.ctx.fillText("HIGH SCORE: " + window.localStorage.getItem( "highScore" ), 375, 350);
  this.ctx.fillText("ENTER --> PLAY AGAIN", 375, 450);

};


GameView.prototype.start = function () {

  document.addEventListener( "keydown", this.onKeydownHandler );
  this.game.birdIsGod = false;
  this.lastTime = 0;
  //start the animation
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function(time){
  // the time variable is the time since DOMContentLoaded
  // gets automatically passed into the requestAnimationFrame callback
  // we need to subtract the time between DOMContentLoaded and the 'ENTER' event that actually starts the game
  // otherwise, timeDelta will be wrong and the game will be running during this break
  // that's where timeAdjustment comes in
  this.timeAdjustment = this.timeAdjustment || time;
  // runTime is the time since GameView.prototype.start was invoked
  this.runTime = time - this.timeAdjustment;
  // EVERYTHING depends on timeDelta
  var timeDelta;
  if (this.pauseGame) {
    this.pausedTime += this.runTime - this.lastTime;
    timeDelta = 0;
  } else {
    timeDelta = this.runTime - this.lastTime;
  }

  this.game.step(timeDelta);
  // Make sure this.game.draw gets invoked before this.ctx.fillText get invoked
  // Otherwise, the text will not render
  this.game.draw(this.ctx);

  // if we don't check shouldGameContinue, score would just increment with runTime forever
  if ( this.game.shouldGameContinue ) {
    this.score = parseInt(( this.runTime - this.pausedTime ) / 1000);
  } else {
    this.stop();
  }

  this.lastTime = this.runTime;

  this.ctx.font = "30px Comic Sans MS";
  this.ctx.fillStyle = "white";
  this.ctx.fillText(this.score, 490, 70);

  // every call to animate requests causes another call to animate
  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.restartGame = function(e) {
  if ( e.keyCode === 13 ) {
    document.removeEventListener( "keydown", this.restartHandler );
    window.location.reload();
  }
};


module.exports = GameView;
