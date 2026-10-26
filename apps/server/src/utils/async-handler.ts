import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthenticatedRequest } from "../interfaces/token.interface.ts"

type AsyncRequestHandler = (
  req: Request | AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<unknown> | unknown;

const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request | AuthenticatedRequest, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch((error) => next(error));
  }
};
export { asyncHandler };