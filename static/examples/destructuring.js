// Destructuring assignment lets you extract values from an
// object or an array in a single assignment Expression or
// Statement. 

// list matching
var [a,,b] = [1,2,3];

console.log(a,b);

// Destructuring of a function parameter
function f( [a,b] ) {
  return a + b;
}

console.log( f[1,2] );

// Computed properties (see object literal) can also be used
// in object destructuring
var qux = "corge";
var { [qux] : corge } = { corge: "graphly" };

console.log( corge );

// Similar to function parameters, destructuring bindings can
// have a default value (used when the bound identifier does
// not exist in the target object or array, or when it is
// undefined)
var { a = '100' } = {b:0};
var [c,d,e = '100'] = [0,1];

console.log(a,e);
