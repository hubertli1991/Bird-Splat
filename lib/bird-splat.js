var Game = require("./game.js");
var GameView = require("./gameView.js");

document.addEventListener("DOMContentLoaded", function(){
  var canvasEl = document.getElementsByTagName("canvas")[0];
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;

  var ctx = canvasEl.getContext("2d");
  var game = new Game();

  var startGame = function(e) {
    if ( e.keyCode === 13 ) {
      document.removeEventListener( "keydown", startGame );
      new GameView(game, ctx).start();
    }
  };

  game.draw(ctx);
  ctx.font = "30px Ariel";
  ctx.fillStyle = "white";
  ctx.fillText("Press Enter to start", 350, 200);
  ctx.fillText("Press 'Up' to flap.", 350, 250);
  ctx.fillText("Press 'Space' to pause or continue game", 350, 350);

  document.addEventListener( "keydown", startGame );
});
