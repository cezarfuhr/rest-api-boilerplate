import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/error.middleware';
import { AuthRequest } from '../middlewares/auth.middleware';
import { logger } from '../utils/logger';

/**
 * @swagger
 * /posts:
 *   get:
 *     tags: [Posts]
 *     summary: Get all posts
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of posts
 */
export const getPosts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const published = req.query.published === 'true' ? true : undefined;
    const skip = (page - 1) * limit;

    const where = published !== undefined ? { published } : {};

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.post.count({ where }),
    ]);

    res.json({
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error({ error }, 'Get posts error');
    throw new AppError(500, 'Failed to get posts');
  }
};

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     tags: [Posts]
 *     summary: Get post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post data
 *       404:
 *         description: Post not found
 */
export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!post) {
      throw new AppError(404, 'Post not found');
    }

    res.json(post);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error({ error }, 'Get post error');
    throw new AppError(500, 'Failed to get post');
  }
};

/**
 * @swagger
 * /posts:
 *   post:
 *     tags: [Posts]
 *     summary: Create a new post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               published:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Post created
 */
export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, published } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(401, 'Not authenticated');
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: published || false,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info({ postId: post.id, userId }, 'Post created');

    res.status(201).json(post);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error({ error }, 'Create post error');
    throw new AppError(500, 'Failed to create post');
  }
};

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     tags: [Posts]
 *     summary: Update post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               published:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Post updated
 *       404:
 *         description: Post not found
 */
export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, published } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(401, 'Not authenticated');
    }

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      throw new AppError(404, 'Post not found');
    }

    if (existingPost.authorId !== userId && req.user?.role !== 'ADMIN') {
      throw new AppError(403, 'Not authorized to update this post');
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (published !== undefined) updateData.published = published;

    const post = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    logger.info({ postId: id, userId }, 'Post updated');

    res.json(post);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error({ error }, 'Update post error');
    throw new AppError(500, 'Failed to update post');
  }
};

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     tags: [Posts]
 *     summary: Delete post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Post deleted
 *       404:
 *         description: Post not found
 */
export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(401, 'Not authenticated');
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new AppError(404, 'Post not found');
    }

    if (post.authorId !== userId && req.user?.role !== 'ADMIN') {
      throw new AppError(403, 'Not authorized to delete this post');
    }

    await prisma.post.delete({
      where: { id },
    });

    logger.info({ postId: id, userId }, 'Post deleted');

    res.status(204).send();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    logger.error({ error }, 'Delete post error');
    throw new AppError(500, 'Failed to delete post');
  }
};
