# Bird-Splat

## Game Animation

## Pausing Game

## Moving Objects

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
This function, does two things. First, it resets the bird's velocity in the opposite direction. After `jump` is invoked, the velocity vector becomes [0,-5] (the bird moves up 5 pixels every 1/60th of a second). The second thing the `jump` function does is that it turns on a `inMidJump` switch which will let the `Game` object know to invoke the `afterJump` function.
```` javascript
Bird.prototype.afterJump = function() {
  if ( this.vel[1] >= 0 ) {
    this.inMidJump = false;
    this.vel[1] = 5;
  }
  this.vel[1] += 0.25;
};
````
The idea behind this function is the bird cannot move upwards forever after flapping one time; the bird's upward velocity must gradually drop to 0 and then revert back to its default falling velocity. Once the bird's velocity reaches 0, `afterJump` will turn the `inMidJump` switch off, telling `Game` to not invoke it again until `jump` is invoked.

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
This function takes in two objects and an optional number called `extraSpace`. For now, `Game` is not going to care about the `extraSpace` option (used in the next section). If `objectOne` is the bird and `objectTwo` is an asteroid, `collisionCheck` will return true if the distance between the two objects' centers is less than or equal to the sum of their radii. In other words, if the two objects intersected/collided and the function will return true.

Ever time `Game` invokes `step`, it will check to see if the bird has collided with any of the asteroids in play. It will invoke `birdCollisionCheckAll` which iterates through all the asteroids in play and for each asteroid, invokes `collisionCheck`, passing in the bird and that asteroid.

#### Aligning Asteroids
How does the game decide where to place new asteroids?

I did not want the game to just randomly select some point on the right side of the canvas and place a new asteroid their. I wanted to create something like a stream of asteroids on top and a stream on the bottom. This way we reduce the likelihood of events where it is impossible for the bird to not collide.

Here is where `collisionCheck`'s optional `extraSpace` come in. If you invoke this function and pass in two asteroids each with radius 75 and you also pass in 50 as `extraSpace`, `collisionCheck` will return true if the two asteroids are 200 pixels apart. In other words, the optional argument creates an extra physical barrier that cannot be crossed. In the game, every half second, `Game` invokes `addAsteroid`.

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
This function first creates a new asteroid. For now, it is not in play. It's merely a candidate. If the candidate asteroid is far enough from the last asteroid in play, we push the new asteroid into play. If it is too close, then we ignore it and recursively call `addAsteroid` until there is an asteroid candidate that passes the collision test. That asteroid will be pushed into `this.asteroids` or "put in play." The `extraSpace` creates a safe zone for the bird to fly in with asteroids flying around above and below the bird. There are edge cases where a candidate is far enough from the last asteroid but still puts the bird in ann impossible situation. To avoid this case, I added another test which demands that the candidate is "close" to the second to the last asteroid in play. this tightens up the top and bottom asteroid streams.
