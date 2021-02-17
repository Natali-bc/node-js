const { Router } = require('express');
const UserController = require('../controllers/users.controller');

const router = Router();

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

module.exports = router;
