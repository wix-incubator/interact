import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default defineConfig(({ command }) => {
  const isDev = command === 'serve';

  return {
    // plugins: [react()],
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: 'Interact',
        fileName: (format: string) => `${format}/interact.js`,
        formats: ['es', 'cjs']
      },
      sourcemap: true,
      rollupOptions: {
        external: ['@wix/motion']
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    define: {
      __DEV__: isDev
    }
  };
});

