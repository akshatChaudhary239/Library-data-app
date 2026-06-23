import { Router } from 'express';
import * as libraryController from './library.controller';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { z } from 'zod';

const router = Router();

// Require auth for all library routes
router.use(authenticate);

const librarySchema = z.object({
  body: z.object({
    name: z.string().min(2),
    ownerName: z.string().min(2),
    phone: z.string().min(10),
    address: z.string(),
    totalSeats: z.number().int().positive(),
    defaultMonthlyFee: z.number().positive(),
    openingTime: z.string().regex(/^\d{2}:\d{2}$/),
    closingTime: z.string().regex(/^\d{2}:\d{2}$/),
  })
});

router.post('/setup', validate(librarySchema), libraryController.setup);
router.get('/', libraryController.get);
router.patch('/', validate(librarySchema.partial()), libraryController.update);
router.get('/stats', libraryController.stats);

export default router;
