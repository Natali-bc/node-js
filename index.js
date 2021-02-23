const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const contactRouter = require('./routes/contacts.routes');
const userRouter = require('./routes/users.routes');

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
  app.use('/images', express.static('public/images'));
}
function declareRoutes(app) {
  app.use('/api/contacts', contactRouter);
  app.use('/', userRouter);
}

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      userNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
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
