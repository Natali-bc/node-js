const contacts = require('../models/contacts.json');
const Joi = require('joi');

class ContactController {
  listContacts(req, res) {
    res.json(contacts);
  }
  addContact(req, res) {
    const { body } = req;
    const addedContact = {
      ...body,
      id: contacts.length + 1,
    };
    contacts.push(addedContact);
    res.json(addedContact);
  }
  validateAddedContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });
    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    next();
  }
}

module.exports = new ContactController();
