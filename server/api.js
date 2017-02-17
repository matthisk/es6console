const debug = require('debug')('app:server:api')
const pool = require('./db/pool')
const errors = require('./db/errors')

function deferred() {
  let resolve, reject;

  let promise = new Promise(function(res, rej) {
    resolve = res;
    reject = rej;
  });

  return [promise, resolve, reject];
}

function saveSnippet(req) {
  const [promise, resolve, reject] = deferred();

  const now = Date.now()
  const id = parseInt(now, 10).toString(36)

  if (req.body) {
    var code = req.body.code;

    pool.connect(function(err, client, done) {
      if (err) {
        debug('Error fetching client from pool', err);
        reject('Error with database connection');
        return
      }

      var query = client.query({
        name: 'save snippet',
        text: 'INSERT INTO snippets(id,code) values($1,$2)',
        values: [id, code],
      });

      query.on('error', function(error) {
        done();
        debug('Unable to save snippet with error:', error);
        reject('unable to save snippet');
      });

      query.on('end', function() {
        resolve({
          saved: true,
          id: id
        });
        done();
      });
    });
  } else {
    reject('Unable to parse body');
  }

  return promise;
}

function getSnippet(req) {
  const [promise, resolve, reject] = deferred();
  const id = req.params.id

  if (id) {
    var code;

    pool.connect(function(err, client, done) {
      if (err) {
        debug('Error fetching client from pool', err);
        reject('Error with database connection');
        return;
      }

      var query = client.query({
        name: 'get code snippet',
        text: 'SELECT code FROM snippets WHERE id = $1',
        values: [id],
      });

      query.on('row', function(row) {
        code = row.code;
      });

      query.on('error', function(error) {
        done();
        debug('Unable to retrieve snippet with id:', id, 'with error:', error);
        reject('unable to retrieve snippet with id: ' + id);
      });

      query.on('end', function(result) {
        if (code === undefined) {
          debug('Snippet not found');
          reject(new errors.DoesNotExist());
        } else {
          resolve(code);
        }
        done();
      });

    });
  } else {
    reject('unable to parse url: ' + req.url);
  }

  return promise;
}

module.exports = {
  snippet: {
    get: getSnippet,
    save: saveSnippet
  }
};