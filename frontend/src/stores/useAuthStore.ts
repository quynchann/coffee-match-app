import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toast } from 'sonner'
import { authAPI } from '../services/auth.api.js'
import type { AuthState } from '../types/store.js'

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      isAuthenticated: false,
      user: null,
      loading: false,

      clearState: () => {
        set({
          accessToken: null,
          isAuthenticated: false,
          user: null,
          loading: false,
        })
      },

      signup: async (email, password, username, address, age) => {
        try {
          set({ loading: true })
          await authAPI.signup(email, username, password, address, age)
          toast.success('登録が完了しました！ログインしてください。')
        } catch (error) {
          console.error('Registration error:', error)
          toast.error('登録に失敗しました。もう一度お試しください。')
        } finally {
          set({ loading: false })
        }
      },

      signin: async (email, password) => {
        try {
          set({ loading: true })
          const dataAPI = await authAPI.signin(email, password)
          set({
            accessToken: dataAPI.data.accessToken,
            isAuthenticated: true,
            user: dataAPI.data.user,
          })

          toast.success('ログインしました！')
        } catch (error) {
          console.error('Login error:', error)
          toast.error(
            'ログインに失敗しました。認証情報を確認して、もう一度お試しください。',
          )
        } finally {
          set({ loading: false })
        }
      },

      signout: () => {
        get().clearState()
        localStorage.removeItem('auth-storage')
        toast.success('ログアウトしました。')
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    },
  ),
)
