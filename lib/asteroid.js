var Util = require("./util");
var MovingObject = require("./moving_object");

var Asteroid = function() {

  this.obj = "asteroid";

  // var position =

  var options = {
    pos: [ 1000, 300 ],
    color: "green",
    vel: [-2, 0],
    radius: 100
  };

  var asteroid = this;
  MovingObject.call(asteroid, options);
};

Util.inherits(Asteroid, MovingObject);

Asteroid.prototype.afterCollision = function() {
  // Bird is not big enough to cause any damage
};

module.exports = Asteroid;
