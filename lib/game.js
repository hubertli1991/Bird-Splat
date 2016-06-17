var Bird = require("./bird.js");
var Asteroid = require('./asteroid.js');
var Util = require('./util.js');

var Game = function() {

  this.bird = [ new Bird() ];
  this.asteroids = [ new Asteroid() ];

  this.shouldGameContinue = true;

};

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
//frsmes per second
Game.FPS = 32;

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

Game.prototype.step = function (timeDelta) {
  // if ( this.bird[0].collideCheck(this.asteroids[0]) ) {
  //   this.bird[0].afterCollision();
  // }

  this.moveObjects(timeDelta);
  //add check collision
};

Game.prototype.collideCheck = function(objectOne, objectTwo) {
  var target = Math.max( objectOne.radius, objectTwo.radius );
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


Game.prototype.jump = function (timeDelta) {

};

module.exports = Game;
