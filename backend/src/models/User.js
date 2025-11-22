import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    fullname: {
      type: String
    },
    address: {
      type: String
    },
    age: {
      type: Number
    },
    styles: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', userSchema)

export default User
