import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';

export default function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const first = errors.array()[0];
    return next(createHttpError(400, first.msg));
  }
  next();
}
