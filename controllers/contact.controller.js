const contacts = require('../models/contacts.json');
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const contactsPath = path.join(__dirname, '../models/contacts.json');

class ContactController {
  listContacts(req, res) {
    res.json(contacts);
  }

  getContactById = (req, res) => {
    const {
      params: { contactId },
    } = req;

    const contact = contacts.find(el => el.id === parseInt(contactId));
    if (!contact) {
      return res.status(404).send({ message: 'Not found' });
    }

    const contactIndex = this.findContactIndex(contactId);
    res.json(contacts[contactIndex]);
  };

  findContactIndex = contactId => {
    return contacts.findIndex(({ id }) => id === parseInt(contactId));
  };

  addContact(req, res) {
    const { body } = req;
    const addedContact = {
      id: uuidv4(),
      ...body,
    };
    contacts.push(addedContact);
    fs.writeFile(contactsPath, JSON.stringify(contacts));
    res.status(201).send({ message: 'New contact' });
  }

  validateAddedContact(req, res, next) {
    const validationRules = Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });
    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).send({ message: 'Missing required field' });
    }

    next();
  }

  updateContact = (req, res) => {
    const {
      params: { contactId },
    } = req;

    const contactIndex = this.findContactIndex(contactId);
    const updatedContact = {
      ...req.contactIndex,
      ...req.body,
    };
    contacts[contactIndex] = updatedContact;
    res.json(updatedContact);
    fs.writeFile(contactsPath, JSON.stringify(contacts));
  };

  validateUpdatedContact(req, res, next) {
    const validationRules = Joi.object().keys({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });
    const validationResult = validationRules.validate(req.body);

    if (validationResult.error) {
      return res.status(400).send({ message: 'Missing fields' });
    }
    next();
  }

  removeContact = (req, res) => {
    const {
      params: { contactId },
    } = req;
    const contactIndex = this.findContactIndex(contactId);
    const removedContact = contacts.splice(contactIndex, 1);
    res.json(removedContact);
  };

  validateId(req, res, next) {
    const {
      params: { contactId },
    } = req;

    const contactIndex = contacts.find(el => el.id === parseInt(contactId));

    if (contactIndex === -1) {
      return res.status(400).send({ message: 'contact deleted' });
    }
    req.contactIndex = contactIndex;

    next();
  }
}

module.exports = new ContactController();
