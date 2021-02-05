// const argv = require('yargs').argv;
// const cors = require('cors');
// const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const contactRouter = require('./routes/contact.routes');

dotenv.config();

const PORT = process.env.PORT || 8080;

start();

function start() {
  const app = initServer();
  connectMiddlewares(app);
  declareRoutes(app);
  connectToDb();
  listen(app);
}
function initServer() {
  return express();
}

function connectMiddlewares(app) {
  app.use(express.json());
}
function declareRoutes(app) {
  app.use('/api/contacts', contactRouter);
}

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      userNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connection successful');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
}
function listen(app) {
  app.listen(PORT, () => {
    console.log('Server is listening on port', PORT);
  });
}
// class Server {
//   constructor() {
//     this.server = null;
//   }
//   start() {
//     this.server = express();
//     this.initMiddleWares();
//     this.initRoutes();
//     this.listen();
//   }

//   initMiddleWares() {
//     this.server.use(express.json());
//     this.server.use(
//       cors({
//         origin: '*',
//       }),
//     );
//   }
//   initRoutes() {
//     this.server.use('/api/contacts', contactRouter);
//   }
//   listen() {
//     this.server.listen(PORT, () => {
//       console.log('Server is listening on port: ', PORT);
//     });
//   }
// }

// const server = new Server();
// server.start();
