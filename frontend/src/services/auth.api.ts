import instance from './axios.customize.js'

export const authAPI = {
  signin: async (email: string, password: string) => {
    const res = await instance.post('/auth/signin', { email, password })
    return res.data
  },

  signup: async (
    email: string,
    username: string,
    password: string,
    address?: string,
    age?: number,
  ) => {
    const res = await instance.post('/auth/signup', {
      email,
      username,
      password,
      address,
      age,
    })
    return res.data
  },
}
