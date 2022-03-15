// RUn dev "dev": "set DATABASE_URL='postgres://user:pass@192.168.56.1:35432/db' && set NODE_ENV=development && set PORT=3000 && nodemon ./bin/start.js",

const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const clientSession = require("client-sessions");
const helmet = require("helmet");
const cors = require("cors");
const { SESSION_SECRET, ORIGIN } = require("./config");

const app = express();
const api = require("./src/api");
app.use(cors({ credentials: true, origin: ORIGIN }));
app.get("/", (request, response) => response.sendStatus(200));
app.get("/health", (request, response) => response.sendStatus(200));

app.use(morgan("short"));
app.use(express.json());

var http = require("http");
var https = require("https");
var privateKey = fs.readFileSync("./apikey/private.key", "utf8");
var certificate = fs.readFileSync("./apikey/certificate.crt", "utf8");
var credentials = { key: privateKey, cert: certificate };

app.use(
  clientSession({
    cookieName: "session",
    secret: SESSION_SECRET,
    duration: 24 * 60 * 60 * 1000,
    cookie: {
      sameSite: "none",
      ephemeral: false, // when true, cookie expires when the browser closes
      httpOnly: true, // when true, cookie is not accessible from javascript
      secure: false, // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
    },
  })
);
app.use(helmet());
app.use(api);

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

let server;
module.exports = {
  start(httpPort, httpsPort) {
    httpServer.listen(httpPort);
    httpsServer.listen(httpsPort);
    console.log(`App started http on port ${httpPort}`);
    console.log(`App started https on port ${httpsPort}`);
    return httpServer;
  },
  stop() {
    server.close();
  },
};
