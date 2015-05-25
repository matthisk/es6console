/*
 *  Copyright 2015 Matthisk Heimensen 
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
var express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    PORT = process.env.PORT || 3000,
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
