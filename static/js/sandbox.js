export default class SandBox {
  constructor( cnsl ) {
    this.cnsl = cnsl;
    var body = document.getElementsByTagName('body')[0];
    this.frame = document.createElement('iframe');
    body.appendChild(this.frame);
    // Overwrite the console log function of the sandbox to write results
    // to our own console.
    this.frame.contentWindow.console.log = this.log.bind(this);
  }

  runCode( code ) {
    let result;
    try {
      result = this.frame.contentWindow.eval( code );
    } catch( e ) {
      return this.cnsl.writeError( e );
    }
    this.cnsl.writeLine( result );
  }

  log( ...args ) {
    let res = '';
    if( typeof args[0] === 'string' && args[0].search("%s") !== -1) {
      let s = args[0],
          search,
          i = 1;

      while( i < args.length && (search = s.search(/%s|%d|%i|%f]/)) !== -1 ) {
        let replace = s[search] + s[search+1];
        s = s.replace(replace,args[i]);
        i++;
      }

      res = s;
    } else {
      args.forEach(arg => {
        if( typeof arg === 'object' ) res += `${JSON.stringify(arg)} `;
        else res += `${arg} `;
      });
    }

    this.cnsl.writeLine( `[log] ${res}` ); 
  }
}
