import ApiError from '../utils/api-error.js'

const formatZodError = (error) => {
  if (!error.issues) return null
  const details = {}
  error.issues.forEach((issue) => {
    const path = issue.path.join('.')
    details[path] = issue.message
  })
  return details
}

export function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (err) {
      const details = formatZodError(err)
      next(new ApiError('Invalid input', 400, 'VALIDATION_ERROR', details))
    }
  }
}

export function validateParams(schema) {
  return (req, res, next) => {
    try {
      req.params = schema.parse(req.params)
      next()
    } catch (err) {
      const details = formatZodError(err)
      next(new ApiError('Invalid input', 400, 'VALIDATION_ERROR', details))
    }
  }
}
