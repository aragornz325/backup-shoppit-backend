const boom = require('@hapi/boom');

function logErrors(err, req, res, next) {
  next(err);
}

function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const { output } = err;
    res.status(output.statusCode).json(output.payload);
  }
  next(err);
}

function errorHandler(err, req, res, next) {
  if (err) {
    res.status(409).json({
      message: err.message,
      stack: err.stack,
    });
  } else {
    next(err);
  }
}

function error404Handler(req, res) {
  res.status(404);
  res.send(boom.notFound('the requested resource does not exist'));
}

module.exports = {
  logErrors,
  errorHandler,
  boomErrorHandler,
  error404Handler,
};
