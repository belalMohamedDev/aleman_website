import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    watch: {
      usePolling: true,
      interval: 1000,
    },
    proxy: {
      '/api': {
        target: 'http://alemanapp.runasp.net',
        changeOrigin: true,
        secure: false,
      },
      '/images': {
        target: 'http://alemanapp.runasp.net',
        changeOrigin: true,
        secure: false,
      },
      '/modules/recruitment': {
        target: 'https://www.alemanfeed.com',
        changeOrigin: true,
        secure: false,
      },
      '/aleman': {
        target: 'https://10.0.2.199',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
