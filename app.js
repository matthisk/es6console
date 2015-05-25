var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    PORT = 3000,
    pg = require('pg'),
    connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/es6console';

app.use('/node_modules', express.static('node_modules'));
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/static/index.html');
});

app.get(/^\/\w+\/$/, function(req, res) {
  res.sendFile(__dirname + '/static/index.html');
});

app.get(/^\/\w+$/, function(req, res) {
  res.redirect(req.url + '/');
});

app.get(/^\/snippets\/\w+$/, function(req, res) {
  var id = req.url.split('/').pop();

  if( id ) {
    var code = '';

    pg.connect(connectionString, function(err, client, done) {
      var query = client.query('SELECT code FROM snippets WHERE id = $1',[id]);

      query.on('row',function(row) { code = row.code; });
 
      query.on('error', function(error) {
        res.json({ error : 'unable to retrieve snippet with id: ' + id });
      });

      query.on('end', function(result) {
        res.json({ code:code });
      });
    });
  } else {
    res.json({ error: 'unable to parse url' });
  }
});

app.post('/save',function(req,res) {
  var now = Date.now(),
      id = parseInt(now,10).toString(36);

  if(req.body) {
    var code = req.body.code;
    
    pg.connect(connectionString, function(err, client, done) {
      var query = client.query('INSERT INTO snippets(id,code) values($1,$2)',[id,code]);

      query.on('end',function() {
        client.end();
        return res.json({ saved: true, id: id });
      });

      if(err) console.log(err);
    });
  } else {
    res.json({ saved: false });
  }
});

app.listen(PORT);
