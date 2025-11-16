import { Router } from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/post.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createPostSchema, updatePostSchema } from '../schemas/post.schema';

const router = Router();

router.get('/', getPosts);
router.get('/:id', getPostById);

router.use(authenticate);

router.post('/', validate(createPostSchema), createPost);
router.put('/:id', validate(updatePostSchema), updatePost);
router.delete('/:id', deletePost);

export default router;
