var evens = [2,4,6,8,10],
    fives = [];

// Expression bodies
var odds = evens.map(v => v + 1);
var nums = evens.map((v, i) => v + i);

console.log(odds);
console.log(nums);

// Statement bodies
nums.forEach(v => {
  if (v % 5 === 0) fives.push(v);
});

// This is bound to its lexical enclosing scope's this
function thisBinding() {
  return () => console.log(this.string);
}

thisBinding.call({ string: 'bound' })();

// The same goes for arguments
function args() {
  return () => console.log(arguments);
}

args('arg1','arg2')();
