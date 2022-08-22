module.exports = class customError extends Error {
    constructor(errorCode, message){
        super(message);
        this.errorCode = errorCode;
        this.status = String(errorCode).startsWith('4')?'fail': 'error';
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
} 