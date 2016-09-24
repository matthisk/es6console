var Q = require('q'),
    pg = require('pg'),
    connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/es6console';

function saveSnippet(req) {
  var now = Date.now(),
      id = parseInt(now,10).toString(36),
      deferred = Q.defer();

  if(req.body) {
    var code = req.body.code;

    pg.connect(connectionString, function(err, client, done) {
      if(err) {
        console.error('Error fetching client from pool', err);
        deferred.reject('Error with database connection');
        return
      }

      var query = client.query('INSERT INTO snippets(id,code) values($1,$2)',[id,code]);

      query.on('error', function(error) {
        done();
        console.error('Unable to save snippet with error:', error);
        deferred.reject('unable to save snippet');
      });

      query.on('end',function() {
        done();
        client.end();
        deferred.resolve({ saved: true, id: id });
      });
    });
  } else {
    deferred.reject('Unable to parse body');
  }

  return deferred.promise;
}

function getSnippet(req) {
  var id = req.params.id,
      deferred = Q.defer();

  if( id ) {
    var code = '';

    pg.connect(connectionString, function(err, client, done) {
      if(err) {
        console.error('Error fetching client from pool', err);
        deferred.reject('Error with database connection');
        return;
      }

      var query = client.query('SELECT code FROM snippets WHERE id = $1',[id]);

      query.on('row',function(row) { code = row.code; });

      query.on('error', function(error) {
        done();
        console.error('Unable to retrieve snippet with id:', id, 'with error:', error);
        deferred.reject('unable to retrieve snippet with id: ' + id);
      });

      query.on('end', function(result) {
        done();
        deferred.resolve(code);
      });
    });
  } else {
    deferred.reject('unable to parse url: ' + req.url);
  }

  return deferred.promise;
}

module.exports = {
  snippet : {
    get:getSnippet,
    save:saveSnippet
  }
};
