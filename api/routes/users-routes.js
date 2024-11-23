const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/users-controller');

//User Routes
router.get("/:id", usersController.getUserById);
router.get("/email/:email", usersController.getUserByEmail);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

module.exports = router;