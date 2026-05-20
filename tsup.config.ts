import { copyFile } from 'node:fs/promises'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom', 'lucide-react'],
  onSuccess: async () => {
    await Promise.all([
      copyFile('src/styles.css', 'dist/styles.css'),
      copyFile('src/styles.css', 'dist/index.css'),
    ])
  },
})
