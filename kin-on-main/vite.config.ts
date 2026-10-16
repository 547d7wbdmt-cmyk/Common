import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // `npm run build:artifact` makes one self-contained page (assets inlined) for sharing.
  ...(mode === 'artifact' && {
    base: './',
    build: { outDir: 'dist-artifact', assetsInlineLimit: 100_000_000, cssCodeSplit: false },
  }),
}))
