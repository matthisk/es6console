// Declaration declared through 'var' are hoisted and function
// scoped. Variables declared through either 'let' or 'const'
// are block-scoped an not available in the temporal dead-zone.

function f() {
  let x = 'n';
  {
    // okay, block scoped name
    const x = "sneaky";
  }

  console.log(x);
}

f();
