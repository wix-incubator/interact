#!/usr/bin/env node

/**
 * Generate a single Cursor-friendly prompt file that asks the LLM to produce
 * outputs for ALL test cases in one shot. The response can then be split and
 * scored automatically.
 *
 * Usage:
 *   node scripts/cursor-batch.js [with-rules|no-context]
 *
 * Output:
 *   results/cursor-batch-{variant}-{category}.md  — paste into Cursor chat
 *
 * After getting the response, save it as:
 *   results/cursor-batch-{variant}-response.md
 *
 * Then run:
 *   node scripts/parse-cursor-response.js {variant}
 *   node scripts/score-outputs.js
 */

const fs = require("fs");
const path = require("path");
const yaml = require("yaml");
const { resolveRules } = require("./resolve-rules");
const { generateTestId } = require("./test-id");

const EVALS_DIR = path.resolve(__dirname, "..");
const RESULTS_DIR = path.join(EVALS_DIR, "results");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function main() {
  const variant = process.argv[2] || "with-rules";
  if (!["with-rules", "no-context"].includes(variant)) {
    console.error(
      "Usage: node scripts/cursor-batch.js [with-rules|no-context]",
    );
    process.exit(1);
  }

  ensureDir(RESULTS_DIR);

  const testFiles = fs
    .readdirSync(path.join(EVALS_DIR, "tests"))
    .filter((f) => f.endsWith(".yaml"))
    .sort();

  // Group tests by category, one file per category (keeps each prompt manageable)
  const categorized = {};
  let index = 0;

  for (const testFile of testFiles) {
    const tests = yaml.parse(
      fs.readFileSync(path.join(EVALS_DIR, "tests", testFile), "utf8"),
    );
    const category = testFile.replace(".yaml", "");

    if (!categorized[category]) categorized[category] = [];

    for (const test of tests) {
      index++;
      const id = generateTestId(index, category, test.description);
      const userPrompt =
        typeof test.vars.prompt === "string"
          ? test.vars.prompt.trim()
          : test.vars.prompt;

      let rulesContent = "";
      if (variant === "with-rules" && test.vars.rules) {
        rulesContent = resolveRules(test.vars.rules, EVALS_DIR);
      }

      categorized[category].push({ id, userPrompt, rulesContent });
    }
  }

  const totalTests = index;
  const files = [];

  for (const [category, entries] of Object.entries(categorized)) {
    const parts = [];

    parts.push("You are an expert at the @wix/interact animation library.");
    parts.push("");

    if (variant === "with-rules" && entries[0].rulesContent) {
      parts.push("<trigger-rules>");
      parts.push(entries[0].rulesContent);
      parts.push("</trigger-rules>");
      parts.push("");
    }

    parts.push(
      `I need you to generate @wix/interact InteractConfig code for ${entries.length} different requests.`,
    );
    parts.push("");
    if (category === "integration") {
      parts.push(
        "For each request, output the COMPLETE code including imports, config, and HTML/JSX as requested. No explanatory text.",
      );
    } else {
      parts.push(
        "For each request, output ONLY the config object. No imports, no HTML, no explanation.",
      );
    }
    parts.push("");
    parts.push("Use this EXACT format for each response:");
    parts.push("");
    parts.push("```");
    parts.push("=== ID: {test-id} ===");
    parts.push("{config code here}");
    parts.push("```");
    parts.push("");

    for (const entry of entries) {
      parts.push(`---`);
      parts.push("");
      parts.push(`### Test: ${entry.id}`);
      parts.push("");
      parts.push(`**Request:** ${entry.userPrompt}`);
      parts.push("");
    }

    const outputPath = path.join(
      RESULTS_DIR,
      `cursor-batch-${variant}-${category}.md`,
    );
    fs.writeFileSync(outputPath, parts.join("\n"));
    files.push({ path: outputPath, category, count: entries.length });
  }

  console.log(
    `Generated ${files.length} batch files for ${totalTests} test cases (${variant}):`,
  );
  for (const f of files) {
    console.log(`  ${path.basename(f.path)} (${f.count} tests)`);
  }
  console.log("");
  console.log("Next steps:");
  console.log(
    "  1. Open each batch file and paste its content into Cursor chat",
  );
  console.log(
    `  2. Save each response as: results/cursor-batch-${variant}-{category}-response.md`,
  );
  console.log(`  3. Run: node scripts/parse-cursor-response.js ${variant}`);
  console.log("  4. Run: node scripts/score-outputs.js");
}

main();
