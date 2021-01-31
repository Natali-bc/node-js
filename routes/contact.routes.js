const { Router } = require('express');
const ContactController = require('../controllers/contact.controller');

const router = Router();

router.get('/', ContactController.listContacts);
router.get('/:contactId');
router.post(
  '/',
  // ContactController.validateAddedContact,
  ContactController.addContact,
);
router.put('/:contactId');
router.delete('/:contactId');

module.exports = router;
