const massive = require('massive');
const axios = require('axios');

require('dotenv').config();

run();

async function run() {
  try {
    const db = await connectDatabase();
    await createTables(db);
    process.exit();
  } catch (error) {
    console.error('Error during import.');
    console.log(error);
  }
}

async function connectDatabase() {
  return massive({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
  });
}

async function createTables(db) {
  return await db.query(`
    DROP TABLE IF EXISTS terms;
    CREATE TABLE terms (
      id serial primary key,
      code varchar(8) not null,
      name varchar(64) not null
    );

    DROP TABLE IF EXISTS courses;
    CREATE TABLE courses (
      id serial primary key,
      code varchar(16) not null,
      subject varchar(8) not null,
      number varchar(8) not null,
      title varchar(256) not null,
      description text not null
    );
  `);
}
