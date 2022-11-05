export default class AppError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
        this.status = `${this.statusCode}`.startsWith('4')?'fail':'error'
        this.isOperationnal = true
        Error.captureStackTrace(this, this.constructor)
    }
}