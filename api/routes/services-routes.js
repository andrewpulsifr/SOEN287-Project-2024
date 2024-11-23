const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/services-controller');

//Service routes
router.get("/", serviceController.fetchAllServices);// get all services
router.get("/:id", serviceController.fetchServiceById);// Get service by ID
router.post("/", serviceController.createService);// post new service
router.put("/:id", serviceController.updateService);// put update service
router.delete("/:id", serviceController.deleteService);// del service by ID

//User Routes
router.get("/:id", usersController.getUserById);
router.get("/email/:email", usersController.getUserByEmail);
router.put("/:id", usersController.updateUser);
router.delete("/:id", usersController.deleteUser);

module.exports = router;