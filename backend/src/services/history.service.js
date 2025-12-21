import * as historyRepo from '@/repositories/history.repository.js'

export async function createHistory(data) {
  const newHistory = await historyRepo.createHistory(data)
  return newHistory
}

export async function getHistoryById(id) {
  const history = await historyRepo.getHistoryById(id)
  return history
}

export async function updateHistory(id, data) {
  const updatedHistory = await historyRepo.updateHistory(id, data)
  return updatedHistory
}

export async function deleteHistory(id) {
  await historyRepo.deleteHistory(id)
}

export async function findAllHistories(filters) {
  const histories = await historyRepo.findAllHistories(filters)
  return histories
}

export async function deleteManyHistories(_ids) {
  await historyRepo.deleteManyHistories(_ids)
}
