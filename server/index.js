const express = require('express');
const next = require('next');

require('dotenv').config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

start();

async function start() {
  await app.prepare();

  try {
    const server = express();

    server.get('*', (req, res) => handle(req, res));

    server.listen(3000, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  } catch (e) {
    console.error(e.stack);
    process.exit(1);
  }
}
