import { Router } from 'express';
import * as attendanceController from './attendance.controller';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { z } from 'zod';

const router = Router();

router.use(authenticate);

const checkInSchema = z.object({
  body: z.object({
    studentId: z.string().min(1),
  })
});

const checkOutSchema = z.object({
  body: z.object({
    studentId: z.string().min(1),
  })
});

router.get('/', attendanceController.list);
router.post('/checkin', validate(checkInSchema), attendanceController.checkIn);
router.post('/checkout', validate(checkOutSchema), attendanceController.checkOut);

export default router;
