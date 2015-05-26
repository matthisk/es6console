import Q from 'q';

function encodeBody( data ) {
  var body = '';

  for( let k in data ) {
    body += `&${k}=${encodeURIComponent( data[k] )}`; 
  }

  return body.slice(1, body.length);
}

export default function ajax({ type, url, data }) {
  var deferred = Q.defer(),
      req = new XMLHttpRequest(),
      body = encodeBody( data );

  req.open(type, url, true);   
  if( type === 'POST' ) {
    req.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
  }

  req.onreadystatechange = () => {
    if( req.readyState == 4 ) {
      if (req.status == 200 ) {
        deferred.resolve( JSON.parse( req.responseText ) );
      } else {
        deferred.reject(new Error(req.responseText));
      }
    } 
  };

  req.send( body );
  return deferred.promise;
}
