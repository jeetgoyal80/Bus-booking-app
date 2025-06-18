import express from 'express';
import cors from 'cors';
import connectDB from './utils/db.js';
import userRoutes from './routes/auth.js';
import busRoutes from './routes/bus.js';
import ticketRoutes from './routes/ticket.js';
import supportRoute from './routes/support.js';
import { buildAdminJS } from './utils/setup.js';
import morgan from 'morgan';

const startServer = async () => {
  const app = express();

  const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT']
  };


  // Connect to DB
  await connectDB();

  // AdminJS
  await buildAdminJS(app);

  // Middleware
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(morgan('dev'));
  

  // Routes
  app.use('/user', userRoutes);
  app.use('/bus', busRoutes);
  app.use('/tickets', ticketRoutes);
  app.use('/',supportRoute );

  app.get('/', (req, res) => {
    res.send('🚍 Bus Booking API Running');
  });

  // Optional: Set COOP headers if using OAuth popups
  app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
  });

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server started on port ${PORT}`);
  });
};

startServer();
