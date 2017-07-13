export function complexFormatter(...args) {
  let res = '';
  if (typeof args[0] === 'string' && args[0].search('%s') !== -1) {
    let s = args[0],
      search,
      i = 1;

    while (i < args.length && (search = s.search(/%s|%d|%i|%f]/)) !== -1) {
      let replace = s[search] + s[search + 1];
      s = s.replace(replace, args[i]);
      i++;
    }
    res = s;
  } else {
    args.forEach(arg => {
      if (typeof arg === 'object') res += `${JSON.stringify(arg)} `;
      else res += `${arg} `;
    });
  }
  return res;
}