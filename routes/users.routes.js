const { Router } = require('express');
const UserController = require('../controllers/users.controller');
const multer = require('multer');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.png`);
  },
});

const upload = multer({ storage });

async function minifyImage(req, res, next) {
  const files = await imagemin(
    [`${req.file.destination}/${req.file.filename}`],
    {
      destination: 'public/images',
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    },
  );
  next();
}

router.post(
  '/auth/register',
  UserController.validateUserInfo,
  UserController.createUser,
);
router.post(
  '/auth/login',
  UserController.validateUserInfo,
  UserController.loginUser,
);
router.post(
  '/auth/logout',
  UserController.authorize,
  UserController.logoutUser,
);
router.get(
  '/users/current',
  UserController.authorize,
  UserController.getCurrentUser,
);
router.patch(
  '/users/avatars',
  UserController.authorize,
  upload.single('avatar'),
  minifyImage,
  UserController.updateUserData,
);

module.exports = router;
