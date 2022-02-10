// RUn dev "dev": "set DATABASE_URL='postgres://user:pass@192.168.56.1:35432/db' && set NODE_ENV=development && set PORT=3000 && nodemon ./bin/start.js",

const express = require('express');

const morgan = require('morgan');
const clientSession = require('client-sessions');
const helmet = require('helmet');
const  cors = require('cors')
const {SESSION_SECRET} = require('./config');

const app = express();
const api = require('./src/api');
app.use(cors())
app.get('/', (request, response) => response.sendStatus(200));
app.get('/health', (request, response) => response.sendStatus(200));

app.use(morgan('short'));
app.use(express.json());
app.use(
  clientSession({
    cookieName: 'session',
    secret: SESSION_SECRET,
    duration: 24 * 60 * 60 * 1000
  })
);
app.use(helmet());

app.use(api);

let server;
module.exports = {
  start(port) {
    server = app.listen(port, () => {
      console.log(`App started on port ${port}`);
    });
    return app;
  },
  stop() {
    server.close();
  }
};
