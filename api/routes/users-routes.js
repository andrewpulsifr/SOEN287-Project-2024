// routes.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');  // Import verifyToken middleware
const usersController = require('../controllers/users-controller');

// User Routes (Protected)
router.get("/:id", verifyToken, usersController.getUserById);  // Protect this route with verifyToken
router.get("/email/:email", verifyToken, usersController.getUserByEmail);  // Protect this route with verifyToken
router.put("/:id", verifyToken, usersController.updateUser);  // Protect this route with verifyToken
router.delete("/:id", verifyToken, usersController.deleteUser);  // Protect this route with verifyToken

router.post('/client-requests', verifyToken, usersController.getAllServicesByUserId); 
//router.post('/client-requests/:serviceId/cancel', verifyToken, usersController.cancelService); // Post cancel service

module.exports = router;