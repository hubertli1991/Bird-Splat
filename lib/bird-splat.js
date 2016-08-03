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
  ctx.font = "30px Comic Sans MS";
  ctx.fillStyle = "white";

  var logo = new Image();
  // the onload event handler will triggered when the image is loaded
  // i.e. wait for line 30 to load and then run lone 28
  // If we call ctx.drawImage right after logo.src, the image may not have been loaded
  logo.onload = function() {
    ctx.drawImage( logo, 350, 75, 300, 300 );
  };
  logo.src = "images/bird_splat_logo.png";

  // ctx.fillText("Press Enter to start", 350, 400);
  ctx.fillText("ENTER --> START", 400, 425);
  ctx.fillText("UP --> FLAP", 400, 475);
  ctx.fillText("SPACE --> PAUSE", 400, 525);


  document.addEventListener( "keydown", startGame );
});
