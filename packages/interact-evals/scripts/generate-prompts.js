#!/usr/bin/env node

/**
 * Phase 1: Generate all eval prompts as ready-to-paste text files.
 *
 * Usage:  node scripts/generate-prompts.js
 * Output: prompts are written to results/prompts/
 *
 * For each test case, generates two files:
 *   - {id}__with-rules.txt    (trigger rules + user prompt)
 *   - {id}__no-context.txt    (user prompt only)
 *
 * You can then paste these into Cursor, ChatGPT, or any LLM and save the
 * output into results/outputs/{id}__with-rules.txt etc.
 */

const fs = require("fs");
const path = require("path");
const yaml = require("yaml");
const { resolveRules } = require("./resolve-rules");
const { generateTestId } = require("./test-id");

const EVALS_DIR = path.resolve(__dirname, "..");
const RESULTS_DIR = path.join(EVALS_DIR, "results");
const PROMPTS_OUT = path.join(RESULTS_DIR, "prompts");
const OUTPUTS_DIR = path.join(RESULTS_DIR, "outputs");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadTestFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  return yaml.parse(content);
}

function main() {
  ensureDir(PROMPTS_OUT);
  ensureDir(OUTPUTS_DIR);

  const testFiles = fs
    .readdirSync(path.join(EVALS_DIR, "tests"))
    .filter((f) => f.endsWith(".yaml"));

  const manifest = [];
  let index = 0;

  for (const testFile of testFiles) {
    const tests = loadTestFile(path.join(EVALS_DIR, "tests", testFile));
    const category = testFile.replace(".yaml", "");

    for (const test of tests) {
      index++;
      const id = generateTestId(index, category, test.description);
      const userPrompt =
        typeof test.vars.prompt === "string"
          ? test.vars.prompt.trim()
          : test.vars.prompt;

      const rulesContent = test.vars.rules
        ? resolveRules(test.vars.rules, EVALS_DIR)
        : "";

      const outputInstruction =
        category === "integration"
          ? "Generate valid @wix/interact code based on user requests. Include the COMPLETE code: imports, config, and HTML/JSX as requested. No explanatory text."
          : "Generate valid InteractConfig code based on user requests. Output ONLY the config object (or the interactions array and effects registry if applicable). Do not include imports, HTML, or explanatory text — just the config.";

      const withRulesPrompt = [
        "=== SYSTEM ===",
        `You are an expert at the @wix/interact animation library. ${outputInstruction}`,
        "",
        rulesContent,
        "",
        "=== USER ===",
        userPrompt,
      ].join("\n");

      const noContextPrompt = [
        "=== SYSTEM ===",
        `You are an expert at the @wix/interact animation library. ${outputInstruction}`,
        "",
        "=== USER ===",
        userPrompt,
      ].join("\n");

      fs.writeFileSync(
        path.join(PROMPTS_OUT, `${id}__with-rules.txt`),
        withRulesPrompt,
      );
      fs.writeFileSync(
        path.join(PROMPTS_OUT, `${id}__no-context.txt`),
        noContextPrompt,
      );

      manifest.push({
        id,
        category,
        description: test.description,
        prompt: userPrompt,
        rulesRef: test.vars.rules || null,
        expected_trigger: test.vars.expected_trigger || "",
        expected: test.vars.expected || {},
        asserts: test.assert || [],
      });
    }
  }

  fs.writeFileSync(
    path.join(RESULTS_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );

  console.log(
    `Generated ${index} test cases × 2 variants = ${index * 2} prompt files`,
  );
  console.log(`  Prompts:  ${PROMPTS_OUT}/`);
  console.log(`  Outputs:  ${OUTPUTS_DIR}/ (put LLM responses here)`);
  console.log(`  Manifest: ${path.join(RESULTS_DIR, "manifest.json")}`);
  console.log("");
  console.log("Next steps:");
  console.log("  1. Feed each prompt file to your LLM (Cursor, ChatGPT, etc.)");
  console.log(
    "  2. Save each response in results/outputs/ with the SAME filename",
  );
  console.log("  3. Run: node scripts/score-outputs.js");
}

main();
