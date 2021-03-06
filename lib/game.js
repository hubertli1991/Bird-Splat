var Bird = require("./bird.js");
var Asteroid = require('./asteroid.js');
var Util = require('./util.js');

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
  // this.difficultyLevel = this.difficultyLevel + 1 || 0;
  // set max difficultyLevel
  // if ( this.difficultyLevel >= 30 ) {
  //   this.difficultyLevel = 30;
  // }
  var asteroid = new Asteroid( this.difficultyLevel );

  var numOfAsteroids = this.asteroids.length;
  // for (var i = 0; i < numOfAsterorids; i++) {
  //   if ( this.collisionCheck(asteroid, this.asteroids[i], 1.25) ) {
  //     break;
  //   }
  //   if ( i === numOfAsterorids - 1 ) {
  //     this.asteroids.push( asteroid );
  //   }
  // }

  if ( this.collisionCheck(asteroid, this.asteroids[numOfAsteroids - 1], 125) || ( numOfAsteroids >= 2 && Math.abs(asteroid.pos[1]-this.asteroids[numOfAsteroids - 2].pos[1]) > 175 ) ) {
    this.addAsteroid();
  } else {
    this.asteroids.push( asteroid );
  }
};

Game.prototype.removeAllAsteroids = function() {
  this.asteroids = [ new Asteroid() ];
};

Game.prototype.allObjects = function() {
  return( [].concat(this.asteroids, this.bird) );
};

Game.prototype.draw = function (ctx) {

  // debugger;
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
    this.birdCollisionCheckAll();
  }

  if ( this.bird[0] && this.bird[0].inMidJump ) {
    this.bird[0].afterJump();
  }

  this.moveObjects(timeDelta);
};

Game.prototype.collisionCheck = function(objectOne, objectTwo, extraSpace) {
  var target = objectOne.radius + objectTwo.radius;
  target = target + extraSpace || target;
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

Game.prototype.birdCollisionCheckAll = function() {
  if ( this.bird[0] === undefined || this.bird[0].hasHitFloor ) { return; }
  var bird = this.bird[0];
  for (var i = 0; i < this.asteroids.length; i++) {
    if (this.collisionCheck(bird, this.asteroids[i])) {
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
