const contacts = require('../models/contacts.json');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const contactsPath = path.join('../models/contacts.json');

class ContactController {
  listContacts(req, res) {
    res.json(contacts);
  }
  notfoundContct(contactId, res) {
    const contact = contacts.find(el => el.id === contactId);
    if (!contact) {
      return res.status(404).send({ message: 'Not found' });
    }
  }
  addContact(req, res) {
    const { body } = req;
    const addedContact = {
      id: uuidv4(),
      ...body,
    };
    contacts.push(addedContact);
    fs.writeFile(contactsPath, JSON.stringify(contactsPath));
    res.status(200).send({ message: 'new contact' });
  }
  validateAddedContact(req, res, next) {
    const validationRules = object().keys({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });
    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).send({ message: 'missing required name field' });
    }

    next();
  }
  findContactIndex = id => {
    const contactId = parseInt(id);
    return contacts.findIndex(({ id }) => id === contactId);
  };
  updateContact = (req, res) => {
    const {
      params: { id },
    } = req;

    const contactIndex = this.findContactIndex(id);

    const updatedContact = {
      ...contacts[contactIndex],
      ...req.body,
    };
    contacts[contactIndex] = updatedContact;
    res.json(updatedContact);
  };
  validateUpdatedContact(req, res, next) {
    const validationRules = object().keys({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });
    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).send({ message: 'missing required name field' });
    }

    next();
  }
  getContactById = (req, res) => {
    const {
      params: { contactId },
    } = req;
    notFound(res, contactId);
    const contactIndex = this.findContactIndex(id);
    res.json(contacts[contactIndex]);
  };
  removeContact = (res, req) => {
    const {
      params: { id },
    } = req;
    const contactIndex = this.findContactIndex(id);
    const removedContact = contacts.splice(contactIndex, 1);
    res.json(removedContact);
  };

  validateId(req, res, next) {
    const {
      params: { id },
    } = req;

    const contactId = parseInt(id);
    const contactIndex = contacts.findIndex(({ id }) => id === contactId);

    if (contactIndex === -1) {
      return res.status(400).send('"message": "contact deleted"');
    }
    next();
  }
}

module.exports = new ContactController();
