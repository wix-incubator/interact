/**
 * Shared utility for resolving rule references.
 * Supports both local file:// paths and https:// URLs (fetched via curl, cached locally).
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CACHE_DIR = path.resolve(__dirname, '..', '.rules-cache');

const memoryCache = {};

function ensureCacheDir() {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
}

function urlToCachePath(url) {
  const slug = url
    .replace(/^https?:\/\//, '')
    .replace(/[^a-zA-Z0-9._-]/g, '_');
  return path.join(CACHE_DIR, slug);
}

function fetchUrl(url) {
  if (memoryCache[url]) return memoryCache[url];

  ensureCacheDir();
  const cachePath = urlToCachePath(url);

  if (fs.existsSync(cachePath)) {
    const content = fs.readFileSync(cachePath, 'utf8');
    memoryCache[url] = content;
    return content;
  }

  try {
    const content = execSync(`curl -fsSL "${url}"`, {
      encoding: 'utf8',
      timeout: 15000,
    });
    fs.writeFileSync(cachePath, content);
    memoryCache[url] = content;
    return content;
  } catch (err) {
    console.error(`Failed to fetch ${url}: ${err.message}`);
    return '';
  }
}

function readFileRef(ref, baseDir) {
  const filePath = ref.replace(/^file:\/\//, '');
  const resolved = path.resolve(baseDir, filePath);
  return fs.readFileSync(resolved, 'utf8');
}

/**
 * Resolve a rules reference to its content string.
 * @param {string} ref - A file:// path or https:// URL
 * @param {string} baseDir - Base directory for resolving file:// paths
 * @returns {string} The rule file content
 */
function resolveRules(ref, baseDir) {
  if (!ref) return '';
  if (ref.startsWith('https://') || ref.startsWith('http://')) {
    return fetchUrl(ref);
  }
  if (ref.startsWith('file://')) {
    return readFileRef(ref, baseDir);
  }
  // Assume local path
  const resolved = path.resolve(baseDir, ref);
  if (fs.existsSync(resolved)) {
    return fs.readFileSync(resolved, 'utf8');
  }
  return '';
}

/**
 * Clear the local rules cache.
 */
function clearCache() {
  if (fs.existsSync(CACHE_DIR)) {
    for (const f of fs.readdirSync(CACHE_DIR)) {
      fs.unlinkSync(path.join(CACHE_DIR, f));
    }
  }
  Object.keys(memoryCache).forEach((k) => delete memoryCache[k]);
}

module.exports = { resolveRules, clearCache, CACHE_DIR };
