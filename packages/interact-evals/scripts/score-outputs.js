#!/usr/bin/env node

/**
 * Phase 2: Score collected LLM outputs against assertions.
 * No API key required — all scoring is local.
 *
 * Usage:  node scripts/score-outputs.js
 *
 * Reads:
 *   - results/manifest.json (test case metadata)
 *   - results/outputs/*.txt  (LLM outputs you collected)
 *
 * Outputs:
 *   - results/scores.json   (detailed per-test scores)
 *   - Console summary       (aggregated results)
 */

const fs = require('fs');
const path = require('path');
const { resolveRules } = require('./resolve-rules');

const EVALS_DIR = path.resolve(__dirname, '..');
const RESULTS_DIR = path.join(EVALS_DIR, 'results');
const OUTPUTS_DIR = path.join(RESULTS_DIR, 'outputs');

const validConfig = require(path.join(EVALS_DIR, 'assertions', 'valid-config.js'));
const antiPatterns = require(path.join(EVALS_DIR, 'assertions', 'anti-patterns.js'));

const triggerCheckers = {};
for (const trigger of ['click', 'hover', 'viewenter', 'viewprogress', 'pointermove']) {
  const filePath = path.join(EVALS_DIR, 'assertions', `${trigger}-checks.js`);
  if (fs.existsSync(filePath)) {
    triggerCheckers[trigger] = require(filePath);
  }
}

/**
 * Estimate token count from text.
 * Uses a word/symbol splitting heuristic that closely approximates
 * BPE tokenizers (GPT/Claude) for code-heavy content.
 */
function estimateTokens(text) {
  // Split on whitespace, then count sub-word tokens for long identifiers
  // and punctuation. Roughly: 1 word ≈ 1.3 tokens for code.
  const words = text.split(/\s+/).filter(Boolean);
  let tokens = 0;
  for (const word of words) {
    if (word.length <= 4) {
      tokens += 1;
    } else if (word.length <= 10) {
      tokens += Math.ceil(word.length / 4);
    } else {
      tokens += Math.ceil(word.length / 3.5);
    }
  }
  return tokens;
}

function runContainsAssert(output, assertion) {
  const value = assertion.value;
  if (typeof value === 'string') {
    const pass = output.includes(value);
    return { pass, score: pass ? 1 : 0, reason: pass ? `Contains "${value}"` : `Missing "${value}"` };
  }
  return { pass: true, score: 1, reason: 'skip' };
}

function runContainsAnyAssert(output, assertion) {
  const values = assertion.value;
  if (Array.isArray(values)) {
    const found = values.find((v) => output.includes(v));
    const pass = !!found;
    return {
      pass,
      score: pass ? 1 : 0,
      reason: pass ? `Contains "${found}"` : `Missing any of: ${values.join(', ')}`,
    };
  }
  return { pass: true, score: 1, reason: 'skip' };
}

function runNotContainsAssert(output, assertion) {
  const value = assertion.value;
  if (typeof value === 'string') {
    const lower = output.toLowerCase();
    const pass = !lower.includes(value.toLowerCase());
    return {
      pass,
      score: pass ? 1 : 0,
      reason: pass ? `Does not contain "${value}"` : `Unexpectedly contains "${value}"`,
    };
  }
  return { pass: true, score: 1, reason: 'skip' };
}

function scoreOutput(output, testCase) {
  const results = [];
  const vars = {
    expected_trigger: testCase.expected_trigger,
    expected: testCase.expected,
  };

  // Default assertions
  results.push({
    name: 'structure',
    ...validConfig(output, { vars }),
    weight: 2,
  });

  results.push({
    name: 'anti_patterns',
    ...antiPatterns(output, { vars }),
    weight: 2,
  });

  results.push({
    name: 'compliance',
    ...runNotContainsAssert(output, { value: "I can't" }),
    weight: 1,
  });

  results.push({
    name: 'compliance_2',
    ...runNotContainsAssert(output, { value: 'I cannot' }),
    weight: 1,
  });

  // Trigger-specific checks
  const trigger = testCase.expected_trigger;
  const triggerKey = trigger ? trigger.toLowerCase() : '';
  if (triggerCheckers[triggerKey]) {
    results.push({
      name: 'semantic',
      ...triggerCheckers[triggerKey](output, { vars }),
      weight: 3,
    });
  }

  // Inline assertions from test case
  for (const assert of testCase.asserts) {
    if (assert.type === 'javascript') continue; // already handled above

    let result;
    switch (assert.type) {
      case 'contains':
        result = runContainsAssert(output, assert);
        break;
      case 'contains-any':
        result = runContainsAnyAssert(output, assert);
        break;
      case 'not-contains':
      case 'not-icontains':
        result = runNotContainsAssert(output, assert);
        break;
      default:
        continue;
    }

    results.push({
      name: assert.metric || assert.type,
      ...result,
      weight: assert.weight || 1,
    });
  }

  // Weighted average
  let totalWeight = 0;
  let weightedScore = 0;
  for (const r of results) {
    totalWeight += r.weight;
    weightedScore += r.score * r.weight;
  }
  const finalScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
  const allPassed = results.every((r) => r.pass);

  return {
    score: Math.round(finalScore * 100) / 100,
    pass: allPassed,
    checks: results,
  };
}

function main() {
  const manifestPath = path.join(RESULTS_DIR, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('No manifest.json found. Run generate-prompts.js first.');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  if (!fs.existsSync(OUTPUTS_DIR)) {
    console.error('No results/outputs/ directory. Collect LLM outputs first.');
    process.exit(1);
  }

  const outputFiles = fs.readdirSync(OUTPUTS_DIR).filter((f) => f.endsWith('.txt'));
  if (outputFiles.length === 0) {
    console.error('No output files found in results/outputs/. Collect LLM outputs first.');
    process.exit(1);
  }

  const VARIANTS = ['with-rules', 'no-context'];
  const VARIANT_LABELS = {
    'with-rules': 'With Rules',
    'no-context': 'No Context',
  };

  function buildInputText(testCase, variant) {
    const isIntegration = testCase.category === 'integration';
    const instruction = isIntegration
      ? 'You are an expert at the @wix/interact animation library. Generate valid @wix/interact code based on user requests. Include the COMPLETE code: imports, config, and HTML/JSX as requested. No explanatory text.'
      : 'You are an expert at the @wix/interact animation library. Generate valid InteractConfig code based on user requests. Output ONLY the config object. Do not include imports, HTML, or explanatory text — just the config.';

    const parts = [instruction];

    if (variant === 'with-rules' && testCase.rulesRef) {
      parts.push(resolveRules(testCase.rulesRef, EVALS_DIR));
    }

    parts.push(testCase.prompt || '');
    return parts.join('\n');
  }

  const allScores = [];
  const categoryScores = {};
  const categoryOutputTokens = {};
  const categoryInputTokens = {};
  const variantScores = {};
  const variantOutputTokens = {};
  const variantInputTokens = {};
  for (const v of VARIANTS) {
    variantScores[v] = [];
    variantOutputTokens[v] = [];
    variantInputTokens[v] = [];
  }

  for (const testCase of manifest) {
    for (const variant of VARIANTS) {
      const filename = `${testCase.id}__${variant}.txt`;
      const filePath = path.join(OUTPUTS_DIR, filename);

      if (!fs.existsSync(filePath)) continue;

      const output = fs.readFileSync(filePath, 'utf8');
      const result = scoreOutput(output, testCase);
      const outputTokens = estimateTokens(output);
      const inputText = buildInputText(testCase, variant);
      const inputTokens = estimateTokens(inputText);

      const entry = {
        id: testCase.id,
        variant,
        category: testCase.category,
        description: testCase.description,
        inputTokens,
        outputTokens,
        chars: output.length,
        ...result,
      };

      allScores.push(entry);
      variantScores[variant].push(result.score);
      variantOutputTokens[variant].push(outputTokens);
      variantInputTokens[variant].push(inputTokens);

      if (!categoryScores[testCase.category]) {
        categoryScores[testCase.category] = {};
        categoryOutputTokens[testCase.category] = {};
        categoryInputTokens[testCase.category] = {};
        for (const v of VARIANTS) {
          categoryScores[testCase.category][v] = [];
          categoryOutputTokens[testCase.category][v] = [];
          categoryInputTokens[testCase.category][v] = [];
        }
      }
      categoryScores[testCase.category][variant].push(result.score);
      categoryOutputTokens[testCase.category][variant].push(outputTokens);
      categoryInputTokens[testCase.category][variant].push(inputTokens);
    }
  }

  // Save detailed results
  fs.writeFileSync(
    path.join(RESULTS_DIR, 'scores.json'),
    JSON.stringify(allScores, null, 2),
  );

  // Determine which variants have data
  const activeVariants = VARIANTS.filter((v) => variantScores[v].length > 0);

  const avg = (arr) => (arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length) : 0);
  const pct = (n) => `${Math.round(n * 100)}%`;

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                    @wix/interact Rules Eval Results                       ║');
  console.log('╠════════════════════════════════════════════════════════════════════════════╣');
  console.log('');

  // Header
  const colWidth = 13;
  let header = '  ' + 'Category'.padEnd(18);
  for (const v of activeVariants) header += VARIANT_LABELS[v].padStart(colWidth);
  if (activeVariants.length >= 2) header += '   Delta(1v' + activeVariants.length + ')';
  console.log(header);
  console.log('  ' + '─'.repeat(18 + activeVariants.length * colWidth + 12));

  for (const [cat, scores] of Object.entries(categoryScores).sort()) {
    let line = '  ' + cat.padEnd(18);
    const avgs = {};
    for (const v of activeVariants) {
      avgs[v] = avg(scores[v]);
      line += pct(avgs[v]).padStart(colWidth);
    }
    if (activeVariants.length >= 2) {
      const best = avgs[activeVariants[0]];
      const worst = avgs[activeVariants[activeVariants.length - 1]];
      const delta = best - worst;
      const deltaStr = delta > 0 ? `+${pct(delta)}` : delta < 0 ? pct(delta) : '0%';
      const indicator = delta > 0.05 ? ' ✓' : delta < -0.05 ? ' ✗' : '';
      line += `   ${deltaStr.padStart(5)}${indicator}`;
    }
    console.log(line);
  }

  console.log('  ' + '─'.repeat(18 + activeVariants.length * colWidth + 12));

  let overallLine = '  ' + 'OVERALL'.padEnd(18);
  const overallAvgs = {};
  for (const v of activeVariants) {
    overallAvgs[v] = avg(variantScores[v]);
    overallLine += pct(overallAvgs[v]).padStart(colWidth);
  }
  if (activeVariants.length >= 2) {
    const best = overallAvgs[activeVariants[0]];
    const worst = overallAvgs[activeVariants[activeVariants.length - 1]];
    const delta = best - worst;
    const deltaStr = delta > 0 ? `+${pct(delta)}` : pct(delta);
    overallLine += `   ${deltaStr.padStart(5)}`;
  }
  console.log(overallLine);

  // Token usage tables
  const num = (n) => Math.round(n).toLocaleString();
  const divider = '  ' + '─'.repeat(18 + activeVariants.length * colWidth);

  // --- Input tokens ---
  console.log('');
  console.log('  Avg Input Tokens (context window)');
  console.log('');

  let inHeader = '  ' + 'Category'.padEnd(18);
  for (const v of activeVariants) inHeader += VARIANT_LABELS[v].padStart(colWidth);
  console.log(inHeader);
  console.log(divider);

  for (const [cat, tokens] of Object.entries(categoryInputTokens).sort()) {
    let line = '  ' + cat.padEnd(18);
    for (const v of activeVariants) {
      line += num(avg(tokens[v])).padStart(colWidth);
    }
    console.log(line);
  }

  console.log(divider);

  let inOverall = '  ' + 'OVERALL (avg)'.padEnd(18);
  for (const v of activeVariants) {
    inOverall += num(avg(variantInputTokens[v])).padStart(colWidth);
  }
  console.log(inOverall);

  let inTotal = '  ' + 'TOTAL'.padEnd(18);
  for (const v of activeVariants) {
    const sum = variantInputTokens[v].reduce((a, b) => a + b, 0);
    inTotal += num(sum).padStart(colWidth);
  }
  console.log(inTotal);

  // --- Output tokens ---
  console.log('');
  console.log('  Avg Output Tokens');
  console.log('');

  let outHeader = '  ' + 'Category'.padEnd(18);
  for (const v of activeVariants) outHeader += VARIANT_LABELS[v].padStart(colWidth);
  console.log(outHeader);
  console.log(divider);

  for (const [cat, tokens] of Object.entries(categoryOutputTokens).sort()) {
    let line = '  ' + cat.padEnd(18);
    for (const v of activeVariants) {
      line += num(avg(tokens[v])).padStart(colWidth);
    }
    console.log(line);
  }

  console.log(divider);

  let outOverall = '  ' + 'OVERALL (avg)'.padEnd(18);
  for (const v of activeVariants) {
    outOverall += num(avg(variantOutputTokens[v])).padStart(colWidth);
  }
  console.log(outOverall);

  let outTotal = '  ' + 'TOTAL'.padEnd(18);
  for (const v of activeVariants) {
    const sum = variantOutputTokens[v].reduce((a, b) => a + b, 0);
    outTotal += num(sum).padStart(colWidth);
  }
  console.log(outTotal);

  console.log('');
  const scoredParts = activeVariants.map((v) => `${variantScores[v].length} ${VARIANT_LABELS[v].toLowerCase()}`);
  console.log(`  Scored: ${allScores.length} outputs (${scoredParts.join(', ')})`);
  console.log(`  Details: ${path.join(RESULTS_DIR, 'scores.json')}`);
  console.log('');

  // Print per-test failures
  const failures = allScores.filter((s) => !s.pass);
  if (failures.length > 0) {
    console.log('  Failed tests:');
    for (const f of failures) {
      const failedChecks = f.checks.filter((c) => !c.pass).map((c) => c.reason).join('; ');
      console.log(`    ✗ [${f.variant}] ${f.description}`);
      console.log(`      Score: ${pct(f.score)} — ${failedChecks}`);
    }
    console.log('');
  }

  console.log('╚════════════════════════════════════════════════════════════════════════════╝');
}

main();
