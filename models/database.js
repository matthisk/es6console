var pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgress://localhost:5432/es6console';

var client = new pg.Client(connectionString);
client.connect();

var query = client.query('CREATE TABLE snippets(id char(8) PRIMARY KEY, code VARCHAR(1024) not null)');
query.on('end', function() { client.end(); });
