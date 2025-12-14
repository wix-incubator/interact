import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  resolve: {
    alias: {
      '@wix/interact/web': path.resolve(__dirname, 'packages/interact/src/web/index.ts'),
      '@wix/interact': path.resolve(__dirname, 'packages/interact/src/index.ts'),
      '@wix/motion': path.resolve(__dirname, 'packages/motion/src/index.ts'),
    },
  },
});
