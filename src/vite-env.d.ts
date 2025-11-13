/// <reference types="vite/client" />

// Vue files
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// CSS modules
declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

// Environment variables
declare interface ImportMetaEnv {
  readonly VITE_APP_BASE_URL: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_CT_API_BASE_URL: string
  readonly VITE_CT_CLIENT_ID: string
  readonly VITE_CT_REDIRECT_URI: string
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv
}
