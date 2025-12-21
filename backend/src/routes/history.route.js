import express from 'express'
import * as historyController from '@/controllers/history.controller.js'

const historyRouter = express.Router()

historyRouter.post('/', historyController.createHistory)
historyRouter.get('/', historyController.findAllHistories)
historyRouter.delete('/', historyController.deleteManyHistories)

export default historyRouter
