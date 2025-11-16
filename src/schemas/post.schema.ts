import { z } from 'zod';

export const createPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must not exceed 200 characters'),
  content: z.string().optional(),
  published: z.boolean().default(false),
});

export const updatePostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title must not be empty')
    .max(200, 'Title must not exceed 200 characters')
    .optional(),
  content: z.string().optional(),
  published: z.boolean().optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
