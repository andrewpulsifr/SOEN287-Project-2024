// routes.js
import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';  // Import verifyToken middleware
import * as usersController from '../controllers/users-controller.js';

const router = express.Router();

// User Routes (Protected)
router.get("/:id", verifyToken, usersController.getUserById);  // Protect this route with verifyToken
router.get("/email/:email", verifyToken, usersController.getUserByEmail);  // Protect this route with verifyToken
router.put("/:id", verifyToken, usersController.updateUser);  // Protect this route with verifyToken
router.delete("/:id", verifyToken, usersController.deleteUser);  // Protect this route with verifyToken

router.get('/get-profile', verifyToken, usersController.getUserById);
router.post('/get-client', verifyToken, usersController.getClientByUserId);
router.get('/get-user', verifyToken, usersController.getProfile);
router.put('/profile/update', verifyToken, usersController.updateProfile);
router.post('/client-requests', verifyToken, usersController.getAllServicesByUserId);
router.delete('/profile/delete', verifyToken, usersController.deleteAccount); 

export default router;