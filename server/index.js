require('dotenv').config();

const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');
const { connectDatabase } = require('./database');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

start();

async function start() {
  await app.prepare();

  try {
    const server = express();
    const db = await connectDatabase();

    server.use(bodyParser.json());
    server.use('/api', require('./api')(db));

    server.get('*', (req, res) => handle(req, res));

    server.listen(process.env.PORT || 3000, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  } catch (e) {
    console.error(e.stack);
    process.exit(1);
  }
}
