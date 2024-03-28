const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = statusCode === 500 ? 'Server error' : err.message;

  if (err.name === 'CastError') {
    statusCode = 404;
    message = 'Resource not found';
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 400;
    message = 'Invalid Link';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 400;
    message = 'Expired Link';
  }

  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
