import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { churchtoolsClient } from '@churchtools/churchtools-client'
import App from './App.vue'
import router from './router'

// Configure ChurchTools client
declare const window: Window & {
  settings?: {
    base_url?: string
  }
}

// Set base URL from window settings or environment variable
const baseUrl = window.settings?.base_url ?? import.meta.env.VITE_BASE_URL
if (baseUrl) {
  churchtoolsClient.setBaseUrl(baseUrl)
  
  // Auto-login in development mode if credentials are provided
  if (import.meta.env.DEV) {
    const username = import.meta.env.VITE_USERNAME
    const password = import.meta.env.VITE_PASSWORD
    
    if (username && password) {
        debugger;
      churchtoolsClient.post('/login', { username, password })
        .catch(error => console.error('Auto-login failed:', error))
    }
  }
}

// Create and mount the app
const app = createApp(App)

// Use Pinia for state management
app.use(createPinia())

// Use router
app.use(router)

// Mount the app
app.mount('#app')
