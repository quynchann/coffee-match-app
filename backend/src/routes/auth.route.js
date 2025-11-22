import express from 'express'
import authController from '../controllers/auth.controller.js'
import { validateBody } from '../middlewares/validate.js'
import { signin, signup, refreshToken } from '../schemas/auth.schema.js'

const authRouter = express.Router()

authRouter.post('/signup', validateBody(signup), authController.signup)
authRouter.post('/signin', validateBody(signin), authController.signin)
authRouter.post('/refresh-token', validateBody(refreshToken), authController.refreshToken)

export default authRouter
