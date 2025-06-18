import express from 'express';
import { getBusDetailsById, getBusesBy } from '../controllers/bus.js';
import authMiddleware  from '../middlewares/auth.js';

const router = express.Router();

// Route to get details of a single bus by ID (URL param)
router.get('/:busId', authMiddleware, getBusDetailsById);

// Route to search buses by from, to, and date (POST for body parameters)
router.post('/search', authMiddleware, getBusesBy);

export default router;
