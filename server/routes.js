const project = require('../config/project.config')
const debug = require('debug')('app:server:routes')
const fs = require('fs')
const express = require('express')
const api = require('./api')
const errors = require('./db/errors')
const path = require('path')

function promisify(fn) {
  return (...args) => 
    new Promise((resolve, reject) => 
      fn(...args, (err, ...rest) => {
        if (err) reject(err);
        else resolve(rest.length == 1 ? rest[0] : rest);
      })
    )
}

const readdir = promisify(fs.readdir);
const fsstat = promisify(fs.stat);

function readFolder(folder) {
  return readdir(folder)
    .then(files => [path.basename(folder), files]);
}

function getExamples(req, res) {
  const pth = project.paths.public('examples');

  readdir(pth)
    .then(function(names) {
      names = names.map(n => path.join(pth, n));

      return Promise.all(names.map(f => fsstat(f)))
        .then(fld => fld.map(f => f.isDirectory()))
        .then(folders => {
          return names.filter((name, index) => folders[index])
        })
        .then(folders => {
          return Promise.all(folders.map(readFolder))
        });
    })
    .then(results => {
      let ex = {};

      results.forEach(([folder, files]) => ex[folder] = files);

      return res.json({
        examples: ex,
      });
    })
    .catch(err => {
      debug('Error while loading examples', err);

      res.json({
        error: 'unable to locate examples',
      });
    });
}

function getThemes(req, res) {
  const path = project.paths.base('node_modules',
                  'codemirror',
                  'theme');

  fs.readdir(path, function(err, files) {
    if (err) {
      return res.json({
        error: 'unable to locate themes',
      });
    }

    files = files.map(function(file) {
      return /^([^.]+)\.css$/.exec(file)[1];
    });

    return res.json({
      themes: files,
    });
  });
}

function createRoutes(app) {
  const themesPath = project.paths.base('node_modules', 'codemirror', 'theme');

  app.use('/codemirror/themes/', express.static(themesPath));
  app.get('/api/examples/', getExamples);
  app.get('/api/themes/', getThemes);

  app.get('/api/snippet/:id/', function(req, res) {
    api.snippet.get(req)
      .then(function(code) {
        res.json({ snippet: code });
      }, function(err) {
        if (err instanceof errors.DoesNotExist) {
          res.status(404).send();
        } else {
          res.status(500).send(err);
        }
      });
  });

  app.post('/api/snippet/save/',function(req,res) {
    api.snippet.save(req)
      .then(function(obj) {
        res.json(obj);
      }, function(err) {
        res.status(500).send(err);
      });
  });
}

module.exports = createRoutes;