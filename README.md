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

#### Bird Jump

```` javascript
Bird.prototype.jump = function(e) {
  this.vel[1] = -5;
  this.inMidJump = true;
};
````
```` javascript
Bird.prototype.afterJump = function() {
  if ( this.vel[1] >= 0 ) {
    this.inMidJump = false;
    this.vel[1] = 5;
  }
  this.vel[1] += 0.25;
};
````
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
