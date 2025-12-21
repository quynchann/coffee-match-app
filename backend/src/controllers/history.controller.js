import * as historyService from '@/services/history.service.js'

export async function createHistory(req, res, next) {
  try {
    const newHistory = await historyService.createHistory(req.body)
    res.status(201).json({
      success: true,
      data: newHistory
    })
  } catch (error) {
    next(error)
  }
}

export async function findAllHistories(req, res, next) {
  try {
    const filters = req.query
    const histories = await historyService.findAllHistories(filters)
    res.status(200).json({
      success: true,
      ...histories
    })
  } catch (error) {
    console.error('history.findAll error:', error)
    next(error)
  }
}

export async function deleteManyHistories(req, res, next) {
  try {
    const { _ids } = req.body
    await historyService.deleteManyHistories(_ids)
    res.status(200).json({
      success: true
    })
  } catch (error) {
    next(error)
  }
}
