import { cpSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const srcDocs = resolve(__dirname, '../../../packages/interact/docs');
const destDocs = resolve(__dirname, '../dist/docs');

const srcRules = resolve(__dirname, '../../../packages/interact/rules');
const destRules = resolve(__dirname, '../dist/rules');

// Create dest directory if it doesn't exist
if (!existsSync(dirname(destDocs))) {
  mkdirSync(dirname(destDocs), { recursive: true });
}

// Copy docs to dist
cpSync(srcDocs, destDocs, { recursive: true });

console.log('✓ Docs copied to dist/docs');

// Copy rules to dist
cpSync(srcRules, destRules, { recursive: true });

console.log('✓ Rules copied to dist/rules');

