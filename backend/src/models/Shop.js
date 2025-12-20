import mongoose from 'mongoose'

// Sub-schema Menu items
const MenuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String }
  },
  { _id: false }
)

const ShopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: 'text' // Tạo text index để tìm kiếm theo tên gần đúng
    },

    purpose: {
      type: [String],
      index: true // Index để lọc nhanh theo mục đích
    },
    amenities: {
      type: [String],
      index: true // Index để lọc nhanh theo tiện ích
    },
    features: {
      type: [String]
    },

    hours: {
      open: { type: String }, // Format "HH:mm" (VD: "07:00")
      close: { type: String } // Format "HH:mm" (VD: "23:00")
    },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere' // Index đặc biệt để tính khoảng cách
      }
      // Lưu ý: coordinates phải là [Longitude, Latitude] (Kinh độ trước, Vĩ độ sau)
    },

    address: { type: String, required: true },
    area: { type: String, index: true },

    priceRange: {
      min: { type: Number, default: 0, index: true },
      max: { type: Number, default: 0, index: true }
    },
    description: { type: String },
    phone: { type: String },
    images: { type: [String] },

    menu: [MenuItemSchema],

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      index: true // Index để sort quán ngon
    },
    totalReviews: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
)

const Shop = mongoose.model('Shop', ShopSchema)

export default Shop
