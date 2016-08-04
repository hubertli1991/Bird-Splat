var Util = require("./util.js");
var MovingObject = require("./moving_object.js");

var Bird = function() {

  this.obj = "bird";

  // this.hasCollided = false;
  this.hasHitFloor = false;
  this.inMidJump = false;

  var options = {
    pos: [500, 300],
    color: "#000000",
    vel: [0, 5],
    radius: 20
  };

  var bird = this;
  MovingObject.call(bird, options);
};

Util.inherits(Bird, MovingObject);

Bird.prototype.jump = function(e) {
  this.vel[1] = -5;
  this.inMidJump = true;
};

Bird.prototype.afterJump = function() {
  if ( this.vel[1] >= 0 ) {
    this.inMidJump = false;
    this.vel[1] = 5;
  }
  this.vel[1] += 0.25;
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
