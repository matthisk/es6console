// ES6 introduces a new type of function, the generator function
// these functions do not have normal control flow of input and
// return. The 'yield' expression can be used to pause the function
// an emit an intermediate result. The function can be reentered
// where it left off with last yield expression.
// Want to read more about generators visit:
//  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
var fibonacci = {
  [Symbol.iterator]: function*() {
    var pre = 0, cur = 1;
    for (;;) {
      var temp = pre;
      pre = cur;
      cur += temp;
      yield cur;
    }
  }
}

// Generators can be used in coherence with iterators so
// they can be looped over by a for-of loop
for (var n of fibonacci) {
  // truncate the sequence at 1000
  if (n > 1000)
    break;
  console.log(n);
}

function *generator() {
  return (yield (yield 10) + 'world');
}

var gen = generator();

// The argument supplied to generator.next is fed into the generator
// on reentering (at the position of the last yield expression
console.log(gen.next('hello').value);
console.log(gen.next(0).value);
console.log(gen.next().value);

// Generators can be composed with the use of the yield* expression
function *compose() {
  yield* generator();
}

console.log(compose().next().value);
