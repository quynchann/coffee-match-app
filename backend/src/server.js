import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import router from './routes/api.js'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import { errorConverter, errorHandler } from './middlewares/error.middleware.js'

const port = process.env.PORT || 8080
const app = express()

connectDB()

app.use(
  cors({
    origin: process.env.BASE_URL_FRONTEND || 'http://localhost:3000',
    credentials: true
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api-v1', router)

// Convert error to ApiError, if needed
app.use(errorConverter)

// Handle error
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`)
})
