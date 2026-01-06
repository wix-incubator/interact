import { defineConfig, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Validates that the resolved path is within the allowed base directory
// Prevents path traversal attacks using ../ sequences
function getSafeFilePath(baseDir: string, requestUrl: string): string | null {
  // Resolve the absolute path
  const resolvedPath = path.resolve(baseDir, '.' + requestUrl);
  
  // Check the resolved path is within the base directory
  if (!resolvedPath.startsWith(baseDir + path.sep) && resolvedPath !== baseDir) {
    return null;
  }
  
  // If file exists, also verify via realpath (handles symlinks)
  if (fs.existsSync(resolvedPath)) {
    try {
      const realPath = fs.realpathSync(resolvedPath);
      const realBaseDir = fs.realpathSync(baseDir);
      if (!realPath.startsWith(realBaseDir + path.sep) && realPath !== realBaseDir) {
        return null;
      }
    } catch {
      return null;
    }
  }
  
  return resolvedPath;
}

// Custom plugin to serve markdown files from packages/interact/docs
function serveDocsPlugin() {
  const docsPath = path.resolve(__dirname, '../../packages/interact/docs');
  
  return {
    name: 'serve-docs',
    configureServer(server: ViteDevServer) {
      server.middlewares.use('/docs', (req, res, next) => {
        const filePath = getSafeFilePath(docsPath, req.url || '');
        
        if (filePath && fs.existsSync(filePath) && filePath.endsWith('.md')) {
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
        const filePath = getSafeFilePath(rulesPath, req.url || '');
        
        if (filePath && fs.existsSync(filePath) && filePath.endsWith('.md')) {
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
  // Use VITE_BASE env var for GitHub Pages deployment, default to '/' for local dev
  base: process.env.VITE_BASE || '/',
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
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  }
});
