import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { churchtoolsClient } from '@churchtools/churchtools-client';
import App from './App.vue';
import './style.css';

// Import Markdown styles (isolated from application CSS)
import './styles/markdown/index.css';

// only import reset.css in development mode to keep the production bundle small and to simulate CT environment
if (import.meta.env.MODE === 'development') {
    import('./utils/reset.css');
}

// Configure ChurchTools client
declare const window: Window & {
  settings?: {
    base_url?: string;
  };
};
const baseUrl = window.settings?.base_url ?? import.meta.env.VITE_BASE_URL;
if (baseUrl) {
  churchtoolsClient.setBaseUrl(baseUrl);
  
  // Auto-login in development mode if credentials are provided
  if (import.meta.env.DEV) {
    const username = import.meta.env.VITE_USERNAME;
    const password = import.meta.env.VITE_PASSWORD;
    
    if (username && password) {
      churchtoolsClient.post('/login', { username, password })
        .catch(error => console.error('Auto-login failed:', error));
    }
  }
}

// Create and mount the app
const app = createApp(App);

// Use Pinia for state management
app.use(createPinia());

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Vue error:', { err, instance, info });
  // You could add error reporting here (e.g., Sentry, LogRocket)
};

// Global properties
app.config.globalProperties.$ct = churchtoolsClient;

// Mount the app
app.mount('#app');

// Export for potential programmatic usage
export { churchtoolsClient };
