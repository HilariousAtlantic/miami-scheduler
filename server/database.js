db = require('../database.json')

const massive = require('massive');
const mysql = require('mysql2');

module.exports = {
  connectDatabase() {
    return mysql.createConnection({
      multipleStatements: true,
      host: db.host,
      database: db.name,
      user: db.user,
      password: db.password
    });
  }
};
