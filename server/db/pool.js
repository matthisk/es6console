const pg = require('pg')
const url = require('url')
const debug = require('debug')('app:server:db')
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://localhost:5432/es6console' 

const params = url.parse(DATABASE_URL)
const auth = (params.auth || ':').split(':')

// create a config to configure both pooling behavior 
// and client options 
// note: all config is optional and the environment variables 
// will be read if the config is not present 
const config = {
  user: auth[0],
  database: params.pathname.split('/')[1],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  max: 10, // max number of clients in the pool 
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed 
};
 
 
//this initializes a connection pool 
//it will keep idle connections open for a 30 seconds 
//and set a limit of maximum 10 idle clients 
const pool = new pg.Pool(config);

pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool 
  // the pool itself will emit an error event with both the error and 
  // the client which emitted the original error 
  // this is a rare occurrence but can happen if there is a network partition 
  // between your application and the database, the database restarts, etc. 
  // and so you might want to handle it and at least log it out 
  debug('idle client error', err.message, err.stack)
})

module.exports = pool;