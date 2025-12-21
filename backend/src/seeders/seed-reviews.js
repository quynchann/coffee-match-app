import 'dotenv/config'
import Review from '@/models/Review.js'
import Shop from '@/models/Shop.js'
import User from '@/models/User.js'

const rawShopsData = [
  {
    name: 'Highlands Coffee',
    reviews: [
      {
        rating: 5,
        content:
          '店内は綺麗で、スタッフもフレンドリー。ドリンクも美味しいです！'
      }
    ]
  }
]

const seedReviews = async () => {
  try {
    await Review.deleteMany()
    console.log('Reviews cleared')

    const allUsers = await User.find()
    const allShops = await Shop.find()

    if (allUsers.length === 0 || allShops.length === 0) {
      console.log('Please seed Users and Shops first!')
      return
    }

    const reviewsToInsert = []

    for (const rawShop of rawShopsData) {
      if (!rawShop.reviews || rawShop.reviews.length === 0) continue

      const dbShop = allShops.find((s) => s.name === rawShop.name)

      if (dbShop) {
        for (const review of rawShop.reviews) {
          const randomUser =
            allUsers[Math.floor(Math.random() * allUsers.length)]

          reviewsToInsert.push({
            user_id: randomUser._id,
            shop_id: dbShop._id,
            rating: review.rating,
            content: review.content,
            images: []
          })
        }
      }
    }

    if (reviewsToInsert.length > 0) {
      await Review.insertMany(reviewsToInsert)
      console.log(`${reviewsToInsert.length} Reviews added`)

      // Lưu ý: Vì ReviewSchema có hook post('save') để cập nhật lại Shop rating,
      // nhưng insertMany thường không kích hoạt hook này mặc định ở một số phiên bản cũ.
      // Tuy nhiên, logic trong seed-shop đã set rating cứng rồi, nên không sao.
      // Nếu muốn kích hoạt tính toán lại, bạn có thể loop và dùng .save() thay vì insertMany.
    } else {
      console.log('No reviews found in raw data to insert')
    }
  } catch (error) {
    console.error(`Error seeding reviews: ${error}`)
    throw error
  }
}

export default seedReviews
