const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service-controller');

router.get("/", serviceController.fetchAllServices);// get all services
router.get("/:id", serviceController.fetchServiceById);// Get service by ID
router.post("/", serviceController.createService);// post new service
router.put("/:id", serviceController.updateService);// put update service
router.delete("/:id", serviceController.deleteService);// del service by ID



/*
router.get('/outstanding-services/:clientId', services-controller.getOutstandingServices);
router.get('/past-services/:clientId', services-controller.getPastServices);
router.post('/update-payment-status', services-controller.updatePaymentStatus);
router.post('/cancel-service', services-controller.cancelService);
*/
module.exports = router;