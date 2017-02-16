/**
 * ES2017 introduces a special function type, async functions.
 * Inside these functions a special keyword `async` can be
 * used to wait for a promise to resolve. It is required that
 * the expression following the `await` keyword is resolved to
 * a Promise.
 *
 * In this example we use the fetch API (which returns Promise
 * objects) to load the current example javascript async from 
 * es6console.com
 */
async function getThisExample() {
    let response = await fetch('/examples/es2017/async-function.js');
    let text = await response.text();

    console.log(text);
}

getThisExample();