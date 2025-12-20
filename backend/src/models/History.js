import mongoose from 'mongoose'

const HistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
)

// index to query recent history per user quickly
HistorySchema.index({ user: 1, createdAt: -1 })

const History = mongoose.model('History', HistorySchema)

export default History
