import jwt from 'jsonwebtoken'
import ApiError from '@/utils/api-error.js'

export const authMiddleware = (req, res, next) => {
  // Whitelist paths that do not require authentication
  const authWhitelists = ['auth/signin', 'auth/signup', 'auth/refresh-token']

  if (authWhitelists.find((path) => '/api-v1/' + path === req.originalUrl))
    return next()
  if (
    req.method === 'GET' &&
    (req.originalUrl.startsWith('/api-v1/search') ||
      req.originalUrl.startsWith('/api-v1/shops') ||
      req.originalUrl.startsWith('/api-v1/review'))
  ) {
    return next()
  }

  try {
    const auth = req.headers['authorization'] || req.headers['Authorization']
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new ApiError('Missing authentication token', 401, 'UNAUTHORIZED')
    }
    const token = auth.substring('Bearer '.length)
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    req.user = {
      id: payload.id,
      username: payload.username,
      email: payload.email
    }
    return next()
  } catch (err) {
    if (err instanceof ApiError) return next(err)
    return next(new ApiError('Invalid or expired token', 401, 'UNAUTHORIZED'))
  }
}
