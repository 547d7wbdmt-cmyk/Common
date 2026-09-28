import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `vite build --mode artifact` produces one self-contained HTML file for sharing.
export default defineConfig(({ mode }) => ({
  plugins: mode === 'artifact' ? [react(), viteSingleFile()] : [react()],
  build: mode === 'artifact' ? { outDir: 'dist-artifact' } : {},
}))
