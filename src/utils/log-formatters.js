export function stringify(obj) {
  return JSON.stringify(obj, function(key, value) {
    if (key !== '' && value === obj) { return {}; }
    return value;
  });
}

export function complexFormatter(...args) {
  let res = '';
  if (typeof args[0] === 'string' && args[0].search('%s') !== -1) {
    let s = args[0],
      search,
      i = 1;

    while (i < args.length && (search = s.search(/%s|%d|%i|%f/)) !== -1) {
      let replace = s[search] + s[search + 1];
      s = s.replace(replace, args[i]);
      i++;
    }
    res = s;
  } else {
    args.forEach(arg => {
      if (typeof arg === 'object') res += `${stringify(arg)} `;
      else {
        if (typeof arg === 'string') res += `"${arg}" `;
        else res += `${arg} `;
      }
    });
  }

  // Remove the trailing white space
  if (res[res.length - 1] === ' ') 
    return res.slice(0, -1);
  return res;
}
