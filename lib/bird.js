var Util = require("./util.js");
var MovingObject = require("./moving_object.js");

var Bird = function() {

  this.obj = "bird";
  this.hasHitFloor = false;

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
  this.pos[1] -= 30;
};

Bird.prototype.splatAfterCollision = function(asteroid) {
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
