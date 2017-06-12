// When an async function is called, it returns a Promise. 
// When the async function returns a value, the Promise will 
// be resolved with the returned value.  When the async 
// function throws an exception or some value, the Promise will 
// be rejected with the thrown value.

// An async function can contain an await expression, that pauses 
// the execution of the async function and waits for the 
// passed Promise's resolution, and then resumes the async 
// function's execution and returns the resolved value.

function resolveAfter2Seconds(x) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(x);
    }, 2000);
  });
}

async function add1(x) {
  var a = resolveAfter2Seconds(20);
  var b = resolveAfter2Seconds(30);
  return x + await a + await b;
}

add1(10).then(v => {
  console.log(v);  // prints 60 after 2 seconds.
});

async function add2(x) {
  var a = await resolveAfter2Seconds(20);
  var b = await resolveAfter2Seconds(30);
  return x + a + b;
}

add2(10).then(v => {
  console.log(v);  // prints 60 after 4 seconds.
});