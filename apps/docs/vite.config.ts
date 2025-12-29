import { defineConfig, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom plugin to serve markdown files from packages/interact/docs
function serveDocsPlugin() {
  const docsPath = path.resolve(__dirname, '../../packages/interact/docs');
  
  return {
    name: 'serve-docs',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/docs', (req, res, next) => {
        const filePath = path.join(docsPath, req.url || '');
        
        if (fs.existsSync(filePath) && filePath.endsWith('.md')) {
          const content = fs.readFileSync(filePath, 'utf-8');
          res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
          res.end(content);
        } else {
          next();
        }
      });
    }
  };
}

// Custom plugin to serve rules markdown files from packages/interact/rules
function serveRulesPlugin() {
  const rulesPath = path.resolve(__dirname, '../../packages/interact/rules');
  
  return {
    name: 'serve-rules',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/rules', (req, res, next) => {
        const filePath = path.join(rulesPath, req.url || '');
        
        if (fs.existsSync(filePath) && filePath.endsWith('.md')) {
          const content = fs.readFileSync(filePath, 'utf-8');
          res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
          res.end(content);
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    serveDocsPlugin(),
    serveRulesPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@wix/interact': path.resolve(__dirname, '../../packages/interact/src'),
      '@docs': path.resolve(__dirname, '../../packages/interact/docs')
    }
  },
  server: {
    port: 4173
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  }
});
