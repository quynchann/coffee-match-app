import RefreshToken from '../models/RefreshToken'

async function createRefreshToken(data) {
  return await RefreshToken.create(data)
}

async function findRefreshTokenByToken(token) {
  return await RefreshToken.findOne({ token })
}

async function deleteRefreshToken(id) {
  return await RefreshToken.findByIdAndDelete(id)
}

export { createRefreshToken, findRefreshTokenByToken, deleteRefreshToken }
