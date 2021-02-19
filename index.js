const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const multer = require('multer');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const contactRouter = require('./routes/contacts.routes');
const userRouter = require('./routes/users.routes');

dotenv.config();

const PORT = process.env.PORT || 8080;

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'tmp/');
//   },
//   filename: function (req, file, cb) {
//     const { ext } = path.parse(file.originalname);
//     cb(null, `${Date.now()}${ext}`);
//   },
// });

// const upload = multer({ storage });

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

  // app.post('/profile', upload.single('avatar'), minifyImage, (req, res) => {
  //   res.send({ file: req.file, ...req.body });
  // });

  async function minifyImage(req, res, next) {
    const files = await imagemin('tmp/', {
      destination: 'public/images/',
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });
    next();
  }
}
