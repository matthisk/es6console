var context$1$0 = regeneratorRuntime.mark(function context$1$0() {
  var x;

  return regeneratorRuntime.wrap(function context$1$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
    case 0:
      context$1$0.next = 2;
      return "foo";
    case 2:
      context$1$0.t0 = context$1$0.sent;
      x = 1 + context$1$0.t0;
      console.log(x);
    case 5:
    case "end":
      return context$1$0.stop();
    }
  }, context$1$0, this);
});

var fibonacci = {
  [Symbol.iterator]: regeneratorRuntime.mark(function callee$0$0() {
    var pre, cur, temp;

    return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        pre = 0, cur = 1;
      case 1:
        temp = pre;
        pre = cur;
        cur += temp;
        context$1$0.next = 6;
        return cur;
      case 6:
        context$1$0.next = 1;
        break;
      case 8:
      case "end":
        return context$1$0.stop();
      }
    }, callee$0$0, this);
  })
}

for (var n, t$0$0 = regeneratorRuntime.values(fibonacci), t$0$1; !(t$0$1 = t$0$0.next()).done; ) {
  n = t$0$1.value;
  // truncate the sequence at 1000
  if (n > 1000)
    break;
  print(n);
}
