---
name: run-interact-evals
description: Run the @wix/interact rules evaluation pipeline using subagents, then score and visualize results. Use when the user asks to run evals, test rules, benchmark interact, run the eval pipeline, compare with-rules vs no-context, or check rule quality.
---

# Run Interact Evals

Evaluates @wix/interact rule files by generating LLM outputs via subagents and scoring them locally. Compares **with-rules** (trigger-specific rules) vs **no-context** (bare prompt).

The evals package lives at `packages/interact-evals/` in the monorepo.

## Prerequisites

Ensure dependencies are installed from the repo root:

```bash
nvm use
yarn install
```

## Workflow

### Step 0: Clean previous results

Always start fresh to avoid stale data leaking into subagent context.

```bash
find packages/interact-evals/results -type f ! -name 'dashboard.html' ! -name '.gitkeep' -delete
```

This removes all batch files, response files, parsed outputs, scores, manifest, and prompts — keeping only the dashboard template and .gitkeep.

### Step 1: Generate batch prompts

```bash
cd packages/interact-evals
node scripts/cursor-batch.js with-rules
node scripts/cursor-batch.js no-context
```

This creates `results/cursor-batch-{variant}-{category}.md` files (6 categories x 2 variants = 12 files).

### Step 2: Dispatch subagents

Launch subagents to process each batch file. **Max 4 concurrent subagents.**

Categories: `click`, `hover`, `viewenter`, `viewprogress`, `pointermove`, `integration`
Variants: `with-rules`, `no-context`

For each combination, launch a Task subagent with this prompt template:

```
CRITICAL ISOLATION RULES — read these first:
- Do NOT read, search, or explore ANY other files in the workspace.
- Do NOT use Glob, Grep, SemanticSearch, or Read on any file except the ONE batch file specified below.
- Do NOT look at tests/, assertions/, .rules-cache/, scripts/, or any other directory.
- Generate code ONLY from the instructions and context provided in the batch file.
- Your ONLY tools should be: Read (for the one batch file), and Write (for the response file).

Now read {workspace}/packages/interact-evals/results/cursor-batch-{variant}-{category}.md and follow ALL
its instructions exactly. Generate the requested code for every test case. Use the
EXACT "=== ID: {test-id} ===" format. Write the complete response to
{workspace}/packages/interact-evals/results/cursor-batch-{variant}-{category}-response.md using the
Write tool. You MUST write the file.
```

Use `subagent_type: "generalPurpose"`.

For **integration** tests, add to the prompt: "Generate the COMPLETE code including imports, config, and HTML/JSX."

#### Dispatch order (respecting max 4 concurrent)

Batch 1 (4 agents): with-rules click, hover, viewenter, viewprogress
Batch 2 (4 agents): with-rules pointermove, with-rules integration, no-context click, no-context hover
Batch 3 (4 agents): no-context viewenter, viewprogress, pointermove, integration

### Step 3: Verify all response files exist

After each batch, verify response files were written. If any are missing, re-dispatch that subagent with an emphasized "You MUST use the Write tool" instruction.

Check with:

```bash
ls packages/interact-evals/results/cursor-batch-*-response.md | wc -l
# Expected: 12
```

### Step 4: Parse and score

```bash
cd packages/interact-evals
node scripts/generate-prompts.js
node scripts/parse-cursor-response.js with-rules
node scripts/parse-cursor-response.js no-context
node scripts/score-outputs.js
```

Note: `generate-prompts.js` must run before `score-outputs.js` to create `manifest.json`.

Expected output: 29 outputs per variant (58 total).

If any variant parses fewer than 29, check which response files are missing and re-run Step 3 for those.

### Step 5: Rebuild dashboard and display results

After scoring, rebuild the HTML dashboard:

```bash
cd packages/interact-evals
node -e "
const fs = require('fs');
const scores = fs.readFileSync('results/scores.json', 'utf8');
let html = fs.readFileSync('results/dashboard.html', 'utf8');
html = html.replace(/\/\*SCORES_DATA\*\/\[[\s\S]*?\];/, '/*SCORES_DATA*/' + scores.trim() + ';');
fs.writeFileSync('results/dashboard.html', html);
"
```

The scorer prints three tables:

1. **Scores** — pass rate per category per variant with delta
2. **Input tokens** — context window cost per category
3. **Output tokens** — response size per category

Report the results to the user. Highlight:

- Categories where with-rules outperforms no-context
- Categories where no-context matches (rules add cost but not quality)
- Any failed tests with their failure reasons
- Token cost tradeoffs (input tokens for with-rules vs no-context)

## Adding a new variant

To add a variant, update these files:

- `packages/interact-evals/scripts/cursor-batch.js` — add to the variant validation list
- `packages/interact-evals/scripts/score-outputs.js` — add to `VARIANTS` and `VARIANT_LABELS`
- `packages/interact-evals/run-eval.sh` — add to the `VARIANTS` array

## Adding new test cases

Add YAML entries to `packages/interact-evals/tests/{category}.yaml`. Each test needs:

```yaml
- description: 'Short description'
  vars:
    rules: https://raw.githubusercontent.com/wix/interact/master/packages/interact/rules/{trigger}.md
    prompt: >
      The user request to generate code for.
    expected_trigger: click|hover|viewEnter|viewProgress|pointerMove
    expected:
      params_type: alternate|repeat|state
      effect_type: namedEffect|keyframeEffect|transition|customEffect
  assert:
    - type: contains-any
      value: ['expected', 'strings']
      weight: 2
      metric: metric_name
```

Rules are fetched from GitHub and cached locally in `packages/interact-evals/.rules-cache/`. To force a
re-fetch (e.g. after rule updates on master), delete that directory.
