import AppError from './../utils/AppError.js'

const handleExpiresOTPError = () => {
    const message = 'Votre code de vérification est expiré ou déjà vérifié, Veuillez demander un autre!'
    return new AppError(message, 400)
}

const handleDuplicateError = err => {
    const message = `Cette valeur: ${err.original.sqlMessage.split(' ')[3]} existe déjà, veuillez fournir une autre`
    return new AppError(message, 400)
}

const handleValidationError = err =>{
    const message = err.errors.map(el=>{
        return el.message
    }).join(', ')
    return new AppError(message, 400)
}

const handleEtimedout = ()=>{
    return new AppError('Problème avec la connexion, veuillez ressayer encore', 403)
}

const handleJWTError = () =>
    new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please log in again.', 401);

const sendErrorDev = (err, res,) => {
    console.log(err)
    res.status(err.statusCode)
        .json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        })
}

const sendErrorProd = (err, res) => {
    if (err.isOperationnal) {
        res.status(err.statusCode)
            .json({
                status: err.status,
                message: err.message
            })
    } else {
        console.log(err)
        res.status(500)
            .json({
                status: 'Error',
                message: "Quelque chose ne fonctionne pas, veuillez ressayer plutard"
            })
    }
}

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = {...err}
        error.message = err.message
        error.name = err.name

        if (error.code === 20404) error = handleExpiresOTPError(error)
        if (error.name === "SequelizeValidationError") error = handleValidationError(error)
        if (error.name === "SequelizeUniqueConstraintError") error = handleDuplicateError(error)
        if(error.code === "ETIMEDOUT") error = handleEtimedout(error)
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res)
    }
}