import 'dotenv/config'
import connectDB from '../config/db.js'
import seedUsers from './seed-user.js'
// import seedProducts from './seed-product.js' // Ví dụ thêm seeder khác

const runSeeds = async () => {
  try {
    await connectDB()

    console.log('--- Start Seeding ---')

    await seedUsers()
    // await seedProducts()

    console.log('--- Seeding Completed ---')
    process.exit()
  } catch (error) {
    console.error(`Seeding failed: ${error}`)
    process.exit(1)
  }
}

runSeeds()
