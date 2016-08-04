# Bird-Splat

## Game Animation

## Pausing Game

## Moving Objects

### Bird

#### Bird Jump

### Asteroids

#### Collision Detection

```` javascript

Game.prototype.collideCheck = function(objectOne, objectTwo, extraSpace) {
  var target = objectOne.radius + objectTwo.radius;
  target = target + extraSpace || target;
  return ( Util.dist( objectOne.pos, objectTwo.pos ) <= target );
};

````

#### Aligning Asteroids
