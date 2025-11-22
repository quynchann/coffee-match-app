import User from '../models/User.js'

async function createUser(data) {
  return await User.create(data)
}

async function findUserByEmail(email) {
  return await User.findOne({ email })
}

async function findUserByUsername(username) {
  return await User.findOne({ username })
}

async function findAllUsers() {
  return await User.find()
}

async function findUserById(id) {
  return await User.findById(id)
}

async function updateUser(id, data) {
  return await User.findByIdAndUpdate(id, data, { new: true })
}

async function deleteUser(id) {
  return await User.findByIdAndDelete(id)
}

export {
  findUserByEmail,
  findUserByUsername,
  createUser,
  findAllUsers,
  findUserById,
  updateUser,
  deleteUser
}
