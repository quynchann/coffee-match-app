import mongoose from 'mongoose'

const FavoriteSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
)

// prevent duplicate favorites for same user/shop
FavoriteSchema.index({ user_id: 1, shop_id: 1 }, { unique: true })

const Favorite = mongoose.model('Favorite', FavoriteSchema)

export default Favorite
