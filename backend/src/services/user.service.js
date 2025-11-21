import userRepository from '../repositories/user.repository.js'

const getAllUsers = async () => {
  return await userRepository.findAll()
}

const createUser = async (userData) => {
  // Here you can add business logic like password hashing
  // const hashedPassword = await bcrypt.hash(userData.password, 10);
  // userData.password = hashedPassword;

  const existingUser = await userRepository.findByEmail(userData.email)
  if (existingUser) {
    throw new Error('User already exists')
  }

  return await userRepository.create(userData)
}

const getUserById = async (id) => {
  return await userRepository.findById(id)
}

export default {
  getAllUsers,
  createUser,
  getUserById
}
