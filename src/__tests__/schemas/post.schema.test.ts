import { createPostSchema, updatePostSchema } from '../../schemas/post.schema';

describe('Post Schemas', () => {
  describe('createPostSchema', () => {
    it('should validate correct post data', () => {
      const validData = {
        title: 'Test Post',
        content: 'This is a test post content',
        published: true,
      };

      const result = createPostSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept post without content', () => {
      const validData = {
        title: 'Test Post',
        published: false,
      };

      const result = createPostSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should default published to false', () => {
      const validData = {
        title: 'Test Post',
      };

      const result = createPostSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.published).toBe(false);
      }
    });

    it('should reject empty title', () => {
      const invalidData = {
        title: '',
        content: 'Content here',
      };

      const result = createPostSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject too long title', () => {
      const invalidData = {
        title: 'a'.repeat(201),
        content: 'Content here',
      };

      const result = createPostSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe('updatePostSchema', () => {
    it('should validate correct update data', () => {
      const validData = {
        title: 'Updated Post',
        content: 'Updated content',
        published: true,
      };

      const result = updatePostSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept partial updates', () => {
      const validData = {
        title: 'Updated Title',
      };

      const result = updatePostSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should accept empty object', () => {
      const validData = {};

      const result = updatePostSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should reject empty title if provided', () => {
      const invalidData = {
        title: '',
      };

      const result = updatePostSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });
});
