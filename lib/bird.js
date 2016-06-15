var Util = require("./util");
var MovingObject = require("./movingObject");

var DEFAULTS = {
  POS: [50, 50],
  COLOR: "#505050",
  VEL: [10, 10],
  RADIUS: 25
};

var Bird = function(options) {

  if (options === undefined) {
    options = {};
  }

  options.pos = options.pos || DEFAULTS.POS;
  options.vel = options.vel || DEFAULTS.VEL;
  options.color = options.color || DEFAULTS.COLOR;
  options.radius = options.radius || DEFAULT.RADIUS;

  var bird = this;
  MovingObject.call(bird, options);
};

Util.inherits(Bird, MovingObject);
