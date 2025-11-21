import 'dotenv/config'
import User from '../models/User.js'

const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    username: 'user1',
    email: 'user1@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    username: 'user2',
    email: 'user2@example.com',
    password: 'password123',
    role: 'user'
  }
]

const seedUsers = async () => {
  try {
    await User.deleteMany()
    console.log('Users cleared')

    await User.insertMany(users)
    console.log('Users added')
  } catch (error) {
    console.error(`Error seeding users: ${error}`)
    throw error
  }
}

export default seedUsers
