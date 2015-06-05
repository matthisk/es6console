// Recursive tail-calls can fill the stack rapidly while
// it is possible to optimize this call. ES6 introduces
// such a tail-call optimization
function factorial(n, acc = 1) {
    'use strict';
    if (n <= 1) return acc;
    return factorial(n - 1, n * acc);
}

// Stack overflow in most implementations today,
// but safe on arbitrary inputs in eS6
console.log( factorial(100000) );
