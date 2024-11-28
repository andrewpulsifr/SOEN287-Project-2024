import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import * as businessController from '../controllers/business-controller.js';

const router = express.Router();

router.post('/submit-config', verifyToken, businessController.submitBusinessConfig);
router.get('/client-services', verifyToken, businessController.fetchAllClientServices)

export default router;