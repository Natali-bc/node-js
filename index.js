const argv = require('yargs').argv;
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const contactRouter = require('./routes/contact.routes');
const {
  listContacts,
  removeContact,
  getContactById,
  addContact,
} = require('./contacts');
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

// function invokeAction({ action, id, name, email, phone }) {
//   switch (action) {
//     case 'list':
//       listContacts().then(el => console.table(el));
//       break;

//     case 'get':
//       getContactById(id).then(el => console.table(el));
//       break;

//     case 'add':
//       addContact(name, email, phone).then(el => console.table(el));
//       break;

//     case 'remove':
//       removeContact(id).then(el => console.table(el));
//       break;

//     default:
//       console.warn('\x1B[31m Unknown action type!');
//   }
// }

// invokeAction(argv);
