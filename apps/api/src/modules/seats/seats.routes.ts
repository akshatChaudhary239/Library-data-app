import { Router } from 'express';
import * as seatsController from './seats.controller';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { z } from 'zod';

const router = Router();

router.use(authenticate);

const generateSchema = z.object({
  body: z.object({
    totalSeats: z.number().int().positive(),
  })
});

const assignSchema = z.object({
  body: z.object({
    studentId: z.string().min(1),
  })
});

router.get('/', seatsController.list);
router.post('/generate', validate(generateSchema), seatsController.generate);
router.patch('/:id/assign', validate(assignSchema), seatsController.assign);
router.patch('/:id/unassign', seatsController.unassign);
router.patch('/:id/reserve', seatsController.reserve);

export default router;
