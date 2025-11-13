import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { churchtoolsClient } from '@churchtools/churchtools-client'
import App from './App.vue'
import router from './router'
import type { Person } from './utils/ct-types'

// only import reset.css in development mode to keep the production bundle small and to simulate CT environment
if (import.meta.env.MODE === 'development') {
    import('./utils/reset.css')
}

declare global {
    interface Window {
        settings: {
            base_url?: string;
        };
        APP_KEY?: string;
    }
}

// Initialize the app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)

// Mount the app
app.mount('#app')

// Initialize ChurchTools connection in the background
const initChurchTools = async () => {
    try {
        const baseUrl = window.settings?.base_url ?? import.meta.env.VITE_BASE_URL
        churchtoolsClient.setBaseUrl(baseUrl)

        const username = import.meta.env.VITE_USERNAME
        const password = import.meta.env.VITE_PASSWORD
        
        if (import.meta.env.MODE === 'development' && username && password) {
            await churchtoolsClient.post('/login', { username, password })
            const user = await churchtoolsClient.get<Person>('/whoami')
            console.log('Logged in as:', user.firstName, user.lastName)
        }

        const KEY = import.meta.env.VITE_KEY
        window.APP_KEY = KEY // Export KEY to window for global access if needed
    } catch (error) {
        console.error('Error initializing ChurchTools connection:', error)
    }
}

// Start the initialization in the background
initChurchTools()
