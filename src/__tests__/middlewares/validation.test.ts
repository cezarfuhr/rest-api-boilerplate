import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validate } from '../../middlewares/validation.middleware';

describe('Validation Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  it('should call next() for valid data', () => {
    const schema = z.object({
      email: z.string().email(),
      name: z.string(),
    });

    mockRequest.body = {
      email: 'test@example.com',
      name: 'Test User',
    };

    const middleware = validate(schema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should return 400 for invalid data', () => {
    const schema = z.object({
      email: z.string().email(),
      name: z.string(),
    });

    mockRequest.body = {
      email: 'invalid-email',
      name: '',
    };

    const middleware = validate(schema);
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: 'Validation failed',
        details: expect.any(Array),
      })
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should validate query parameters when specified', () => {
    const schema = z.object({
      page: z.string(),
      limit: z.string(),
    });

    mockRequest.query = {
      page: '1',
      limit: '10',
    };

    const middleware = validate(schema, 'query');
    middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });
});
