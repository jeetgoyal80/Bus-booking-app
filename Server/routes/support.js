import express from 'express';
import { sendSupportMessage, handleIncomingMessage } from '../controllers/supportController.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.post('/send',authMiddleware, sendSupportMessage);
router.post('/webhook',express.urlencoded({ extended: false }), handleIncomingMessage); // for Twilio webhook

export default router;
