import express from 'express';
import * as serviceController from '../controllers/services-controller.js';
import verifyToken from '../middleware/authMiddleware.js'; // Import verifyToken middleware

const router = express.Router();

// Apply authMiddleware to all routes to protect them
router.get("/",verifyToken, serviceController.fetchAllServices); // Get all services
router.get("/:id",verifyToken, serviceController.fetchServiceById); // Get service by ID
router.post("/", verifyToken, serviceController.createService); // Post new service
router.put("/:id", verifyToken, serviceController.updateService); // Put update service
router.delete("/:id", verifyToken, serviceController.deleteService); // Delete service by ID

router.post('/request', verifyToken, serviceController.requestService); // Post request service

export default router;