# @wix/interact — Rules Evaluation Pipeline

Automated evaluation of the interact LLM rules using [Promptfoo](https://promptfoo.dev).

## What this tests

Every test case runs **twice** — once with the full rules (SKILL.md + trigger-specific rule file) and once **without rules** (SKILL.md only). This lets you:

1. **Measure rule quality** — see if rules improve LLM output vs baseline
2. **Detect regressions** — compare scores before and after editing a rule
3. **Compare models** — uncomment additional providers in the config

## Quick start

### Option A: With API key (fully automated via Promptfoo)

```bash
cd evals
npm install
export ANTHROPIC_API_KEY=sk-ant-...   # or OPENAI_API_KEY
npx promptfoo@latest eval             # run all tests
npx promptfoo@latest view             # open the web UI to see results
```

### Option B: Without API key (using Cursor or any LLM)

No API key needed — use Cursor, ChatGPT, or any LLM you have access to.

```bash
cd evals
npm install

# Step 1: Generate batch prompt files (one per trigger category)
node scripts/cursor-batch.js with-rules
node scripts/cursor-batch.js without-rules
```

This creates files like:
- `results/cursor-batch-with-rules-click.md` (5 tests)
- `results/cursor-batch-with-rules-hover.md` (5 tests)
- `results/cursor-batch-without-rules-click.md` (5 tests)
- ...etc (6 categories × 2 variants = 12 files)

```bash
# Step 2: For each batch file, paste into Cursor chat and save the response
#         e.g. paste cursor-batch-with-rules-click.md into Cursor
#         Save response as: results/cursor-batch-with-rules-click-response.md
#         Repeat for all 12 files

# Step 3: Parse all responses into individual outputs
node scripts/parse-cursor-response.js with-rules
node scripts/parse-cursor-response.js without-rules

# Step 4: Score everything locally (no API key needed)
node scripts/score-outputs.js
```

The scorer prints a comparison table:

```
  Category          With Rules    Without Rules    Delta
  ─────────────────────────────────────────────────────────
  click                  92%           68%          +24% ✓
  hover                  88%           72%          +16% ✓
  viewenter              95%           60%          +35% ✓
  ...
  OVERALL                90%           67%          +23%
```

Alternatively, generate individual prompt files for one-by-one collection:

```bash
node scripts/generate-prompts.js
# Prompts are in results/prompts/ — paste each into your LLM
# Save responses in results/outputs/ with matching filenames
node scripts/score-outputs.js
```

## Structure

```
evals/
├── promptfooconfig.yaml        # Promptfoo config (for Option A with API key)
├── package.json                # Dependencies (yaml) and npm scripts
├── prompts/
│   ├── with-rules.json         # Chat template: SKILL.md + trigger rules
│   └── without-rules.json      # Chat template: SKILL.md only (baseline)
├── context/
│   └── skill.md                # General interact library reference
├── assertions/
│   ├── valid-config.js         # Structural validation (all tests)
│   ├── anti-patterns.js        # Known pitfall detection (all tests)
│   ├── click-checks.js         # Click-specific semantic checks
│   ├── hover-checks.js         # Hover-specific semantic checks
│   ├── viewenter-checks.js     # ViewEnter-specific semantic checks
│   ├── viewprogress-checks.js  # ViewProgress-specific semantic checks
│   └── pointermove-checks.js   # PointerMove-specific semantic checks
├── tests/
│   ├── click.yaml              # 5 click trigger test cases
│   ├── hover.yaml              # 5 hover trigger test cases
│   ├── viewenter.yaml          # 5 viewEnter trigger test cases
│   ├── viewprogress.yaml       # 5 viewProgress trigger test cases
│   ├── pointermove.yaml        # 5 pointerMove trigger test cases
│   └── integration.yaml        # 4 integration/setup test cases
├── scripts/
│   ├── generate-prompts.js     # Generate individual prompt files
│   ├── cursor-batch.js         # Generate a single Cursor-friendly prompt
│   ├── parse-cursor-response.js # Parse Cursor batch response into outputs
│   └── score-outputs.js        # Score collected outputs locally (no API key)
└── results/                    # Output directory (gitignored)
    ├── prompts/                # Generated prompt files
    ├── outputs/                # Collected LLM outputs
    ├── scores.json             # Detailed scoring results
    └── manifest.json           # Test case metadata
```

## How scoring works

Each test case is scored across multiple metrics:

| Metric | Source | What it checks |
|---|---|---|
| `structure` | `valid-config.js` | Has key, trigger, effects, valid effect type |
| `anti_patterns` | `anti-patterns.js` | No keyframeEffect+pointerMove 2D, no layout props, etc. |
| `semantic` | `*-checks.js` | Correct trigger, params, effect type, cross-targeting |
| `effect_choice` | inline asserts | Uses the right named effect preset |
| `completeness` | inline asserts | Includes all required properties |
| `compliance` | inline asserts | Doesn't refuse the task |

The web UI shows per-test scores and aggregate metrics, with side-by-side "with rules" vs "without rules" comparison.

## Workflow for rule changes

1. Run baseline: `npx promptfoo@latest eval`
2. Edit a rule file (e.g., `packages/interact/rules/hover.md`)
3. Run again: `npx promptfoo@latest eval`
4. Compare: `npx promptfoo@latest view` — the UI shows both runs

## Adding new test cases

Add a new entry to the relevant YAML file in `tests/`. Each test case needs:

```yaml
- description: 'Short description of what is tested'
  vars:
    rules: file://../packages/interact/rules/<trigger>.md
    prompt: >
      Natural language description of the desired interaction.
    expected_trigger: <trigger>
    expected:
      params_type: alternate       # optional: expected params.type
      params_method: toggle        # optional: expected params.method
      effect_type: namedEffect     # optional: namedEffect|keyframeEffect|transition|customEffect
      named_effect: FadeIn         # optional: specific preset name
      cross_target: true           # optional: source != target
      has_fill_both: true          # optional: needs fill:'both'
      has_reversed: true           # optional: needs reversed:true
      has_duration: true           # optional: needs a duration value
      has_easing: true             # optional: needs an easing value
  assert:
    - type: javascript
      value: file://assertions/<trigger>-checks.js
      weight: 3
      metric: semantic
    # Add any extra inline assertions
```

## Adding LLM-as-judge (optional)

For subjective quality scoring, add `llm-rubric` assertions:

```yaml
assert:
  - type: llm-rubric
    value: >
      The output should be a valid @wix/interact config that uses
      the click trigger with alternate type, has separate source and
      target keys, and includes fill:'both' and reversed:true.
    weight: 2
    metric: quality
```

This costs ~$0.01-0.05 per assertion but catches nuanced quality issues.

## Tips

- Set `temperature: 0` in the provider config for reproducible results
- Run multiple times (`npx promptfoo@latest eval --repeat 3`) to reduce noise
- Use `--filter-pattern "Click"` to run only matching tests
- Add `--no-cache` to force fresh LLM calls
