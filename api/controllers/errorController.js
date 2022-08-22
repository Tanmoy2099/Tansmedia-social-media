const AppError = require('../../utilsServer/customError');

module.exports = (err, req, res, next) => {
  err.errorCode = err.errorCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === "development") {
    console.log({name:err.name, message: err.message});
    errorForDev(err, res);
  }
  else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldDB(error);
    errorForProd(error, res);
  }
}



const handleDuplicateFieldDB = err => new AppError(400, `Duplicate field value: ${err.keyValue.name}. please enter a different value`);
const handleCastErrorDB = err => new AppError(400, `Invalid ${err.path}: ${err.value}`);
const handleValidationErrorDB = err => new AppError(400, `${err}`);


const errorForDev = (err, res) => {
  res.status(err.errorCode).json({
    status: err.status,
    name: err.name ? err.name : 'unknown',
    message: err.message,
    error: err,
    stack: err.stack,
  })
}

const errorForProd = (err, res) => {
  if (err.isOperational) { // known error
    res.status(err.errorCode).json({
      status: err.status,
      message: err.message,
    })

  } else { // unknown error
    console.error('ERROR!!!', err)
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    })
  }
}

