import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname),
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@content': path.resolve(__dirname, '..', 'content'),
    },
  },
  server: {
    fs: {
      allow: [
        path.resolve(__dirname, '..'),
      ],
    },
  },
})
