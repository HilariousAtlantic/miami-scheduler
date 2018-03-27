const massive = require('massive');

require('dotenv').config();

exports.default = {
  connectDatabase: async function() {
    const db = await massive({
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD
    });
    return db.reload();
  }
};
