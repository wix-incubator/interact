---
name: CSS Style Generator
overview: "Modify the `generate` function in `css.ts` to dynamically create CSS rules based on the interaction config, targeting only elements from `viewEnter` triggers with `type: once` where target equals source."
todos:
  - id: imports
    content: Add necessary imports (getSelector, getSelectorCondition, ViewEnterParams type)
    status: pending
  - id: filter-logic
    content: Implement filtering logic for viewEnter/once triggers where target equals source (matching key, selector, listContainer, selectorCondition)
    status: pending
  - id: selector-builder
    content: Build dynamic CSS selectors using key, selector, listContainer, selectorCondition, useFirstChild
    status: pending
  - id: css-rules
    content: Generate CSS rules for each matching interaction/effect pair
    status: pending
  - id: test
    content: Test with various config scenarios (lists, conditions, selectors)
    status: pending
isProject: false
---

# Dynamic CSS Generation for ViewEnter Once Effects

## Current State

The current implementation in `[packages/interact/src/core/css.ts](packages/interact/src/core/css.ts)` outputs a static CSS rule that hides all elements with `data-interact-initial="true"`:

```typescript
export function generate(_config: InteractConfig, useFirstChild: boolean = false): string {
  const css: string[] = [
    `@media (prefers-reduced-motion: no-preference) {
  [data-interact-initial="true"]${useFirstChild ? ' > :first-child' : ''}:not([data-interact-enter]) {
    visibility: hidden;
    ...
  }
}`,
  ];
  return css.join('\n');
}
```

The `_config` parameter is currently unused.

## Proposed Changes

### 1. Iterate Through Interactions and Filter by Criteria

Loop through `config.interactions` and identify effects that match:

- Trigger type: `viewEnter`
- Trigger params type: `once` (or undefined, since `once` is the default)
- Target element equals source element - ALL of the following must be true:
  - Effect has no `key` property, OR effect's `key` matches interaction's `key` (key IS inherited when missing)
  - Effect's `selector` exactly equals interaction's `selector` (both missing, or both have same value) - NOT inherited
  - Effect's `listContainer` exactly equals interaction's `listContainer` (both missing, or both have same value) - NOT inherited
  - Effect's resolved `selectorCondition` exactly equals interaction's resolved `selectorCondition` (both missing, or both have same value)

### 2. Build Dynamic Selectors Using Existing Logic

For each matching interaction/effect pair, build a CSS selector using the `getSelector` utility function from `[packages/interact/src/core/Interact.ts](packages/interact/src/core/Interact.ts)`. Consider:

- `**key**`: Used to build the base selector `[data-interact-key="${key}"]`
- `**selector**`: Direct selector within the element
- `**listContainer**` and `listItemSelector`: For list-based selections
- `**useFirstChild**`: Adds `> :first-child` combinator
- `**selectorCondition**`: Apply condition predicates using `applySelectorCondition` pattern from `[packages/interact/src/utils.ts](packages/interact/src/utils.ts)`

### 3. Generate CSS Rules

For each matching selector, generate a CSS rule in the format:

```css
@media (prefers-reduced-motion: no-preference) {
  [data-interact-key="${key}"]${childSelector}:not([data-interact-enter]) {
    visibility: hidden;
    transform: none;
    translate: none;
    scale: none;
    rotate: none;
  }
}
```

### 4. Handle Conditions

Resolve `selectorCondition` from `conditions` array using `getSelectorCondition` from utils and apply it to the selector using the `&` replacement pattern.

## Implementation Details

### Key Function Signature

```typescript
export function generate(config: InteractConfig, useFirstChild: boolean = false): string;
```

### Helper Imports Needed

Import from existing utilities:

- `getSelector` from `./Interact`
- `getSelectorCondition` from `../utils`

### Matching Logic

```typescript
// For each interaction
config.interactions.forEach((interaction) => {
  // Check if trigger is viewEnter
  if (interaction.trigger !== 'viewEnter') return;

  // Check if type is 'once' (default if not specified)
  const params = interaction.params as ViewEnterParams | undefined;
  if (params?.type && params.type !== 'once') return;

  // Resolve interaction's selectorCondition from conditions
  const interactionSelectorCondition = getSelectorCondition(
    interaction.conditions,
    config.conditions || {},
  );

  // For each effect
  interaction.effects.forEach((effect) => {
    const effectData = config.effects[effect.effectId] || effect;

    // Check if target equals source - ALL criteria must EXACTLY match:

    // 1. Key: inherited when missing, so check if missing OR matches
    if (effectData.key && effectData.key !== interaction.key) return;

    // 2. Selector: NOT inherited, must be exactly equal (both undefined or same value)
    if (effectData.selector !== interaction.selector) return;

    // 3. ListContainer: NOT inherited, must be exactly equal (both undefined or same value)
    if (effectData.listContainer !== interaction.listContainer) return;

    // 4. SelectorCondition: must be exactly equal (both undefined or same value)
    const effectSelectorCondition = getSelectorCondition(
      effectData.conditions,
      config.conditions || {},
    );
    if (effectSelectorCondition !== interactionSelectorCondition) return;

    // Build selector and add CSS rule
  });
});
```

### Selector Building

Combine:

1. Base: `[data-interact-key="${interaction.key}"]`
2. Child selector from `getSelector(effectData, { asCombinator: true, useFirstChild })`
3. Selector condition if present
4. State filter: `:not([data-interact-enter])`

