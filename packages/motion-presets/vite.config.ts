import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(() => ({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'MotionPresets',
      fileName: (format: string) => `${format}/motion-presets.js`,
      formats: ['es' as const, 'cjs' as const],
    },
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      external: ['@wix/motion'],
      output: {
        globals: {
          '@wix/motion': 'Motion',
        },
      },
    },
  }
}));



