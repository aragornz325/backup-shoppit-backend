/* eslint-disable @typescript-eslint/no-var-requires */
//const boom = require("@hapi/boom");

function logErrors(err, req, res, next) {
  console.error(err);
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

function boomErrorHandler(err, req, res, next) {
  if (err.isBoom) {
    const {output} = err;
    res.status(output.statusCode).json(output.payload);
  }
  next(err);
}


module.exports= {
  logErrors,
  errorHandler,
  boomErrorHandler,
};
