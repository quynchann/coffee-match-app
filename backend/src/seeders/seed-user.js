import 'dotenv/config'
import User from '@/models/User.js'
import { hashPassword } from '@/utils/hash-password.js'

const seedUsers = async () => {
  try {
    await User.deleteMany()
    console.log('Users cleared')

    const password = await hashPassword('123456')

    const users = [
      {
        username: 'admin',
        email: 'admin@gmail.com',
        password,
        address: 'Hanoi',
        age: 30,
        styles: ['24h', 'Wi-Fi']
      },
      {
        username: 'user1',
        email: 'user1@gmail.com',
        password,
        address: 'HCM City',
        age: 25
      },
      {
        username: 'user2',
        email: 'user2@gmail.com',
        password,
        address: 'Da Nang',
        age: 28,
        styles: ['24h']
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
