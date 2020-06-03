const mysql = require('mysql');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'cabernet',
});

const query = (statement, params) => new Promise((resolve, reject) => {
  const q = connection.query(statement, params, (e, r) => {
    if (e) {
      console.error(q.sql)
      reject(e);
    }
    if (r.length > 0) {
      resolve(r);
    } else {
      resolve(null);
    }
  });
});


module.exports = {
  connection,
  query,
};
