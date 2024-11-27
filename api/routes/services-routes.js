const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/services-controller');
const verifyToken = require('../middleware/authMiddleware');  // Import verifyToken middleware

// Apply authMiddleware to all routes to protect them
router.get("/", serviceController.fetchAllServices); // Get all services
router.get("/:id", serviceController.fetchServiceById); // Get service by ID
router.post("/", verifyToken, serviceController.createService); // Post new service
router.put("/:id", verifyToken, serviceController.updateService); // Put update service
router.delete("/:id", verifyToken, serviceController.deleteService); // Delete service by ID

router.post('/request', verifyToken, serviceController.requestService); // Post request service

router.post('/create', verifyToken, serviceController.createService);



module.exports = router;