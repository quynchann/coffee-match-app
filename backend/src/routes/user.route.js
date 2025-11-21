import express from 'express'
import userController from '../controllers/user.controller.js'

const userRouter = express.Router()

userRouter.get('/users', userController.getUsers)
userRouter.post('/users', userController.createUser)
userRouter.get('/users/:id', userController.getUserById)

export default userRouter
