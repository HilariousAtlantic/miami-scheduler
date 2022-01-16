const axios = require('axios');
const { connectDatabase } = require('./database');

run();

async function run() {
  try {
    const db = await connectDatabase();
    console.log('Creating tables...');
    await createTables(db);
    console.log('Tables created');
    process.exit();
  } catch (error) {
    console.error('Error during import.');
    console.log(error);
  }
}

async function createTables(db) {
  return await db.query(`
    CREATE TABLE IF NOT EXISTS terms (
      id serial primary key,
      code varchar(8) not null,
      name varchar(64) not null
    );

    CREATE TABLE IF NOT EXISTS courses (
      id serial primary key,
      term varchar(8) not null,
      code varchar(16) not null,
      subject varchar(8) not null,
      number varchar(8) not null,
      title varchar(256) not null,
      description text not null,
      searchables text not null
    );

    CREATE TABLE IF NOT EXISTS donations (
      id serial primary key,
      name varchar(32) not null,
      amount decimal not null
    );
  `);
}
