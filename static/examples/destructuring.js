// list matching
var [a,, b] = [1,2,3];
var [dick,pic] = 10;

function desDef( [a,b] = [1,2] ) {
  return a + b;
}

var qux = "corge";
var { [qux] : corge } = { corge: "graphly" };
var { "corge" : aap } = { corge: "graphly" };
function a( [x,rest] ) {
  return rest;
}

function ff( [ a, [ b, c, [d,f,g] ], ...rest ]) {
  console.log( a + b + c );
}

function fff( [] ) {
  var x = 10, y = 12;
  [x,y] = [y,x];
  for( var i = 0; i < 100; [j,i] = [i,i+1] )
    console.log(i);
  return [x,y] = [y,x];
}

[a,b] = [c,d] = [1,2];

// eobject matching
var { op: a, lhs: { op: b }, rhs: c }
       = getASTNode()

// object matching shorthand
// binds `op`, `lhs` and `rhs` in scope
var {op, lhs, rhs} = getASTNode()

// Can be used in parameter position
function g({name: x}) {
  console.log(x);
}
function gg( [ a, b, ...c ] ) {
  console.log( a );
}
g({name: 5})

// Fail-soft destructuring
var [a] = [];
a === undefined;

// Fail-soft destructuring with defaults
var [a = 1] = [];
a === 1;
