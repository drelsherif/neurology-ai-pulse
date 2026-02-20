import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set this to your GitHub repo name, e.g. '/neurology-ai-pulse/'
// If deploying to a custom domain (username.github.io), set to '/'
const BASE_PATH = '/neurology-ai-pulse/'

export default defineConfig({
  plugins: [react()],
  base: BASE_PATH,
})
