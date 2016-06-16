var Util = require("./util");
var MovingObject = require("./moving_object");

var DEFAULTS = {
  POS: [200, 300],
  COLOR: "#505050",
  VEL: [0, 1],
  RADIUS: 25
};

var Bird = function(options) {

  if (options === undefined) {
    options = {};
  }

  options.pos = options.pos || DEFAULTS.POS;
  options.vel = options.vel || DEFAULTS.VEL;
  options.color = options.color || DEFAULTS.COLOR;
  options.radius = options.radius || DEFAULTS.RADIUS;

  var bird = this;
  MovingObject.call(bird, options);
};

Util.inherits(Bird, MovingObject);

Bird.prototype.jump = function(e) {
  switch (e.keyCode) {
    case ( 38 ):
      this.pos[1] -= 25;
      break;
    case ( 40 ):
      this.pos[1] += 50;
      break;
  }
};


module.exports = Bird;
