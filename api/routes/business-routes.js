import express from 'express';
import verifyToken from '../middleware/authMiddleware.js';
import * as businessController from '../controllers/business-controller.js';

const router = express.Router();

router.post('/submit-config', verifyToken, businessController.submitBusinessConfig);

export default router;