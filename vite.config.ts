import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    base: env.VITE_APP_BASE_URL || '/',
    
    plugins: [
      vue({
        script: {
          defineModel: true,
          propsDestructure: true
        }
      }),
      vueJsx(),
    ],
    
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
      extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue']
    },
    
    server: {
      port: 5173,
      open: true,
      proxy: {
        // Proxy API requests to your backend
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode !== 'production',
      minify: mode === 'production' ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            'vue-vendor': ['vue', 'vue-router', 'pinia', 'vue-i18n'],
            'ui-vendor': ['@vueuse/core', 'vee-validate', 'yup']
          }
        }
      }
    },
    
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/styles/variables.scss";`
        }
      }
    },
    
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(process.env.npm_package_version)
    },
    
    optimizeDeps: {
      include: ['vue', 'vue-router', 'pinia', 'vue-i18n', '@vueuse/core'],
      esbuildOptions: {
        target: 'esnext' // or 'es2022'
      }
    }
  }
})
