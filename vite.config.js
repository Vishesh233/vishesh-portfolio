import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Keep the motion runtime in its own chunk. When the React Three
        // Fiber scenes land they will be code-split the same way, so the
        // first paint never waits on 3D.
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion')) return 'motion'
        },
      },
    },
  },
})
