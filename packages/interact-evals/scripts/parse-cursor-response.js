#!/usr/bin/env node

/**
 * Parse a Cursor batch response into individual output files for scoring.
 *
 * Usage:  node scripts/parse-cursor-response.js [with-rules|without-rules]
 *
 * Reads:  results/cursor-batch-{variant}-response.md
 * Writes: results/outputs/{id}__{variant}.txt (one per test case)
 */

const fs = require('fs');
const path = require('path');

const EVALS_DIR = path.resolve(__dirname, '..');
const RESULTS_DIR = path.join(EVALS_DIR, 'results');
const OUTPUTS_DIR = path.join(RESULTS_DIR, 'outputs');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function parseResponseFile(filePath, variant) {
  const content = fs.readFileSync(filePath, 'utf8');
  let count = 0;

  // Parse sections delimited by "=== ID: {id} ==="
  const regex = /===\s*ID:\s*([^\s=]+)\s*===([\s\S]*?)(?=(?:===\s*ID:|$))/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const id = match[1].trim();
    let code = match[2].trim();

    // Strip markdown code fences if present
    code = code.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim();

    const outputPath = path.join(OUTPUTS_DIR, `${id}__${variant}.txt`);
    fs.writeFileSync(outputPath, code);
    count++;
  }

  if (count === 0) {
    // Try alternative parsing: look for sections between "### Test:" headers
    const altRegex = /###\s*Test:\s*([^\n]+)\n([\s\S]*?)(?=(?:###\s*Test:|$))/g;
    while ((match = altRegex.exec(content)) !== null) {
      const id = match[1].trim();
      let code = match[2].trim();
      code = code.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim();
      const outputPath = path.join(OUTPUTS_DIR, `${id}__${variant}.txt`);
      fs.writeFileSync(outputPath, code);
      count++;
    }
  }

  return count;
}

function main() {
  const variant = process.argv[2] || 'with-rules';

  ensureDir(OUTPUTS_DIR);

  // Find all response files for this variant
  const responseFiles = fs
    .readdirSync(RESULTS_DIR)
    .filter((f) => f.startsWith(`cursor-batch-${variant}-`) && f.endsWith('-response.md'))
    .map((f) => path.join(RESULTS_DIR, f));

  // Also check for a single combined response file
  const singleResponse = path.join(RESULTS_DIR, `cursor-batch-${variant}-response.md`);
  if (fs.existsSync(singleResponse)) {
    responseFiles.push(singleResponse);
  }

  if (responseFiles.length === 0) {
    console.error(`No response files found for variant "${variant}".`);
    console.error('Expected files matching: results/cursor-batch-' + variant + '-*-response.md');
    process.exit(1);
  }

  let totalCount = 0;
  for (const filePath of responseFiles) {
    const count = parseResponseFile(filePath, variant);
    console.log(`  ${path.basename(filePath)}: ${count} outputs`);
    totalCount += count;
  }

  if (totalCount === 0) {
    console.error('Could not parse any test outputs from the response files.');
    console.error('Expected format: "=== ID: {test-id} ===" followed by the config code.');
    process.exit(1);
  }

  console.log(`\nTotal: ${totalCount} outputs parsed`);
  console.log(`Written to: ${OUTPUTS_DIR}/`);
  console.log('');
  console.log('Next: node scripts/score-outputs.js');
}

main();
