// When an argument is not passed (or passed as undefined)
// in a function call the default value
function f(x, y=12) {
  // y is 12 if not passed (or passed as undefined)
  return x + y;
}

console.log( f(3) );

// The remaining passed arguments can be bound through the rest argument (...)Id
function g(x, ...y) {
  // y is an Array
  return x * y.length;
}

console.log( g(3, "hello", true) );

function h(x, y, z) {
  return x + y + z;
}

// The spread operator can be used to pass each 
// element of an array as a separate argument
console.log( h(...[1,2,3],4,5,6) );
// The spread operator can also be used with Strings
console.log( Math.max( ..."1234" ) );
