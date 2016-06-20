var Game = require("./game.js");
var GameView = require("./gameView.js");

document.addEventListener("DOMContentLoaded", function(){
  var canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  var ctx = canvasEl.getContext("2d");
  var game = new Game();

  var startGame = function() {
    new GameView(game, ctx).start();
    document.removeEventListener( "click", startGame );
  };

  game.draw(ctx);
  ctx.font = "30px Ariel";
  ctx.fillStyle = "white";
  ctx.fillText("Click to start.", 350, 200);
  ctx.fillText("Press 'Up' to flap and 'down' to dive.", 350, 250);

  document.addEventListener( "click", startGame );
});
