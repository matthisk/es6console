// Promises have been the standard for async programming
// with ES6 they are integrated in the standard library and
// we no longer need external libraries to implement them
function timeout(duration = 0) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    })
}

var p = timeout(1000).then(() => {
    return timeout(2000);
}).then(() => {
    console.log("then");
    throw new Error("hmm");
}).catch(err => {
    console.log(err);
    return Promise.all([timeout(100), timeout(200)]);
})
