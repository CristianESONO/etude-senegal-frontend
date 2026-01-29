// vite.config.ts - VERSION CORRIGÉE
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // IMPORTANT: Ajoutez cette importation

export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // ⬅️ AJOUTEZ CE PLUGIN
  ],
  css: {
    postcss: false, // Désactive PostCSS car @tailwindcss/vite le gère
  },
  // ✅ POUR VERCEL : Supprimez le proxy ou utilisez une condition
  server: process.env.NODE_ENV === 'development' ? {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    },
    port: 5173,
    host: true,
  } : undefined,
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react']
        }
      }
    }
  }
})