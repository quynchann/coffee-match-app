import 'dotenv/config'
import connectDB from '@/config/db.js'
import seedUsers from './seed-user.js'
import seedShops from './seed-shops.js'
import seedReviews from './seed-reviews.js'
import RefreshToken from '@/models/RefreshToken.js'

const runSeeds = async () => {
  try {
    await connectDB()

    console.log('--- Start Seeding ---')
    await RefreshToken.deleteMany()
    await seedUsers()
    await seedShops()
    await seedReviews()

    console.log('--- Seeding Completed ---')
    process.exit()
  } catch (error) {
    console.error(`Seeding failed: ${error}`)
    process.exit(1)
  }
}

runSeeds()
