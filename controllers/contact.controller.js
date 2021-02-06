const {
  Types: { ObjectId },
} = require('mongoose');

const Joi = require('joi');
const Contact = require('../models/Contact');

async function listContacts(req, res) {
  const contacts = await Contact.find();
  res.json(contacts);
}
async function addContact(req, res) {
  try {
    const { body } = req;
    const contact = await Contact.create(body);
    res.status(201).send('Contact is added');
  } catch (error) {
    res.status(400).send(error);
  }
}
async function getContactById(req, res) {
  const {
    params: { contactId },
  } = req;

  const contactById = await Contact.findById(contactId);

  if (!contactById) {
    return res.status(400).send("Contact isn't found");
  }

  res.json(contactById);
}
async function updateContact(req, res) {
  const {
    params: { contactId },
  } = req;

  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!updatedContact) {
    return res.status(400).send("Contact isn't found");
  }
  res.send('Contact is updated');
}
async function removeContact(req, res) {
  const {
    params: { contactId },
  } = req;

  const removedContact = await Contact.findByIdAndDelete(contactId);

  if (!removedContact) {
    return res.status(400).send("Contact isn't found");
  }

  res.send('Contact is successfully deleted');
}

function validateId(req, res, next) {
  const {
    params: { contactId },
  } = req;

  if (!ObjectId.isValid(contactId)) {
    return res.status(400).send('Your id is not valid');
  }
  next();
}
function validateAddedContact(req, res, next) {
  const validationRules = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });
  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send('Missing required field');
  }

  next();
}
function validateUpdatedContact(req, res, next) {
  const validationRules = Joi.object()
    .keys({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    })
    .min(1);
  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send('Missing required field');
  }
  next();
}

module.exports = {
  listContacts,
  addContact,
  getContactById,
  updateContact,
  removeContact,
  validateId,
  validateUpdatedContact,
  validateAddedContact,
};
