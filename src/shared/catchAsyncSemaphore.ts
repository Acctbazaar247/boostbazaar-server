import { Sema } from 'async-sema';
import { NextFunction, Request, RequestHandler, Response } from 'express';
const makeOrderSemaphore = new Sema(1);
const catchAsyncSemaphore =
  (fn: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await makeOrderSemaphore.acquire();

      await fn(req, res, next);
    } catch (error) {
      next(error);
    } finally {
      makeOrderSemaphore.release();
    }
  };

export default catchAsyncSemaphore;
