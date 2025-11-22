import authService from '../services/auth.service.js'

async function signup(req, res, next) {
  try {
    const user = await authService.signup(req.body)
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      }
    })
  } catch (error) {
    next(error)
  }
}

async function signin(req, res, next) {
  try {
    const deviceInfo = req.headers['user-agent']
    const result = await authService.signin({ ...req.body, deviceInfo })

    res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

async function refreshToken(req, res, next) {
  try {
    const { refreshToken } = req.body
    const deviceInfo = req.headers['user-agent']
    const result = await authService.refreshToken({ refreshToken, deviceInfo })
    res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    next(error)
  }
}

export default {
  signup,
  signin,
  refreshToken
}
