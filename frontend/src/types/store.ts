import type { User } from './user'

export interface AuthState {
  accessToken: string | null
  isAuthenticated: boolean
  user: User | null
  loading: boolean

  clearState: () => void

  signup: (
    email: string,
    password: string,
    username: string,
    address?: string,
    age?: number,
  ) => Promise<void>

  signin: (email: string, password: string) => Promise<void>

  signout: () => void
}
