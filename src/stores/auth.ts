import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { loginWithChurchTools } from '@/services/authService'
import type { User } from '@/types/auth'

export interface AuthResponse {
  user: User
  token: string
}

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const returnUrl = ref<string | null>(null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function login(credentials: { username: string; password: string }) {
    try {
      const response = await loginWithChurchTools(credentials)
      if (response) {
        user.value = response.user
        token.value = response.token
        if (response.token) {
          localStorage.setItem('auth_token', response.token)
        }
        
        // Redirect to the original URL or home
        router.push(returnUrl.value || '/')
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  function logout(): void {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
    router.push('/login')
  }

  function setReturnUrl(url: string): void {
    returnUrl.value = url
  }

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    setReturnUrl
  }
})
