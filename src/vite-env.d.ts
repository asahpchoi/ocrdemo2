/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AZURE_ENDPOINT: string
  readonly VITE_AZURE_API_KEY: string
  readonly VITE_AZURE_DEPLOYMENT_NAME: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
