

// Breaking the this binding for Babel (and possibly other transpilers)
function breakIt() {
  var __slice = Array.prototype.slice;

  var extendWithFunc = function (fn, obj) {
    return fn.apply(obj, __slice.call(arguments, 2));
  };

  var myExtend = () => {
    this.newData = __slice.call(arguments, 0);
    return this;
  };

  //this will add to the global object NOT the object you expect
  //more importantly, it will run one way after Babel compilation
  //and another way in FF with real ES6 scoping rules
  var newObj = extendWithFunc(myExtend, {some: "object"}, "a", "b", "c");
}

// Expression bodies
var odds = evens.map(function (v) {
  return v + 1;
});
var nums = evens.map(function (v, i) {
  return v + i;
});

// Statement bodies
nums.forEach(function (v) {
  if (v % 5 === 0) fives.push(v);
});

function blaat() {
  f = x => {
    console.log( this );
  }

  fb = f.bind( {} );
  fa = f.apply( {}, [] );
}

// Lexical this
var bob = {
  _name: "Bob",
  _friends: [],
  printFriends: function printFriends() {
    var _this2 = this;
    var _this = "blaat";
    this._friends.forEach(function (f) {
      return console.log(_this2._name + " knows " + f);
    });
  },
  
  testThis : x => {
    console.log( this );
  },

  testArgs : a => {
  	var args = arguments;
  	console.log( a );
  }
};
