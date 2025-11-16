import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { updateUserSchema } from '../schemas/user.schema';

const router = Router();

router.use(authenticate);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', validate(updateUserSchema), updateUser);
router.delete('/:id', authorize('ADMIN'), deleteUser);

export default router;
