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
	var GameView = __webpack_require__(4);
	
	document.addEventListener("DOMContentLoaded", function(){
	  var canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  var ctx = canvasEl.getContext("2d");
	  var game = new Game();
	  new GameView(game, ctx).start();
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
	
	  this.timeSinceLastAsteroid = 0;
	
	  this.shouldGameContinue = true;
	};
	
	Game.BG_COLOR = "#000000";
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	//frames per second
	Game.FPS = 5;
	
	Game.prototype.addAsteroid = function() {
	  var asteroid = new Asteroid();
	
	  var numOfAsterorids = this.asteroids.length;
	  for (var i = 0; i < numOfAsterorids; i++) {
	    if ( this.collideCheck(asteroid, this.asteroids[i]) ) {
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
	  return( [].concat(this.bird, this.asteroids) );
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
	  this.timeSinceLastAsteroid += timeDelta;
	  return( this.timeSinceLastAsteroid >= 1000 );
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
	
	  this.collideCheckAll();
	  this.moveObjects(timeDelta);
	};
	
	Game.prototype.collideCheck = function(objectOne, objectTwo) {
	  var target = objectOne.radius + objectTwo.radius;
	  return ( Util.dist( objectOne.pos, objectTwo.pos ) <= target );
	};
	
	Game.prototype.collisionResult = function(objectOne, objectTwo) {
	  //remove listener
	  this.shouldGameContinue = false;
	  objectOne.afterCollision();
	  objectTwo.afterCollision();
	};
	
	Game.prototype.collideCheckAll = function() {
	  var bird = this.bird[0];
	  for (var i = 0; i < this.asteroids.length; i++) {
	    if (this.collideCheck(bird, this.asteroids[i])) {
	        this.collisionResult(bird, this.asteroids[i]);
	        break;
	    }
	  }
	};
	
	
	module.exports = Game;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(5);
	
	var Bird = function() {
	
	  this.obj = "bird";
	
	  var options = {
	    pos: [500, 300],
	    color: "#505050",
	    vel: [0, 1],
	    radius: 25
	  };
	
	  var bird = this;
	  MovingObject.call(bird, options);
	};
	
	Util.inherits(Bird, MovingObject);
	
	Bird.prototype.jump = function(e) {
	  switch (e.keyCode) {
	    case ( 38 ):
	      this.pos[1] -= 50;
	      break;
	    case ( 40 ):
	      this.pos[1] += 50;
	      break;
	  }
	};
	
	Bird.prototype.afterCollision = function() {
	  this.vel = [-2, 0];
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
	
	  dist: function (pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  }
	
	};
	
	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports) {

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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	
	var MovingObject = function(options) {
	  this.pos = options.pos;
	  this.vel = options.vel;
	  this.radius = options.radius;
	  this.color = options.color;
	};
	
	MovingObject.prototype.draw = function(ctx) {
	
	  ctx.fillStyle = this.color;
	
	  ctx.beginPath();
	  ctx.arc(
	    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
	  );
	  ctx.fill();
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Util = __webpack_require__(3);
	var MovingObject = __webpack_require__(5);
	
	var Asteroid = function() {
	
	  this.obj = "asteroid";
	
	  // var position =
	
	  var options = {
	    pos: [ 1200, Math.random() * 600 ],
	    color: "green",
	    vel: [-2, 0],
	    radius: 50 + Math.random() * 100
	  };
	
	  var asteroid = this;
	  MovingObject.call(asteroid, options);
	};
	
	Util.inherits(Asteroid, MovingObject);
	
	Asteroid.prototype.afterCollision = function() {
	  // Bird is not big enough to cause any damage
	  // wrote this just to be fair to the asteroid
	};
	
	module.exports = Asteroid;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map