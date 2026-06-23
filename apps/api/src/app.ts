import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true }));

// Body parsing
app.use(express.json({ limit: '10mb' }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

import { errorHandler } from './middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import libraryRoutes from './modules/library/library.routes';
import studentRoutes from './modules/students/students.routes';
import seatRoutes from './modules/seats/seats.routes';
import paymentRoutes from './modules/payments/payments.routes';
import attendanceRoutes from './modules/attendance/attendance.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import notesRoutes from './modules/notes/notes.routes';
import notificationRoutes from './modules/notifications/notifications.routes';
import { startNotificationCron } from './modules/notifications/notifications.cron';

// Start background jobs
startNotificationCron();

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/library', libraryRoutes);
app.use('/api/v1/students', studentRoutes);
app.use('/api/v1/seats', seatRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/notes', notesRoutes);
app.use('/api/v1/notifications', notificationRoutes);

app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
