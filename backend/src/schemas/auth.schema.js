import { z } from 'zod'

const username = z.string().min(3)
const email = z.email()
const password = z
  .string()
  .min(6, 'Password must be at least 6 characters long')
const fullname = z.string()
const address = z.string()
const age = z.coerce.number().min(0)
const styles = z.array(z.string())

export const signup = z.strictObject({
  username,
  email,
  password,
  fullname,
  address,
  age,
  styles
})

export const signin = z.strictObject({
  username,
  password
})

export const refreshToken = z.strictObject({
  refreshToken: z.string()
})
