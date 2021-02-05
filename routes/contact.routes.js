const { Router } = require('express');
const ContactController = require('../controllers/contact.controller');

const router = Router();

router.get('/', ContactController.listContacts);
router.get(
  '/:contactId',
  ContactController.validateId,
  ContactController.getContactById,
);
router.post(
  '/',
  // ContactController.validateAddedContact,
  ContactController.addContact,
);

router.delete(
  '/:contactId',
  ContactController.validateId,
  ContactController.removeContact,
);
router.patch(
  '/:contactId',
  ContactController.validateId,
  // ContactController.validateUpdatedContact,
  ContactController.updateContact,
);

module.exports = router;
