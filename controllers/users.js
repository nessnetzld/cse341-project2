const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
  // #swagger.tags=['Users']
  // #swagger.parameters['id'] = { description: 'User ID' }
  // #swagger.responses[200] = { description: 'User found successfully' }
  // #swagger.responses[404] = { description: 'User not found' }
  try {
    const result = await mongodb.getDatabase().db().collection("users").find();
    const users = await result.toArray();
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(users);
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
  // #swagger.tags=['Users']
  // #swagger.parameters['id'] = { description: 'User ID' }
  // #swagger.responses[200] = { description: 'User found successfully' }
  // #swagger.responses[404] = { description: 'User not found' }
  if (!ObjectId.isValid(req.params.id)) {
    return res.status(400).json("Must use a valid user id to find a contact");
  }
  try {
    const userId = new ObjectId(req.params.id);
    const user = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(user);
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
const createUser = async (req, res) => {
  // #swagger.tags=['Users']
  // #swagger.parameters['id'] = { description: 'User ID' }
  // #swagger.responses[200] = { description: 'User found successfully' }
  // #swagger.responses[404] = { description: 'User not found' }
  try {
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      favoriteColor: req.body.favoriteColor,
      birthday: req.body.birthday,
    };
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .insertOne(user);
    if (response.acknowledged > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(response.error || "Some error occurred while updating the user.");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid id to update a user");
  }
  try {
    // #swagger.tags=['Users']
    // #swagger.parameters['id'] = { description: 'User ID' }
    // #swagger.responses[200] = { description: 'User found successfully' }
    // #swagger.responses[404] = { description: 'User not found' }
    const userId = new ObjectId(req.params.id);
    const user = {
      username: req.body.username,
      email: req.body.email,
      name: req.body.name,
      ipaddress: req.body.ipaddress,
    };
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .replaceOne({ _id: userId }, user);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(response.error || "Some error occurred while updating the user.");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json("Must use a valid id to delete an user");
  }
  try {
    // #swagger.tags=['Users']
    // #swagger.parameters['id'] = { description: 'User ID' }
    // #swagger.responses[200] = { description: 'User found successfully' }
    // #swagger.responses[404] = { description: 'User not found' }
    const userId = new ObjectId(req.params.id);
    const response = await mongodb
      .getDatabase()
      .db()
      .collection("users")
      .deleteOne({ _id: userId }, true);
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res
        .status(500)
        .json(response.error || "Some error occurred while deteting the user.");
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser,
};
