const {
  Types: { ObjectId },
} = require('mongoose');

const Contact = require('../models/Contact');

async function listContacts(req, res) {
  const contacts = await Contact.find();
  res.json(contacts);
}
async function addContact(req, res) {
  try {
    const { body } = req;
    const contact = await Contact.create(body);
    res.send('Contact is added');
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

module.exports = {
  listContacts,
  addContact,
  getContactById,
  updateContact,
  removeContact,
  validateId,
};

// Второй вариант

// class ContactController {
//   listContacts(req, res) {
//     res.json(contacts);
//   }

//   getContactById = (req, res) => {
//     const {
//       params: { contactId },
//     } = req;

//     const contact = contacts.find(el => el.id === parseInt(contactId));
//     if (!contact) {
//       return res.status(404).send({ message: 'Not found' });
//     }

//     const contactIndex = this.findContactIndex(contactId);
//     res.json(contacts[contactIndex]);
//   };

//   findContactIndex = contactId => {
//     return contacts.findIndex(({ id }) => id === parseInt(contactId));
//   };

//   addContact(req, res) {
//     const { body } = req;
//     const addedContact = {
//       id: uuidv4(),
//       ...body,
//     };
//     contacts.push(addedContact);
//     fs.writeFile(contactsPath, JSON.stringify(contacts));
//     res.status(201).send({ message: 'New contact' });
//   }

//   validateAddedContact(req, res, next) {
//     const validationRules = Joi.object().keys({
//       name: Joi.string().required(),
//       email: Joi.string().required(),
//       phone: Joi.string().required(),
//     });
//     const validationResult = validationRules.validate(req.body);

//     if (validationResult.error) {
//       return res.status(400).send({ message: 'Missing required field' });
//     }

//     next();
//   }

//   updateContact = (req, res) => {
//     const {
//       params: { contactId },
//     } = req;

//     const contactIndex = this.findContactIndex(contactId);
//     const updatedContact = {
//       ...req.contactIndex,
//       ...req.body,
//     };
//     contacts[contactIndex] = updatedContact;
//     res.json(updatedContact);
//     fs.writeFile(contactsPath, JSON.stringify(contacts));
//   };

//   validateUpdatedContact(req, res, next) {
//     const validationRules = Joi.object().keys({
//       name: Joi.string(),
//       email: Joi.string(),
//       phone: Joi.string(),
//     });
//     const validationResult = validationRules.validate(req.body);

//     if (validationResult.error) {
//       return res.status(400).send({ message: 'Missing fields' });
//     }
//     next();
//   }

//   removeContact = (req, res) => {
//     const {
//       params: { contactId },
//     } = req;
//     const contactIndex = this.findContactIndex(contactId);
//     const removedContact = contacts.splice(contactIndex, 1);
//     res.json(removedContact);
//   };

//   validateId(req, res, next) {
//     const {
//       params: { contactId },
//     } = req;

//     const contactIndex = contacts.find(el => el.id === parseInt(contactId));

//     if (contactIndex === -1) {
//       return res.status(400).send({ message: 'contact deleted' });
//     }
//     req.contactIndex = contactIndex;

//     next();
//   }
// }
