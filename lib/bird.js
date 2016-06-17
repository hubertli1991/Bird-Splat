var Util = require("./util.js");
var MovingObject = require("./moving_object.js");
var GameView = require('./gameView.js');

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
      this.pos[1] -= 25;
      break;
    case ( 40 ):
      this.pos[1] += 50;
      break;
  }
};

Bird.prototype.afterCollision = function() {
  // document.removeEventListener( "keydown", function(e) {this.jump(e); } );
  // GameView.removeEventListener();
  this.vel = [-1, 0];
};

module.exports = Bird;
