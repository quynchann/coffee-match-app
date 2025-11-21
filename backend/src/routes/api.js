import express from 'express'
import userRouter from './user.route.js'

const router = express.Router()

router.get('/', async (req, res) => {
  res.status(200).json({
    message: 'API is running'
  })
})

router.use('/users', userRouter)

export default router
