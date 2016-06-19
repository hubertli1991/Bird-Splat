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

Bird.prototype.splatAfterCollision = function() {
  this.vel = [-2, 0];
};

Bird.prototype.fallAfterCollision = function() {
  // this will do nothing since the bird's default action is falling
  // Note, if this function is invoked, then the keydown eventListen will be removed immediately
  this.vel = [-1, 1];
};

module.exports = Bird;
