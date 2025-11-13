export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'user' | 'admin'
  avatar?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}
