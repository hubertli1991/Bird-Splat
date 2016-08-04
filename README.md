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
This function, does two things. First, it resets the bird's velocity in the opposite direction. After `jump` is invoked, the velocity vector becomes [0, -5] (the bird moves up 5 pixels every 1/60th of a second).
The second thing the `jump` function does is that it turns on a `inMidJump` switch which will let the `Game` object know to invoke the `afterJump` function.
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

#### Collision Check

```` javascript
Game.prototype.collisionCheck = function(objectOne, objectTwo, extraSpace) {
  var target = objectOne.radius + objectTwo.radius;
  target = target + extraSpace || target;
  return ( Util.dist( objectOne.pos, objectTwo.pos ) <= target );
};
````
#### Aligning Asteroids
