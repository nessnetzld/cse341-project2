const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  // #swagger.tags=['Contacts']
  // #swagger.parameters['id'] = { description: 'Contact ID' }
  // #swagger.responses[200] = { description: 'Contact found successfully' }
  // #swagger.responses[404] = { description: 'Contact not found' }
  try {
    const result = await mongodb
      .getDatabase()
      .db()
      .collection("contacts")
      .find();
    const contacts = await result.toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(contacts);
  } catch (err) {
    console.error("Error in getAll:", err);
    res.status(500).json({ error: err.message });
  }
};

/* const getAll = async (req, res) => {
  mongodb
    .getDatabase()
    .db()
    .collection("users")
    .find()
    .toArray((err, lists) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(lists);
    });
};
 */
const getSingle = async (req, res) => {
  // #swagger.tags=['Contacts']
  // #swagger.parameters['id'] = { description: 'Contact ID' }
  // #swagger.responses[200] = { description: 'Contact found successfully' }
  // #swagger.responses[404] = { description: 'Contact not found' }
  if (!ObjectId.isValid(req.params.id)) {
    return res
      .status(400)
      .json("Must use a valid contact id to find a contact");
  }
  try {
    const contactId = new ObjectId(req.params.id);
    const contact = await mongodb
      .getDatabase()
      .db()
      .collection("contacts")
      .findOne({ _id: contactId });
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(contact);
  } catch (err) {
    console.error("Error in getSingle:", err);
    res.status(500).json({ error: err.message });
  }
};

//const getSingle = async (req, res) => {
// #swagger.tags=['Users']
/*   const userId = new ObjectId(req.params.id);
  const result = await mongodb.getDatabase().db().collection("users").find();
  result.toArray().then((users) => {
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(users[0]);
  });
};
 */
const createContact = async (req, res) => {
  // #swagger.tags=['Contacts']
  // #swagger.parameters['id'] = { description: 'Contact ID' }
  // #swagger.responses[200] = { description: 'Contact found successfully' }
  // #swagger.responses[404] = { description: 'Contact not found' }
  try {
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
    };
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("contacts")
      .insertOne(contact);
    if (response.acknowledged > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(
          response.error || "Some error occurred while updating the contact."
        );
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateContact = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid id to update a contact");
  }
  try {
    // #swagger.tags=['Contacts']
    // #swagger.parameters['id'] = { description: 'Contact ID' }
    // #swagger.responses[200] = { description: 'Contact found successfully' }
    // #swagger.responses[404] = { description: 'Contact not found' }
    const contactId = new ObjectId(req.params.id);
    const contact = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
    };
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("contacts")
      .replaceOne({ _id: contactId }, contact);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(
          response.error || "Some error occurred while updating the contact."
        );
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteContact = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid id to delete a contact");
  }
  try {
    // #swagger.tags=['Contacts']
    // #swagger.parameters['id'] = { description: 'Contact ID' }
    // #swagger.responses[200] = { description: 'Contact found successfully' }
    // #swagger.responses[404] = { description: 'Contact not found' }
    const contactId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("contacts")
      .deleteOne({ _id: contactId }, true);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(
          response.error || "Some error occurred while deleting the contact."
        );
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact,
};
