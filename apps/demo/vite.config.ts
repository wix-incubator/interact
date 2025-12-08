import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@wix/interact/web': path.resolve(__dirname, '../../packages/interact/src/web'),
      '@wix/interact/react': path.resolve(__dirname, '../../packages/interact/src/react'),
      '@wix/interact': path.resolve(__dirname, '../../packages/interact/src/index'),
    }
  },
  server: {
    port: 4174
  }
});

