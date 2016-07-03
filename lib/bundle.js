/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/lib/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Game = __webpack_require__(1);
	var GameView = __webpack_require__(7);
	
	document.addEventListener("DOMContentLoaded", function(){
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game();
	
	  var startGame = function(e) {
	    if ( e.keyCode === 13 ) {
	      document.removeEventListener( "keydown", startGame );
	      new GameView(game, ctx).start();
	    }
	  };
	
	
	
	  game.draw(ctx);
	  ctx.font = "30px Ariel";
	  ctx.fillStyle = "white";
	  ctx.fillText("Press Enter to start", 350, 200);
	  ctx.fillText("Press 'Up' to flap.", 350, 250);
	  ctx.fillText("Press 'Space' to pause or continue game", 350, 350);
	
	  document.addEventListener( "keydown", startGame );
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Bird = __webpack_require__(2);
	var Asteroid = __webpack_require__(6);
	var Util = __webpack_require__(3);
	
	var Game = function() {
	
	  this.bird = [ new Bird() ];
	  this.asteroids = [ new Asteroid() ];
	
	  this.minimumGapBetweenAsteroids = 90;
	  this.timeSinceLastAsteroid = 0;
	
	  this.birdIsGod = false;
	
	  this.shouldGameContinue = true;
	};
	
	Game.BG_COLOR = "#000000";
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	
	Game.prototype.addAsteroid = function() {
	  var asteroid = new Asteroid();
	
	  var numOfAsterorids = this.asteroids.length;
	  for (var i = 0; i < numOfAsterorids; i++) {
	    if ( this.collideCheck(asteroid, this.asteroids[i], 1.25) ) {
	      break;
	    }
	    if ( i === numOfAsterorids - 1 ) {
	      this.asteroids.push( asteroid );
	    }
	  }
	};
	
	Game.prototype.removeAllAsteroids = function() {
	  this.asteroids = [ new Asteroid() ];
	};
	
	Game.prototype.allObjects = function() {
	  return( [].concat(this.asteroids, this.bird) );
	};
	
	Game.prototype.draw = function (ctx) {
	  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
	  ctx.fillStyle = Game.BG_COLOR;
	  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);
	
	  this.allObjects().forEach(function (object) {
	    object.draw(ctx);
	  });
	};
	
	Game.prototype.moveObjects = function (timeDelta) {
	  this.allObjects().forEach(function (object) {
	    object.move(timeDelta);
	  });
	};
	
	Game.prototype.shouldGameAddAsteroid = function(timeDelta) {
	  // comment out code to test game with only one asteroid
	  this.timeSinceLastAsteroid += timeDelta;
	  return( this.timeSinceLastAsteroid >= 500 );
	};
	
	Game.prototype.step = function (timeDelta) {
	  // check to see if the game should add an asteroid
	  if (this.shouldGameAddAsteroid(timeDelta)) {
	    this.addAsteroid();
	    this.timeSinceLastAsteroid = 0;
	  }
	
	  // remove asteroids that are out of bounds
	  for (var i = 0; i < this.asteroids.length; i++) {
	    if( this.asteroids[i].pos[0] < -300 ) {
	      this.asteroids.splice(i,1);
	    }
	  }
	
	  if ( this.bird[0] !== undefined && this.bird[0].pos[0] < -300) {
	    this.bird = [];
	  }
	
	  if ( this.birdIsGod === false ) {
	    this.birdOutOfBounds();
	    this.birdCollideCheckAll();
	  }
	
	  if ( this.bird[0] && this.bird[0].inMidJump ) {
	    this.bird[0].afterJump();
	  }
	
	  this.moveObjects(timeDelta);
	};
	
	Game.prototype.collideCheck = function(objectOne, objectTwo, scaleUp) {
	  var target = objectOne.radius + objectTwo.radius;
	  target = target * scaleUp || target;
	  return ( Util.dist( objectOne.pos, objectTwo.pos ) <= target );
	};
	
	Game.prototype.gapBetweenAsteroidsValidation = function(asteroidOne, asteroidTwo) {
	  return ( Util.dist(asteroidOne.pos, asteroidTwo.pos) >= asteroidOne.radius + asteroidTwo.radius + this.minimumGapBetweenAsteroids );
	};
	
	Game.prototype.birdPostCollision = function(bird, asteroid) {
	  // Remember, in Canvas, the y-coordinates are reversed!!!!
	  // cos( pi / 2 ) ~ 0.71
	  // bird should fall if it hits the 'fourth quarter of the asteroid's left side' or 'the fourth quadrent of the asteroid'
	
	  if ( ( bird.pos[1] > asteroid.pos[1] + asteroid.radius * 0.71 ) || ( bird.pos[0] > asteroid.pos[0] && bird.pos[1] > asteroid.pos[1] ) ) {
	    return "fall";
	  } else {
	    return "splat";
	  }
	};
	
	Game.prototype.collisionResult = function(bird, asteroid) {
	  //remove listeners
	  this.shouldGameContinue = false;
	
	  this._birdPostCollision = this.birdPostCollision(bird, asteroid);
	
	  if( this._birdPostCollision === "fall") {
	    bird.fallAfterCollision();
	  } else {
	    bird.splatAfterCollision( asteroid );
	  }
	
	  asteroid.afterCollisionWithBird();
	};
	
	Game.prototype.birdCollideCheckAll = function() {
	  if ( this.bird[0] === undefined || this.bird[0].hasHitFloor ) { return; }
	  var bird = this.bird[0];
	  for (var i = 0; i < this.asteroids.length; i++) {
	    if (this.collideCheck(bird, this.asteroids[i])) {
	        // bird.hasCollided = true;
	        // debugger
	        this.collisionResult(bird, this.asteroids[i]);
	        break;
	    }
	  }
	};
	
	Game.prototype.birdOutOfBounds = function(bird) {
	  if ( this.bird[0] === undefined ) { return; }
	  if ( this.bird[0].pos[1] < 0 || this.bird[0].pos[1] > 600 ) {
	    this.shouldGameContinue = false;
	  }
	  if ( this.bird[0].pos[1] <= 0 ) {
	    this.bird[0].fallAfterCollision();
	  }
	  if ( this.bird[0].pos[1] >= 600 ) {
	    this.bird[0].splatAfterCollision();
	  }
	};
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	
	var Bird = function() {
	
	  this.obj = "bird";
	
	  // this.hasCollided = false;
	  this.hasHitFloor = false;
	  this.inMidJump = false;
	
	  var options = {
	    pos: [500, 300],
	    color: "#000000",
	    // color: "green",
	    // vel: [0,0],
	    vel: [0, 1],
	    radius: 20
	  };
	
	  var bird = this;
	  MovingObject.call(bird, options);
	};
	
	Util.inherits(Bird, MovingObject);
	
	Bird.prototype.jump = function(e) {
	  this.vel[1] = -2;
	  this.inMidJump = true;
	};
	
	Bird.prototype.afterJump = function() {
	  if ( this.vel[1] >= 1 ) {
	    this.inMidJump = false;
	    this.vel[1] = 1;
	  }
	  this.vel[1] += 0.1;
	};
	
	Bird.prototype.splatAfterCollision = function(asteroid) {
	  // if this.inMidJump is not reset back to false and the bird hits an asteroid
	  // in the middle, the asteroid will fall with the bird
	  this.inMidJump = false;
	  if ( asteroid ) {
	    this.vel = asteroid.vel;
	  } else {
	    this.vel = [0, 0];
	    this.hasHitFloor = true;
	  }
	
	  this.turnOnSplatAnimation(asteroid);
	};
	
	Bird.prototype.fallAfterCollision = function() {
	  this.vel = [-1.2, 1];
	  this.turnOnFallingAnimation();
	};
	
	module.exports = Bird;


/***/ },
/* 3 */
/***/ function(module, exports) {

	var Util = {
	
	  inherits: function(ChildClass, BaseClass) {
	    function Surrogate() {}
	    Surrogate.prototype = BaseClass.prototype;
	    ChildClass.prototype = new Surrogate();
	    ChildClass.prototype.constructor = ChildClass;
	  },
	
	  dist: function(pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	
	  verticalDistance: function(pos1, pos2) {
	    return Math.abs( pos1[1] - pos2[1] );
	  },
	
	  horizontalDistance: function(pos1, pos2) {
	    return Math.abs( pos1[0] - pos2[0] );
	  }
	
	};
	
	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var Sprite = __webpack_require__(5);
	
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


/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(4);
	
	var Asteroid = function() {
	
	  this.obj = "asteroid";
	
	  this.options = {
	    pos: [ 1200, Math.random() * 600 ],
	    color: "#000000",
	    vel: [-2, 0],
	    radius: 50 + Math.random() * 70
	  };
	
	  var asteroid = this;
	  MovingObject.call(asteroid, this.options);
	};
	
	Util.inherits(Asteroid, MovingObject);
	
	Asteroid.prototype.afterCollisionWithBird = function() {
	  // Bird is not big enough to cause any damage
	  // wrote this just to be fair to the asteroid
	  this.hasCollided = true;
	};
	
	module.exports = Asteroid;


/***/ },
/* 7 */
/***/ function(module, exports) {

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
	
	GameView.prototype.turnOnGodModeToggle = function() {
	  if ( this.game.birdIsGod ) {
	    this.game.birdIsGod = false;
	  } else {
	    this.game.birdIsGod = true;
	  }
	};
	
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
	
	  if ( window.localStorage.getItem( "highScore" ) === undefined || this.score > window.localStorage.getItem( "highScore" ) ) {
	    window.localStorage.setItem( "highScore", this.score );
	  }
	
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
	  // we need to remove the time between DOMContentLoaded and clicks to start the game
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
	    // debugger;
	    this.ctx.font = "30px Ariel";
	    this.ctx.fillStyle = "white";
	    this.ctx.fillText("Game Over", 350, 200);
	    this.ctx.fillText("You survived for " + this.score + " seconds", 350, 250);
	    this.ctx.fillText("Press Enter to Play Again", 350, 300);
	    this.ctx.fillText("high score is " + window.localStorage.getItem( "highScore" ), 350, 350);
	  }
	
	  this.lastTime = this.runTime;
	
	  this.ctx.font = "30px Ariel";
	  this.ctx.fillStyle = "white";
	  this.ctx.fillText("score: " + this.score, 100, 100);
	
	  //every call to animate requests causes another call to animate
	  requestAnimationFrame(this.animate.bind(this));
	};
	
	GameView.prototype.restartGame = function(e) {
	  if ( e.keyCode === 13 ) {
	    document.removeEventListener( "keydown", this.restartHandler );
	    window.location.reload();
	  }
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map