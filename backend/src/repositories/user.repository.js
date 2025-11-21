import User from '../models/User.js'

const findByEmail = async (email) => {
  return await User.findOne({ email })
}

const create = async (userData) => {
  const user = new User(userData)
  return await user.save()
}

const findAll = async () => {
  return await User.find({})
}

const findById = async (id) => {
  return await User.findById(id)
}

export default {
  findByEmail,
  create,
  findAll,
  findById
}
