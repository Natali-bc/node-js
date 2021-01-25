const fs = require('fs').promises;
const path = require('path');
const contactsPath = path.join('./db/contacts.json');
const { v4: uuidv4 } = require('uuid');

async function listContacts() {
  try {
    const list = await fs.readFile(contactsPath, 'utf-8');
    return JSON.parse(list);
  } catch (error) {
    return error;
  }
}
async function getContactById(contactId) {
  const getList = await listContacts();
  const contact = getList.find(el => el.id === contactId);
  return contact;
}

async function removeContact(contactId) {
  const getList = await listContacts();
  const filteredContacts = getList.filter(el => el.id !== contactId);
  fs.writeFile(contactsPath, JSON.stringify(filteredContacts));
  return filteredContacts;
}

async function addContact(name, email, phone) {
  const getList = await listContacts();
  const newContact = {
    id: uuidv4(),
    name: name,
    email: email,
    phone: phone,
  };
  const filter = getList.find(el => el.id === newContact.id);
  if (!filter) {
    getList.push(newContact);
    fs.writeFile(contactsPath, JSON.stringify(getList));
    return getList;
  } else {
    console.log('Такий номер вже існує');
  }
}

module.exports = {
  listContacts,
  removeContact,
  getContactById,
  addContact,
};
