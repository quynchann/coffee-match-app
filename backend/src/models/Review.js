import mongoose from 'mongoose'
const Shop = require('./Shop')

const ReviewSchema = new mongoose.Schema(
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
      index: true // Index để load nhanh list comment của 1 quán
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    content: {
      type: String,
      trim: true
    },
    images: {
      type: [String]
    }
  },
  { timestamps: true }
)

// Tự động tính lại điểm trung bình cho Shop sau khi lưu Review mới
ReviewSchema.post('save', async function () {
  const shopId = this.shop_id

  // Tính toán lại bằng Aggregation
  const result = await this.constructor.aggregate([
    { $match: { shop_id: shopId } },
    {
      $group: {
        _id: '$shop_id',
        avgRating: { $avg: '$rating' },
        count: { $sum: 1 }
      }
    }
  ])

  if (result.length > 0) {
    await Shop.findByIdAndUpdate(shopId, {
      rating: result[0].avgRating.toFixed(1), // Làm tròn 1 số lẻ (4.5)
      totalReviews: result[0].count
    })
  }
})

const Review = mongoose.model('Review', ReviewSchema)

export default Review
