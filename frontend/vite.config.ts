import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
<<<<<<< HEAD
  },
})
=======
    host: '127.0.0.1',
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  }
});
>>>>>>> 2aa74be493c8cc2d0d30fdf6d2788702d2b0e7ba
