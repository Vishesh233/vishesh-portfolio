import { defineConfig } from 'vitest/config'

/**
 * Separate from vite.config.js on purpose: the test run needs no Tailwind
 * plugin, no image pipeline and no build-time defines — only the JSX transform
 * Vite already provides and a DOM environment.
 */
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
  },
})