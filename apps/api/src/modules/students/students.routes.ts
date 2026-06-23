import { Router } from 'express';
import * as studentsController from './students.controller';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { z } from 'zod';

const router = Router();

router.use(authenticate);

const studentSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
    email: z.string().email().optional(),
    address: z.string().optional(),
    seatNumber: z.number().int().optional(),
    subscriptionStartDate: z.string().datetime(),
    subscriptionEndDate: z.string().datetime(),
    monthlyFee: z.number().positive(),
  })
});

router.get('/expiring', studentsController.expiring);
router.get('/overdue', studentsController.overdue);

router.post('/', validate(studentSchema), studentsController.create);
router.get('/', studentsController.list);
router.get('/:id', studentsController.get);
router.patch('/:id', validate(studentSchema.partial()), studentsController.update);
router.delete('/:id', studentsController.remove);

export default router;
