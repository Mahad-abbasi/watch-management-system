import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'  // ← ADD THIS

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // ← ADD THIS
  ],
  server: {
    port: 5175,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})