const Server = require('../server');

Server.start(process.env.HTTP_PORT, process.env.HTTPS_PORT);
