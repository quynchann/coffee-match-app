import bcrypt from 'bcryptjs'

const saltRounds = 10

export async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(saltRounds)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  } catch (error) {
    throw new Error(`Hashing password failed: ${error.message}`)
  }
}

export async function comparePassword(password, hashedPassword) {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    throw new Error(`Comparing password failed: ${error.message}`)
  }
}
