import { Request, Response, NextFunction, RequestHandler } from 'express';

// Definable signature for async route handlers
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown> | unknown;

const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch((error: any) => {
      const statusCode = typeof error?.code === 'number' ? error.code : 500;
      
      res.status(statusCode).json({
        success: false,
        message: error?.message || 'Internal Server Error'
      });
    });
  }
};
export { asyncHandler };