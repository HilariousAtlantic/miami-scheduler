const axios = require('axios');
const { connectDatabase } = require('./database');

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
      term varchar(8) not null,
      code varchar(16) not null,
      subject varchar(8) not null,
      number varchar(8) not null,
      title varchar(256) not null,
      description text not null
    );
  `);
}
