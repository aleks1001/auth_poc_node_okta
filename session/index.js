const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { connection } = require('../db');

const options = {
  connectionLimit: 10,
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'cabernet',
  clearExpired: true,
  checkExpirationInterval: 90000,
  createDatabaseTable: true,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires_in',
      data: 'session_data',
    },
  },
};

module.exports = new MySQLStore(options, connection);
