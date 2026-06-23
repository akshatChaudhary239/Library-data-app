import { Router } from 'express';
import * as notesController from './notes.controller';
import { authenticate } from '../../middleware/authenticate';
import { validate } from '../../middleware/validate';
import { z } from 'zod';

const router = Router();

router.use(authenticate);

const noteSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    content: z.string(),
  })
});

router.post('/', validate(noteSchema), notesController.create);
router.get('/', notesController.list);
router.patch('/:id', validate(noteSchema.partial()), notesController.update);
router.delete('/:id', notesController.remove);

export default router;
