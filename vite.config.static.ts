import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  root: 'client',
  plugins: [react()],
  base: '/map_manager_example_frontend_usage', // Replace with your GitHub repo name
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
      '@assets': path.resolve(__dirname, './client/public/assets')
    }
  },
  build: {
    outDir: '../dist',
    sourcemap: true
  }
})