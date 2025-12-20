import * as userRepo from '@/repositories/user.repository.js'
import * as refreshTokenRepo from '@/repositories/refreshToken.repository.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import ms from 'ms'
import 'dotenv/config'
import { hashPassword, comparePassword } from '@/utils/hash-password.js'
import ApiError from '@/utils/api-error.js'

const generateTokens = async (user, deviceInfo) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || '15m'
  const accessToken = jwt.sign(
    { id: user._id, username: user.username, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn }
  )

  const expiredAt = new Date(Date.now() + ms(expiresIn))

  const refreshTokenString = crypto.randomBytes(40).toString('hex')

  const refreshTokenDoc = await refreshTokenRepo.createRefreshToken({
    token: refreshTokenString,
    user_id: user._id,
    expiredAt: expiredAt,
    deviceInfo: deviceInfo
  })

  return {
    accessToken,
    refreshToken: refreshTokenDoc.token
  }
}

async function signup({ email, password, username, address, age, styles }) {
  try {
    if (!username || !password || !email) {
      throw new ApiError(
        'Username, password, and email are required',
        400,
        'MISSING_FIELDS'
      )
    }

    const existingUser = await userRepo.findUserByUsername(username)
    if (existingUser) {
      throw new ApiError('Username already exists', 409, 'USERNAME_EXISTS')
    }

    const existingEmail = await userRepo.findUserByEmail(email)
    if (existingEmail) {
      throw new ApiError('Email already exists', 409, 'EMAIL_EXISTS')
    }

    const hashedPassword = await hashPassword(password)

    const newUser = await userRepo.createUser({
      email,
      password: hashedPassword,
      username,
      address,
      age,
      styles
    })

    return newUser
  } catch (error) {
    throw error
  }
}

async function signin({ email, password, deviceInfo }) {
  try {
    const user = await userRepo.findUserByEmail(email)
    if (!user) {
      throw new ApiError('Invalid credentials', 401, 'INVALID_CREDENTIALS')
    }

    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) {
      throw new ApiError('Invalid credentials', 401, 'INVALID_CREDENTIALS')
    }

    const tokens = await generateTokens(user, deviceInfo)

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        styles: user.styles
      },
      ...tokens
    }
  } catch (error) {
    throw error
  }
}

async function refreshToken({ refreshToken, deviceInfo }) {
  try {
    const tokenDoc =
      await refreshTokenRepo.findRefreshTokenByToken(refreshToken)
    if (!tokenDoc) {
      throw new ApiError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN')
    }

    if (tokenDoc.expiredAt < new Date()) {
      await refreshTokenRepo.deleteRefreshToken(tokenDoc._id)
      throw new ApiError('Refresh token expired', 401, 'REFRESH_TOKEN_EXPIRED')
    }

    const user = await userRepo.findUserById(tokenDoc.user_id)
    if (!user) {
      throw new ApiError('User not found', 404, 'USER_NOT_FOUND')
    }

    // Rotate token
    await refreshTokenRepo.deleteRefreshToken(tokenDoc._id)

    const tokens = await generateTokens(user, deviceInfo)
    return tokens
  } catch (error) {
    throw error
  }
}

export default {
  signup,
  signin,
  refreshToken
}
