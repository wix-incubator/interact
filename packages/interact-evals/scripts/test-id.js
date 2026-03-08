/**
 * Shared test ID generation. Used by cursor-batch.js and generate-prompts.js
 * to ensure IDs are consistent across the pipeline.
 */

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

/**
 * Strip expected-answer hints from test descriptions before slugifying.
 * Removes parenthetical hints like "(alternate + SlideIn)" and
 * effect type suffixes like "with keyframeEffect".
 */
function stripHints(description) {
  return description
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/\s+with\s+(named\s*effect|keyframe\s*effect|transition|custom\s*effect)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function generateTestId(index, category, description) {
  return `${String(index).padStart(2, '0')}-${category}-${slugify(stripHints(description))}`;
}

module.exports = { slugify, stripHints, generateTestId };
