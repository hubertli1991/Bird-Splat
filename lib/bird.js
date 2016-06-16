var Util = require("./util");
var MovingObject = require("./moving_object");

var DEFAULTS = {
  POS: [50, 50],
  COLOR: "#505050",
  VEL: [0, -10],
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

Bird.prototype.jump = function() {
  this.pos[1] += 20;
};

Util.inherits(Bird, MovingObject);

module.exports = Bird;
