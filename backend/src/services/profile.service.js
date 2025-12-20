import * as userRepo from '@/repositories/user.repository.js'
import { comparePassword, hashPassword } from '@/utils/hash-password.js'

async function getUserProfile(userId) {
  const user = await userRepo.findUserById(userId)

  if (!user) {
    return null
  }

  const profile = {
    id: user._id,
    name: user.username,
    email: user.email,
    address: user.address,
    age: user.age,
    avatar: user.avatar,
    styles: user.styles
  }

  return profile
}

async function updateProfile(userId, profileData, avatarPath = null) {
  const updateData = { ...profileData }

  if (avatarPath) {
    updateData.avatar = avatarPath
  }

  const updatedUser = await userRepo.updateUser(userId, updateData)

  if (!updatedUser) {
    return null
  }

  // Định dạng lại dữ liệu trước khi trả về
  const profile = {
    id: updatedUser._id,
    name: updatedUser.username,
    email: updatedUser.email,
    address: updatedUser.address,
    age: updatedUser.age,
    styles: updatedUser.styles,
    avatar: updatedUser.avatar // Trả về đường dẫn avatar mới
  }

  return profile
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await userRepo.findUserById(userId)

  if (!user) {
    throw new Error('Đã xảy ra lỗi hệ thống.')
  }

  const isMatch = await comparePassword(currentPassword, user.password)

  if (!isMatch) {
    throw new Error('Mật khẩu hiện tại không chính xác.')
  }

  if (currentPassword === newPassword) {
    throw new Error('Mật khẩu mới phải khác mật khẩu hiện tại.')
  }

  const newHashedPassword = await hashPassword(newPassword)

  const updatedUser = await userRepo.updatePassword(userId, newHashedPassword)

  return updatedUser
}

export default { getUserProfile, updateProfile, changePassword }
