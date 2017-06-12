// JavaScript already has several looping constructs
// ES6 introduces a new type of loop the for-of loop.
// This loop iterates over Iterable objects (e.g. Array,
// Map, Set, arguments).
let fibonacci = {
  [Symbol.iterator]() {
    let pre = 0, cur = 1;
    return {
      next() {
        [pre, cur] = [cur, pre + cur];
        return { done: false, value: cur }
      }
    }
  }
}

// With the for of loop we can loop over an iterators values
for (var n of fibonacci) {
  // truncate the sequence at 1000
  if (n > 1000)
    break;
  console.log(n);
}

// The for of loop also works on array literals
for(var x of [1,2,3,4,5,6,7,8,9,10]) {
  console.log(x);
}
