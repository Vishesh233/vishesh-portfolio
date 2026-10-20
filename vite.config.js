import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Keep the motion runtime in its own chunk. Framer Motion is only used
        // for scroll reveals and small interactions, so splitting it out keeps
        // it cached independently of application code.
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion')) return 'motion'
        },
      },
    },
  },
})
