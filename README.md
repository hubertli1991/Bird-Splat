# Bird-Splat

[PLAY](http://www.hubertli.com/Bird-Splat/)

![Screen Shot](https://github.com/hubertli1991/Bird-Splat/blob/gh-pages/images/screen_shot.jpg)

## Running and Pausing Game
The game starts when `GameView.start` is invoked. This function invokes `requestAnimationFrame` with `GameView.animate` as a callback function.
```` javascript
GameView.prototype.start = function () {
  // Does some other things
  this.lastTime = 0;
  // start the animation
  requestAnimationFrame(this.animate.bind(this));
};
````
To keep the game moving, `animate` recursively calls itself through `requestAnimationFrame`. This function is in charge of how much the game changes as time passes and pausing the game. Implementation details are in the comments.
```` javascript
GameView.prototype.animate = function(time){
  // the time variable is the time passed since DOMContentLoaded
  // gets automatically passed into the requestAnimationFrame's callback
  this.timeAdjustment = this.timeAdjustment || time;
  // we need to subtract the time between DOMContentLoaded and when the game actually starts running
  // we only want the time passed since GameView.start was invoked
  // if we don't, the game will be running while the browser is displaying the splash page
  // we store this time in timeAdjustment
  this.runTime = time - this.timeAdjustment;
  // runTime is the length of time passed since GameView.start was invoked
  var timeDelta;
  // timeDelta is the fuel that runs the game
  // It gets fed into this.game.step(timeDelta) which is what actually moves the game

  // pauseGame is a switch that gets turned on when GameView.pauseGameToggle gets invoked
  if ( this.pauseGame ) {
    timeDelta = 0;
    // if pauseGame is turned on, this.game.step(timeDelta) will do nothing
  } else {
    timeDelta = this.runTime - this.lastTime;
  }

  this.game.step(timeDelta);
  // this is what actually runs the game

  this.lastTime = this.runTime;
  // saving the current timestamp. Used to calculate the next timeDelta
  requestAnimationFrame(this.animate.bind(this));
};
````

## Moving Objects
`Bird` and `Asteroid` inherit from `MovingObject`.

As mentioned above, the `timeDelta` will determine what each `MovingObject`'s new position will be.
```` javascript
MovingObject.prototype.move = function(timeDelta) {
  var velocityScale = timeDelta / MovingObject.NORMAL_FRAME_TIME_DELTA;
  var offsetX = this.vel[0] * velocityScale;
  var offsetY = this.vel[1] * velocityScale;
  this.pos = [this.pos[0] + offsetX, this.pos[1] + offsetY];
};
````
### Bird
By default, the bird's velocity vector is [0,5]. This means, in Canvas, the bird will move down 5 pixels every 1/60th of a second (roughly every time `requestAnimationFrame` is invoked). For this game, we are assuming the velocity of a falling object  is constant.
#### Bird Jump
The up key triggers a listener that invokes the bird's `jump` function.
```` javascript
Bird.prototype.jump = function(e) {
  this.vel[1] = -5;
  this.inMidJump = true;
};
````
This function, does two things. First, it resets the bird's velocity in the opposite direction. After `jump` is invoked, the velocity vector becomes [0,-5] (in Canvas, the bird moves up 5 pixels every 1/60th of a second). The second thing the `jump` function does is turn on a `inMidJump` switch which will make `Game.step` invoke the bird's `afterJump` function.
```` javascript
Bird.prototype.afterJump = function() {
  if ( this.vel[1] >= 0 ) {
    this.inMidJump = false;
    this.vel[1] = 5;
  }
  this.vel[1] += 0.25;
};
````
The idea behind this function is the bird cannot move upwards forever after flapping one time; the bird's upward velocity must gradually drop to 0 and then revert back to its default falling velocity. Once the bird's velocity reaches 0, `afterJump` will turn the `inMidJump` switch off, telling `Game.step` to not invoke it again until the next time `jump` is invoked.

### Asteroids
An `Asteroid` is essentially a circle that inherits from `MovingObject`. With asteroids, we want to be on the look out for when one collides with the bird (ending the game).

#### Collision Check
So how does `Game` check to see if the bird has collided with an asteroid?
```` javascript
Game.prototype.collisionCheck = function(objectOne, objectTwo, extraSpace) {
  var target = objectOne.radius + objectTwo.radius;
  target = target + extraSpace || target;
  return ( Util.dist( objectOne.pos, objectTwo.pos ) <= target );
};
````
This function takes in two objects and an optional number called `extraSpace`. For now, `Game` is not going to care about the `extraSpace` option (used in the next section). If `objectOne` is the bird and `objectTwo` is an asteroid, `collisionCheck` will return true if the distance between the two objects' centers is less than or equal to the sum of their radii. In other words, if the two objects intersected/collided, the function will return true.

Ever time `Game` invokes `step`, it will check to see if the bird has collided with any of the asteroids in play. It will invoke `birdCollisionCheckAll` which iterates through all the asteroids in play and for each asteroid, invoke `collisionCheck` between that asteroid and the bird.

#### Aligning Asteroids
How does the game decide where to place new asteroids?

I did not want the game to just randomly select some point on the right side of the canvas and place a new asteroid their. I wanted to create something like a stream of asteroids on top and a stream on the bottom. This way we reduce the likelihood of events where it is impossible for the bird to not collide.

Here is where `collisionCheck`'s optional `extraSpace` come in. If you invoke this function and pass in two asteroids each with radius 75 and you also pass in 50 as `extraSpace`, `collisionCheck` will return true if the two asteroids are 200 pixels or less apart ( 75 + 75 + 50 ). In other words, the optional argument creates an extra physical barrier that cannot be crossed.

In the game, every half second, `Game` invokes `addAsteroid`.

```` javascript
Game.prototype.addAsteroid = function() {
  var asteroid = new Asteroid();
  var numOfAsteroids = this.asteroids.length;
  // this.asteroids is an array of asteroids that are in play
  if ( this.collisionCheck(asteroid, this.asteroids[numOfAsteroids - 1], 125) || ( numOfAsteroids >= 2 && Math.abs(asteroid.pos[1]-this.asteroids[numOfAsteroids - 2].pos[1]) > 200 ) ) {
    this.addAsteroid();
  } else {
    this.asteroids.push( asteroid );
  }
};
````
This function first creates a new asteroid. For now, it is not in play. It is merely a candidate. If the candidate asteroid is far enough from the last asteroid in play, we push the candidate asteroid into play. If it is too close, then we ignore it and recursively call `addAsteroid` until there is an asteroid candidate that passes the collision test. That asteroid will be pushed into `this.asteroids` or "put in play."
There are edge cases where a candidate asteroid is far enough from the last asteroid but still puts the bird in an impossible situation. To avoid this case, I added another test which looks to see if the candidate asteroid is "close" to the second-to-last asteroid in play. This tightens up the top and bottom asteroid streams and widens the bird's flying zone.
