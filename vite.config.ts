import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chart-vendor': ['recharts'],
          'icons-vendor': ['lucide-react'],
        },
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|gif|svg/.test(ext)) {
            return `images/[name].[hash][extname]`
          }
          if (/woff|woff2|eot|ttf|otf/.test(ext)) {
            return `fonts/[name].[hash][extname]`
          }
          if (ext === 'css') {
            return `css/[name].[hash][extname]`
          }
          return `assets/[name].[hash][extname]`
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
  },
  server: {
    port: 3000,
    host: true,
    open: true,
  },
})
