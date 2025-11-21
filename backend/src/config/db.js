import mongoose from 'mongoose'

const mongo_uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?appName=Cluster0`

const connectDB = async () => {
  try {
    await mongoose.connect(mongo_uri)
    console.log('MongoDB Connected Successfully')
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB
