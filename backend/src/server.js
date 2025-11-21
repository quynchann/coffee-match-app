import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import router from './routes/api.js'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'

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

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`)
})
