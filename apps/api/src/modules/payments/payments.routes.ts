import { Router } from 'express';
import * as paymentsController from './payments.controller';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { z } from 'zod';

const router = Router();

router.use(authenticate);

const paymentSchema = z.object({
  body: z.object({
    studentId: z.string().min(1),
    amount: z.number().positive(),
    paymentMethod: z.enum(['CASH', 'UPI', 'BANK_TRANSFER', 'CHEQUE', 'OTHER']).optional(),
    monthCovered: z.string().datetime(),
    remarks: z.string().optional(),
  })
});

router.post('/', validate(paymentSchema), paymentsController.create);
router.get('/', paymentsController.list);
router.get('/:id', paymentsController.get);
router.patch('/:id', validate(paymentSchema.partial()), paymentsController.update);
router.delete('/:id', paymentsController.remove);
router.get('/:id/receipt', paymentsController.receipt);

export default router;
