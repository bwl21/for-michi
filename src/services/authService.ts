import axios from 'axios'
import type { LoginCredentials, AuthResponse } from '@/types/auth'

const API_BASE_URL = import.meta.env.VITE_CT_API_URL

export async function loginWithChurchTools(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      username: credentials.username,
      password: credentials.password,
      redirect: 'false'
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    if (response.data.status === 'success' && response.data.data?.token) {
      const userData = await fetchCurrentUser(response.data.data.token)
      
      return {
        user: {
          id: userData.id.toString(),
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          role: userData.role
        },
        token: response.data.data.token
      }
    }
    
    throw new Error('Authentication failed')
  } catch (error) {
    console.error('Login error:', error)
    throw new Error('Failed to authenticate with ChurchTools')
  }
}

async function fetchCurrentUser(token: string) {
  const response = await axios.get(`${API_BASE_URL}/whoami`, {
    headers: { 'Authorization': `Login ${token}` }
  })
  
  if (response.data.status === 'success') {
    return response.data.data
  }
  
  throw new Error('Failed to fetch user data')
}

export function logout() {
  // Clear token from storage
  localStorage.removeItem('auth_token')
  
  // Redirect to login
  window.location.href = '/login'
}

export function getAuthHeader() {
  const token = localStorage.getItem('auth_token')
  return token ? { 'Authorization': `Login ${token}` } : {}
}
