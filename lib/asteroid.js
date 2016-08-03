var Util = require("./util");
var MovingObject = require("./moving_object");

var Asteroid = function( scalar ) {

  this.obj = "asteroid";

  this.options = {
    pos: [ 1200, Math.random() * 600 ],
    color: "#000000",
    vel: [-2, 0],
    radius: 50 + Math.random() * scalar || 75
  };

  var asteroid = this;
  MovingObject.call(asteroid, this.options);
};

Util.inherits(Asteroid, MovingObject);

Asteroid.prototype.afterCollisionWithBird = function() {
  // Bird is not big enough to cause any damage
  // wrote this just to be fair to the asteroid
  this.hasCollided = true;
};

module.exports = Asteroid;
