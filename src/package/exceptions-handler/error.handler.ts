import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const error = { ...err };
  error.message = err.message;

  //Other errors
  res.status(error.statusCode || 500).json({
    sucess: false,
    error: error.message || 'Server Error',
  });
  next();
};

export default errorHandler;
