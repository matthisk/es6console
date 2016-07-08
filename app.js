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
// if( process.env.NODE_ENV === 'production' ) var newrelic = require('newrelic');

var express = require('express'),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    swig = require('swig'),
    api = require('./api'),
    app = express(),
    PORT = process.env.PORT || 3000;

// if( process.env.NODE_ENV === 'production' ) app.locals.newrelic = newrelic;

app.engine('html', swig.renderFile);
app.set('view engine','html');
app.set('views',__dirname + '/views');

if( process.env.NODE_ENV !== 'production' ) {
  app.set('view cache', false);
  swig.setDefaults({ cache: false });
}

app.use('/node_modules', express.static('node_modules'));
app.use(express.static('static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/examples/', function(req, res) {
  fs.readdir(__dirname + '/static/examples',function(err,files) {
    if(err) return res.json({ error: 'unable to locate examples' });
    
    return res.json({ examples: files }); 
  });
});

app.get('/:id/', function(req, res) {
  api.snippet.get(req)
    .then(function(code) {
      res.render('index',{ snippet: code });
    }).fail(function(err) {
      res.status(500).send(err);
    });
});

app.get(/^\/\w+$/, function(req, res) {
  res.redirect(req.url + '/');
});

app.get('/snippets/:id/', function(req, res) {
  api.snippet.get(req)
    .then(function(code) {
      res.json({ code: code });
    }).fail(function (err) {
      res.status(500).send(err);
    });
});

app.post('/save',function(req,res) {
  api.snippet.save(req)
    .then(function(obj) {
      res.json(obj);
    }).fail(function(err) {
      res.status(500).send(err);
    });
});

app.listen(PORT);
