import mongoose from 'mongoose'

const HistorySchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    shop_id: {
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

// createdAt DESC, _id DESC for each user
HistorySchema.index({ user_id: 1, createdAt: -1, _id: -1 })

const History = mongoose.model('History', HistorySchema)

export default History
