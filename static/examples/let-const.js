function f() {
  {
    let x;
    {
      // okay, block scoped name
      const x = "sneaky";
    }
  }
}

let bar = 123;
{
	let bar = 456;
	{
		let bar = 789;
	}
}
bar === 123;

function tempDeadZone() {
  var passed = (function() { try { qux; } catch(e) { return true; } })();
  let qux = 123;
  return passed;
}

for (let i = 0; i< 10; i++) {
  for (let i = 0; i < 10; i++) {
    for (let i = 0; i < 10; i++) {
      console.log(i)
    }
  } 
}

function g() {
  {
    let x = 10;
  }
  return x;
}
