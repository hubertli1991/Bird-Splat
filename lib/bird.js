var Util = require("./util.js");
var MovingObject = require("./moving_object.js");

var Bird = function() {

  this.obj = "bird";

  var options = {
    pos: [500, 300],
    color: "#000000",
    // color: "green",
    // vel: [0,0],
    vel: [0, 1.5],
    radius: 20
  };

  var bird = this;
  MovingObject.call(bird, options);
};

Util.inherits(Bird, MovingObject);

Bird.prototype.jump = function(e) {
  e.preventDefault();
  this.pos[1] -= 30;
};

Bird.prototype.splatAfterCollision = function() {
  this.vel = [-2, 0];
  this.turnOnSplatAnimation();
};

Bird.prototype.fallAfterCollision = function() {
  this.vel = [-1, 1];
  this.turnOnFallingAnimation();
};

module.exports = Bird;
