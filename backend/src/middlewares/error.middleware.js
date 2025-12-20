import ApiError from '@/utils/api-error.js'

export const errorConverter = (err, req, res, next) => {
  let error = err
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error.status || 500
    const message = error.message || 'Internal Server Error'
    error = new ApiError(message, statusCode, 'INTERNAL_ERROR')
  }
  next(error)
}

export const errorHandler = (err, req, res, next) => {
  let { status, message, code, details } = err

  const response = {
    success: false,
    error: {
      code,
      message,
      status,
      details
    }
  }

  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack
  }

  res.status(status).json(response)
}
