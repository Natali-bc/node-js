const argv = require('yargs').argv;
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const contactRouter = require('./routes/contact.routes');

const PORT = process.env.port || 8080;

class Server {
  constructor() {
    this.server = null;
  }
  start() {
    this.server = express();
    this.initMiddleWares();
    this.initRoutes();
    this.listen();
  }

  initMiddleWares() {
    this.server.use(express.json());
    this.server.use(
      cors({
        origin: '*',
      }),
    );
  }
  initRoutes() {
    this.server.use('/api/contacts', contactRouter);
  }
  listen() {
    this.server.listen(PORT, () => {
      console.log('Server is listening on port: ', PORT);
    });
  }
}

const server = new Server();
server.start();
