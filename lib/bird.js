var Util = require("./util.js");
var MovingObject = require("./moving_object.js");

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
