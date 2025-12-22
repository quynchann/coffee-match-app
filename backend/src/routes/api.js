import express from 'express'
import { authMiddleware } from '@/middlewares/auth.js'
import authRouter from './auth.route.js'
import profileRouter from './profile.route.js'
import searchRouter from './search.route.js'
import shopRouter from './shop.route.js'
import favoriteRouter from './favorite.route.js'
import historyRouter from './history.route.js'

const router = express.Router()

router.get('/', async (req, res) => {
  res.status(200).json({
    message: 'API is running...'
  })
})

router.use(authMiddleware)
router.use('/auth', authRouter)
router.use('/profile', profileRouter)
router.use('/search', searchRouter)
router.use('/shops', shopRouter)
router.use('/favorite', favoriteRouter)
router.use('/history', historyRouter)

export default router
