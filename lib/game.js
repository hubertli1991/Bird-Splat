var Bird = require("./bird");

var Game = function() {

  this.bird = [ new Bird() ];

};

Game.BG_COLOR = "#000000";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
//frsmes per second
Game.FPS = 32;

Game.prototype.allObjects = function() {
  return( [].concat(this.bird) );
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  this.allObjects().forEach(function (object) {
    object.draw(ctx);
  });
};

Game.prototype.moveObjects = function (timeDelta) {
  this.allObjects().forEach(function (object) {
    object.move(timeDelta);
  });
};

Game.prototype.step = function (timeDelta) {
  this.moveObjects(timeDelta);
  //add check collision
};

module.exports = Game;
