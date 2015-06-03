function f(x, y=12) {
  // y is 12 if not passed (or passed as undefined)
  return x + y;
}
f(3) == 15

function f(x, ...y) {
  // y is an Array
  return x * y.length;
}
f(3, "hello", true) == 6

function f(x, y, z) {
  return x + y + z;
}
// Pass each elem of array as argument
f(...[1,2,3],4,5,6) == 6
f.apply( undefined, ...[1,2,3] );
f.update( 1, ...xs, 2 );
f.g.update( ...[1,2,3] );
f(1,...[2],3);
f().g(...[1,2,3]);
(f + f)(...[1,2,3]);
f.g.h()(...[1,2,3]);
f.g.h[1](...[1,2,3]);
Math.max( ..."1234" );
Math.max( ...f );

// This will result in buggy code when the transformation is not hygenic
function f(x, ...argumentss) {
	return x * argumentss.length;
}

function g() {

  var ys = [2,3,4];
  var xss = [1, ...ys, 5];
  var xs = [1, ...ys, 5, [...ys]];
}
