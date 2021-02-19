const {
  Types: { ObjectId },
} = require('mongoose');

const Joi = require('joi');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Avatar = require('avatar-builder');
const User = require('../models/User');

dotenv.config();

async function createUser(req, res) {
  try {
    const { body } = req;
    const hashedPassword = await bcrypt.hash(body.password, 14);

    const avatar = Avatar.catBuilder(128);
    avatar.create('gabriel').then(buffer => {
      fs.writeFileSync('`tmp/${Date.now()}.png`', buffer);
    });
    minifyImage();
    const userAvatar = `http://locahost:8080/images/${Date.now()}.png`;
    const user = await User.create({
      ...body,
      password: hashedPassword,
      token: null,
      avatarUrl: userAvatar,
    });
    const { email, subscription, avatarUrl } = user;

    res.status(201).json({
      user: {
        email: email,
        subscription: subscription,
        avatarUrl: avatarUrl,
      },
    });
  } catch (error) {
    res.status(409).send('Email in use');
  }
}

async function loginUser(req, res) {
  const {
    body: { email, password },
  } = req;

  const user = await User.findOne({
    email,
  });
  if (!user) {
    return res.status(401).send('Email or password is wrong');
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).send('Email or password is wrong');
  }
  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
  );

  await User.findByIdAndUpdate(user._id, { token: token });

  const { subscription } = user;
  return res.status(200).json({
    token: token,
    user: {
      email: email,
      subscription: subscription,
    },
  });
}

async function authorize(req, res, next) {
  const authorizationHeader = req.get('Authorization');

  if (!authorizationHeader) {
    return res.status(401).send('Not authorized');
  }
  const token = authorizationHeader.replace('Bearer ', '');
  try {
    const payload = await jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = payload;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).send('Not authorized');
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send('Not authorized');
  }
}

async function logoutUser(req, res) {
  const { _id } = req.user;
  const userById = await User.findByIdAndUpdate(_id, { token: null });

  if (!userById) {
    return res.status(401).send('Not authorized');
  }

  return res.status(204).send('No content');
}

async function getCurrentUser(req, res) {
  const {
    user: { email, subscription },
  } = req;
  return res.status(200).send({ email: email, subscription: subscription });
}

function validateUserInfo(req, res, next) {
  const validationRules = Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
    subscription: Joi.string().default('free').valid('free', 'pro', 'premium'),
  });
  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error);
  }

  next();
}

module.exports = {
  createUser,
  loginUser,
  authorize,
  logoutUser,
  getCurrentUser,
  validateUserInfo,
};
