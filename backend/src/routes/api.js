import express from 'express'
import { authMiddleware } from '@/middlewares/auth.js'
import authRouter from './auth.route.js'
import profileRouter from './profile.route.js'

const router = express.Router()

router.get('/', async (req, res) => {
  res.status(200).json({
    message: 'API is running'
  })
})

router.use(authMiddleware)
router.use('/auth', authRouter)
router.use('/profile', profileRouter)

export default router
