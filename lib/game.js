var Bird = require("./bird.js");
var Asteroid = require('./asteroid.js');
var Util = require('./util.js');

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
