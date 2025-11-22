import 'dotenv/config'
import User from '../models/User.js'
import { hashPassword } from '../utils/hash-password.js'

const seedUsers = async () => {
  try {
    await User.deleteMany()
    console.log('Users cleared')

    const password = await hashPassword('password123')

    const users = [
      {
        username: 'admin',
        email: 'admin@example.com',
        password
      },
      {
        username: 'user1',
        email: 'user1@example.com',
        password
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password
      }
    ]

    await User.insertMany(users)
    console.log('Users added')
  } catch (error) {
    console.error(`Error seeding users: ${error}`)
    throw error
  }
}

export default seedUsers
