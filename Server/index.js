import express from 'express';
import cors from 'cors';
import connectDB from './utils/db.js';
import userRoutes from './routes/auth.js';
import busRoutes from './routes/bus.js';
import ticketRoutes from './routes/ticket.js';
import supportRoute from './routes/support.js';
import { buildAdminJS } from './utils/setup.js';

import { fileURLToPath } from 'url';
import path from 'path';
import morgan from 'morgan';

// Recreate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const startServer = async () => {
  const app = express();

  // CORS policy
  const corsOptions = {
    origin: 'http://localhosh:5173',       // allow all here; tighten in production
    credentials: true,
    methods: ['GET','POST','DELETE','PUT']
  };

  // Connect to MongoDB
  await connectDB();

  // AdminJS
  await buildAdminJS(app);

  // Middlewares
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(morgan('dev'));

  // API Routes
  app.use('/user',    userRoutes);
  app.use('/bus',     busRoutes);
  app.use('/tickets', ticketRoutes);
  app.use('/support', supportRoute);

  // Serve React build
// Serve static assets
app.use(express.static(path.join(__dirname, '../Frontend/dist')));

// Fallback: for any GET request that hasn't hit an API or AdminJS route,
// send back React's index.html
app.use((req, res, next) => {
  // Only handle GET requests for non-API/AdminJS paths
  if (req.method === 'GET'
    && !req.path.startsWith('/user')
    && !req.path.startsWith('/bus')
    && !req.path.startsWith('/tickets')
    && !req.path.startsWith('/support')
    && !req.path.startsWith('/admin')) {
    return res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
  }
  next();
});

  // });

  // Security headers (COOP/COEP) for OAuth popups, etc.
  app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy',    'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
  });

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server started at http://localhost:${PORT}`);
  });
};

startServer();
