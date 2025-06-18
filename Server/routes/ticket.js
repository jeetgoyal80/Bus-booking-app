import express from 'express';
import { getUserTickets, bookTickets, pnrchecker } from '../controllers/ticket.js';
import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

router.get('/my-tickets', authMiddleware, getUserTickets); // GET /api/tickets/my
router.post('/book', authMiddleware, bookTickets);    
router.post('/pnr',pnrchecker)

export default router;     // POST /api/tickets/book


