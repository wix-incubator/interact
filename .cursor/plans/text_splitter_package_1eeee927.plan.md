---
name: Text Splitter Package
overview: Add a new `@wix/splittext` package to the interact monorepo that provides a lightweight, accessible text splitting utility for creating staggered animations on characters, words, and lines.
todos:
  - id: pkg-setup
    content: Create package directory structure, package.json, tsconfig, vite.config
    status: pending
  - id: types
    content: Define TypeScript interfaces for options and result types
    status: pending
    dependencies:
      - pkg-setup
  - id: line-detection
    content: Implement Range API-based line detection (lineDetection.ts)
    status: pending
    dependencies:
      - types
  - id: core-split
    content: Implement core splitText function with chars/words/lines splitting
    status: pending
    dependencies:
      - types
      - line-detection
      - wrapper-spans
  - id: accessibility
    content: Add ARIA attribute handling for screen reader support
    status: pending
    dependencies:
      - core-split
  - id: wrapper-spans
    content: Implement customizable span wrapper creation with class/style/attrs options
    status: pending
    dependencies:
      - types
  - id: masking
    content: Implement mask wrapper functionality for reveal animations
    status: pending
    dependencies:
      - core-split
      - wrapper-spans
  - id: autosplit
    content: Add responsive autoSplit with resize/font-load observers
    status: pending
    dependencies:
      - core-split
  - id: react-hook
    content: Create useSplitText React hook with proper cleanup
    status: pending
    dependencies:
      - core-split
  - id: tests
    content: Write comprehensive test suite for all features
    status: pending
    dependencies:
      - core-split
      - accessibility
      - masking
      - autosplit
      - react-hook
  - id: docs
    content: Create documentation following interact package structure
    status: pending
    dependencies:
      - tests
isProject: false
---

# Text Splitting Package Plan

## Overview

Create a new `@wix/splittext` package within the `packages/` directory that exports a functional API for splitting text into animatable parts (characters, words, lines, sentences). The package will be framework-agnostic with optional React bindings.

## Key Design Decisions

The API will have:

- **Functional approach**: Export a `splitText()` function rather than a class-based API
- **Return arrays**: Return `{ chars, words, lines, sentences }` arrays of `HTMLSpanElement` for direct use with animation libraries
- **Customizable `<span>` wrappers**: All split items wrapped in `<span>` tags with configurable classes, styles, and attributes for styling and animation
- **Lazy evaluation with caching**: Split types are computed on-demand when accessed, not eagerly on invocation
- **Eager split when `type` provided**: If `type` option is specified, only those types are split immediately
- **Lines are opt-in**: Line detection is expensive (layout queries); lines are only computed when explicitly requested via `type: 'lines'` or `type: [..., 'lines']`. Accessing `.lines` without having requested it always returns an empty array (`[]`).
- **Accessibility by default**: Split content wrapped in `aria-hidden` div; original text preserved via visually-hidden span (see Accessibility and SEO sections)
- **Revertible**: Include a `revert()` method to restore original content
- **Responsive support**: Optional `autoSplit` mode that re-splits on resize/font-load
- `Intl.Segmenter` **API** for locale-sensitive text segmentation to split on meaningful items (graphemes, words or sentences) in a string
- **Range API for line detection**: Use `Range.getClientRects()` to detect line breaks from text nodes _before_ DOM manipulation, avoiding unnecessary wrapper creation during measurement

## Package Structure

```javascript
packages/splittext/
├── src/
│   ├── index.ts              # Main entry point
│   ├── splitText.ts          # Core splitting logic
│   ├── lineDetection.ts      # Range API-based line detection
│   ├── wrappers.ts           # Span wrapper creation & customization
│   ├── types.ts              # TypeScript interfaces
│   ├── utils.ts              # Helper functions
│   ├── accessibility.ts      # ARIA handling
│   └── react/
│       ├── index.ts          # React entry
│       └── useSplitText.ts   # React hook
├── test/
│   ├── splitText.e2e.ts      # E2E tests
│   ├── splitText.spec.ts     # Unit tests
│   └── react.spec.tsx        # React hook tests
├── docs/
│   ├── README.md             # Overview
│   ├── api/
│   │   ├── splitText.md      # Function API
│   │   └── types.md          # Type definitions (incl. wrapper config types)
│   ├── guides/
│   │   ├── getting-started.md
│   │   ├── accessibility.md
│   │   └── styling-wrappers.md  # Wrapper customization guide
│   └── examples/
│       ├── animations.md        # Animation library examples
│       └── css-animations.md    # CSS-only animation examples
├── README.md
├── package.json
├── tsconfig.json
├── tsconfig.build.json
├── vite.config.ts
└── vitest.config.ts
```

## API Design

### Core Function

```typescript
function splitText(target: string | HTMLElement, options?: SplitTextOptions): SplitTextResult;
```

### Types (`[packages/splittext/src/types.ts](packages/splittext/src/types.ts)`)

```typescript
interface SplitTextOptions {
  // What to split
  type?: 'chars' | 'words' | 'lines' | 'sentences' | ('chars' | 'words' | 'lines' | 'sentences')[];

  // Wrapper customization for styling/animation
  wrapperClass?: string | WrapperClassConfig;  // CSS class(es) for wrapper spans
  wrapperStyle?: Partial<CSSStyleDeclaration> | WrapperStyleConfig;  // Inline styles
  wrapperAttrs?: Record<string, string> | WrapperAttrsConfig;  // Custom attributes (data-*, etc.)

  // Accessibility
  aria?: 'auto' | 'none';  // default: 'auto'

  // SEO and a11y
  preserveText?: boolean;  // default: true - visually-hidden duplicate for SEO and screen readers

  // Base CSS (inline-block, white-space, etc.)
  injectStyles?: boolean;  // default: true - auto-inject minimal base stylesheet (deduplicated via data-splittext)

  // DOM structure
  nested?: 'flatten' | 'preserve' | number;  // default: 'flatten'

  // BiDi and shaping (optional external algorithms)
  bidiResolver?: (text: string) => Array<{ text: string; direction: 'ltr' | 'rtl' }>;
  shaper?: (text: string, font: string) => string[];

  // Responsive re-splitting
  autoSplit?: boolean;
  onSplit?: (result: SplitTextResult) => Animation | void;

  // Advanced
  splitBy?: string;        // default: ' ' (space for words)
  ignore?: string[] | ((node: Node) => boolean);  // selectors to skip or predicate (e.g., ['sup', 'sub'])
  preserveWhitespace?: boolean;
}

// Per-type wrapper configuration
interface WrapperClassConfig {
  chars?: string;
  words?: string;
  lines?: string;
  sentences?: string;
}

interface WrapperStyleConfig {
  chars?: Partial<CSSStyleDeclaration>;
  words?: Partial<CSSStyleDeclaration>;
  lines?: Partial<CSSStyleDeclaration>;
  sentences?: Partial<CSSStyleDeclaration>;
}

interface WrapperAttrsConfig {
  chars?: Record<string, string>;
  words?: Record<string, string>;
  lines?: Record<string, string>;
  sentences?: Record<string, string>;
}

interface SplitTextResult {
  // Lazy getters - split on first access, return cached on subsequent access (except lines, which are opt-in)
  // Each element is a <span> wrapper that can be styled/animated
  get chars: HTMLSpanElement[];      // Splits into characters on first access
  get words: HTMLSpanElement[];      // Splits into words on first access
  get lines: HTMLSpanElement[];      // Only computed when type included 'lines'; otherwise returns []
  get sentences: HTMLSpanElement[];  // Splits into sentences on first access

  // Methods
  revert(): void;
  split(options?: SplitTextOptions): SplitTextResult;

  // Original content
  readonly originalHTML: string;
  readonly element: HTMLElement;
  readonly isSplit: boolean;
}
```

### React Hook

```typescript
function useSplitText(
  ref: RefObject<HTMLElement>,
  options?: SplitTextOptions,
): SplitTextResult | null;
```

## Implementation Plan

### Phase 1: Core Package Infrastructure

1. Create package directory structure
2. Set up `[package.json](packages/splittext/package.json)` following existing conventions:

- Name: `@wix/splittext`
- Dual CJS/ESM exports
- React as optional peer dependency

1. Configure TypeScript, Vite, and Vitest matching [interact package](packages/interact/package.json)

### Phase 2: Core Splitting Logic

Key files to implement:

1. `src/splitText.ts` - Main function:

- Parse target (CSS selector or element)
- **Use Range API for line detection** (see Key Implementation Details)
- Extract text content preserving structure
- **Use** `Intl.Segmenter` **API for locale-sensitive text splitting on meaningful items** (chars, words, sentences)
- Create wrapper spans with appropriate classes after detection

1. **`src/lineDetection.ts`** - Range-based line detection:

- `detectLines(element)` - Main detection function using Range API
- `detectLinesFromTextNode(textNode)` - Per-node detection with `getClientRects()`
- Handle Safari whitespace normalization
- Support for nested elements via TreeWalker

1. **`src/accessibility.ts`**:

- When `aria: 'auto'` and `preserveText` is true: insert a visually-hidden `<span>` with the original text as a direct child of the container (exposed to AT and crawlers). Wrap all split content in an inner `<div aria-hidden="true">` so assistive tech ignores the visual split spans while the original text remains accessible.
- When `aria: 'auto'` and `preserveText` is false: set `aria-label` with the original text on the container and wrap split content in an inner `<div aria-hidden="true">`.
- When `aria: 'none'`: no ARIA changes, no wrapper div.

1. **`src/utils.ts`**:

- Text segmentation (handle emoji, unicode)
- DOM manipulation helpers
- Resize/font-load observers for autoSplit

### Phase 3: React Integration

1. `src/react/useSplitText.ts`:

- Hook that wraps core function
- Handle cleanup on unmount
- Support autoSplit with effect dependencies

### Phase 4: Testing

Test coverage for:

- Basic splitting (chars, words, lines, sentences)
- Various text content (emoji, unicode, mixed, RTL)
- Nested elements handling
- Accessibility attributes
- Revert functionality
- AutoSplit behavior
- React hook lifecycle
- **Lazy evaluation**: Verify no DOM changes until getter accessed
- **Caching**: Verify same array reference returned on repeated access
- **Eager split with `type`**: Verify immediate DOM changes when type provided
- **Lines opt-in**: Verify `.lines` returns `[]` when `type` did not include `'lines'`; verify line detection runs only when `type: 'lines'` or `type: [..., 'lines']` was passed
- **Cache invalidation**: Verify cache cleared on `revert()` and `autoSplit` resize
- Use Playwright for E2E testing all APIs that depend on DOM APIs

**Wrapper customization tests:**

- **Default wrapper classes**: Verify `split-c`, `split-w`, etc. are applied
- **Custom wrapperClass (string)**: Verify single class applied to all wrappers
- **Custom wrapperClass (config)**: Verify per-type classes applied correctly
- **Multiple classes**: Verify space-separated classes all applied
- **wrapperStyle (global)**: Verify inline styles applied to all wrapper spans
- **wrapperStyle (per-type)**: Verify different styles for chars vs words vs lines
- **wrapperAttrs**: Verify custom data attributes and other attributes applied
- **data-index attribute**: Verify each wrapper has correct index for animation sequencing
- **Combined options**: Verify class + style + attrs work together
- **Inline-block for transforms**: Verify transforms work when display: inline-block set
- **Revert cleans wrappers**: Verify all span wrappers removed on revert()
- **Re-split preserves options**: Verify wrapper options reapplied on autoSplit resize

**E2E wrapper animation tests (Playwright):**

```typescript
test('wrapper spans are animatable with CSS transitions', async ({ page }) => {
  await page.setContent(`<h1 class="title">Hello</h1>`);
  await page.addStyleTag({
    content: `
      .char-animate {
        display: inline-block;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .char-animate.visible { opacity: 1; }
    `,
  });

  await page.evaluate(() => {
    const { chars } = splitText('.title', {
      type: 'chars',
      wrapperClass: 'char-animate',
      wrapperStyle: { display: 'inline-block' },
    });

    // Trigger animation
    chars.forEach((char) => char.classList.add('visible'));
  });

  // Verify opacity transition occurred
  const opacity = await page
    .locator('.char-animate')
    .first()
    .evaluate((el) => {
      return getComputedStyle(el).opacity;
    });
  expect(opacity).toBe('1');
});

test('wrapper spans support transform animations', async ({ page }) => {
  await page.setContent(`<h1 class="title">Test</h1>`);

  await page.evaluate(() => {
    const { chars } = splitText('.title', {
      type: 'chars',
      wrapperStyle: {
        display: 'inline-block',
        transform: 'translateY(20px)',
      },
    });
  });

  const transform = await page
    .locator('.splittext-char')
    .first()
    .evaluate((el) => {
      return getComputedStyle(el).transform;
    });
  expect(transform).toContain('matrix'); // translateY creates a matrix
});

test('data-index attributes enable staggered animations', async ({ page }) => {
  await page.setContent(`<p>Hello World</p>`);

  const indices = await page.evaluate(() => {
    const { words } = splitText('p', { type: 'words' });
    return words.map((w) => w.dataset.index);
  });

  expect(indices).toEqual(['0', '1']);
});
```

**Safari whitespace normalization test (Playwright, run on WebKit):**

```typescript
test('Safari: getClientRects line detection requires whitespace normalization', async ({
  page,
}) => {
  await page.setContent(`
    <p class="sample" style="width: 300px;">
      Hello    world    with     extra    spaces
      and
      newlines    that    collapse
    </p>
  `);

  const { withoutNorm, withNorm } = await page.evaluate(() => {
    function detectLineCount(textNode) {
      const text = textNode.textContent;
      const range = document.createRange();
      let maxLineIndex = 0;
      for (let i = 0; i < text.length; i++) {
        range.setStart(textNode, 0);
        range.setEnd(textNode, i + 1);
        maxLineIndex = Math.max(maxLineIndex, range.getClientRects().length - 1);
      }
      return maxLineIndex + 1;
    }

    const el = document.querySelector('.sample');
    const originalContent = el.firstChild!.textContent!;

    // Without normalization (raw markup whitespace)
    const withoutNorm = detectLineCount(el.firstChild as Text);

    // With normalization (collapsed whitespace)
    el.firstChild!.textContent = originalContent.trim().replace(/\s+/g, ' ');
    const withNorm = detectLineCount(el.firstChild as Text);

    el.firstChild!.textContent = originalContent;
    return { withoutNorm, withNorm };
  });

  // After normalization both browsers should detect the same (correct) line count.
  // Without normalization, Safari detects one "line" per whitespace-separated word.
  // This test documents the quirk; the implementation must always normalize.
  expect(withNorm).toBe(2);
});
```

### Phase 5: Documentation

Following the [interact docs structure](packages/interact/docs/README.md):

- API reference with TypeScript signatures
- Getting started guide
- Accessibility guide
- Animation examples with `@wix/motion`

**Additional documentation for wrapper customization:**

1. **`docs/api/types.md`** - Update with wrapper option types:

- `WrapperClassConfig` interface documentation
- `WrapperStyleConfig` interface documentation
- `WrapperAttrsConfig` interface documentation
- Explanation of global vs per-type configuration

2. **`docs/guides/styling-wrappers.md`** - New guide covering:

- Default CSS classes (`split-c`, `split-w`, etc.)
- Customizing wrapper classes
- Applying inline styles for animation setup
- Using data attributes for animation hooks
- Best practices for `display: inline-block` with transforms
- CSS custom properties for staggered animations

3. **`docs/examples/animations.md`** - Expanded with wrapper examples:

- **Fade-in character animation** using wrapperClass + CSS
- **Slide-up word reveal** using wrapperStyle initial state
- **Staggered line animation** using data-index attribute
- **@wix/motion integration** with custom wrapper classes
- **CSS-only animations** using @keyframes and animation-delay
- **Intersection Observer** trigger with wrapper data attributes

4. **`docs/examples/css-animations.md`** - New CSS-focused examples:

```css
/* Example: Typewriter effect */
.split-c {
  display: inline-block;
  opacity: 0;
  animation: typewriter 0.1s ease forwards;
}

.split-c:nth-child(1) {
  animation-delay: 0.1s;
}
.split-c:nth-child(2) {
  animation-delay: 0.2s;
}
/* ... or use CSS custom property --index */

@keyframes typewriter {
  to {
    opacity: 1;
  }
}
```

5. **README.md** - Quick start section update:

```typescript
import { splitText } from '@wix/splittext';

// Split with custom styling for animations
const { chars } = splitText('.headline', {
  type: 'chars',
  wrapperClass: 'animate-char',
  wrapperStyle: {
    display: 'inline-block',
    opacity: '0',
    transform: 'translateY(10px)',
  },
});

// Animate with any library or CSS
animate(chars, {
  opacity: 1,
  transform: 'translateY(0)',
  stagger: 0.03,
});
```

## Integration Example

```typescript
import { splitText } from '@wix/splittext';

// Example 1: Lazy evaluation - no splitting happens yet
const result = splitText('.headline');

// Splitting happens on first access, result is cached
const chars = result.chars; // Splits into chars NOW, caches result
const chars2 = result.chars; // Returns cached result (no re-split)

// Lines are only computed when type included 'lines' (opt-in; expensive)
const lines = result.lines; // Returns [] unless type: 'lines' was passed

// Example 2: Eager split with type option
const eagerResult = splitText('.headline', { type: 'words' });
// Words are split immediately on invocation

// Other types still use lazy evaluation; .lines returns [] unless type included 'lines'
const lines2 = eagerResult.lines; // [] here since only 'words' was in type

// Example 3: Multiple types eager
const multiResult = splitText('.headline', { type: ['chars', 'words'] });
// Both chars and words split immediately

// Example 4: With animation library
const { chars } = splitText('.title', { type: 'chars' });
animate(chars, { opacity: [0, 1], stagger: 0.05 });

// Example 5: Custom wrapper classes for styling
const { words } = splitText('.title', {
  type: 'words',
  wrapperClass: 'split-word animate-fade-in',
});
// Each word wrapped in: <span class="split-word animate-fade-in">word</span>

// Example 6: Per-type wrapper classes
const result2 = splitText('.paragraph', {
  type: ['chars', 'words', 'lines'],
  wrapperClass: {
    chars: 'char-wrapper',
    words: 'word-wrapper',
    lines: 'line-wrapper',
  },
});

// Example 7: Custom inline styles for animation setup
const { chars: styledChars } = splitText('.hero-text', {
  type: 'chars',
  wrapperStyle: {
    display: 'inline-block', // Required for transforms
    opacity: '0', // Initial state for fade-in
    transform: 'translateY(20px)', // Initial state for slide-up
  },
});
// Now animate with CSS transitions or JS animation library

// Example 8: Custom data attributes for animation sequencing
const { words: indexedWords } = splitText('.stagger-text', {
  type: 'words',
  wrapperAttrs: {
    'data-animate': 'fade-up',
    'data-stagger': 'true',
  },
});
// Each wrapper has data attributes for CSS or JS animation hooks

// Example 9: Combined wrapper configuration
const { lines: maskedLines } = splitText('.reveal-text', {
  type: 'lines',
  wrapperClass: 'line-mask overflow-hidden',
  wrapperStyle: {
    display: 'block',
    position: 'relative',
  },
  wrapperAttrs: {
    'data-reveal': 'slide-up',
  },
});
```

## Key Implementation Details

### Span Wrapper Creation & Customization

All split items are wrapped in `<span>` elements to enable styling and animation. The wrapper spans are fully customizable through options.

**Default wrapper structure:**

```html
<!-- Characters (space-only wrappers get .split-space for width preservation) -->
<span class="split-c">H</span>
<span class="split-c">e</span>
<span class="split-c">l</span>
<span class="split-c">l</span>
<span class="split-c">o</span>

<!-- Words -->
<span class="split-w">Hello</span>
<span class="split-w">World</span>

<!-- Lines -->
<span class="split-l">Hello World, this is</span>
<span class="split-l">the second line</span>

<!-- Sentences -->
<span class="split-s">Hello World.</span>
<span class="split-s">This is another sentence.</span>
```

**Wrapper creation implementation:**

```typescript
type SplitType = 'chars' | 'words' | 'lines' | 'sentences';

function createWrapper(
  content: string | Node,
  type: SplitType,
  index: number,
  options: SplitTextOptions,
): HTMLSpanElement {
  const span = document.createElement('span');

  // Apply default class
  span.classList.add(`split-${type[0]}`); // 'chars' -> 'split-c'

  // Mark space-only wrappers so they can be styled for width (e.g. white-space: pre)
  if (type === 'chars' && typeof content === 'string' && /^\s+$/.test(content)) {
    span.classList.add('split-space');
  }

  // Apply custom classes
  const customClass = resolveWrapperOption(options.wrapperClass, type);
  if (customClass) {
    span.classList.add(...customClass.split(' ').filter(Boolean));
  }

  // Apply custom styles
  const customStyle = resolveWrapperOption(options.wrapperStyle, type);
  if (customStyle) {
    Object.assign(span.style, customStyle);
  }

  // Apply custom attributes
  const customAttrs = resolveWrapperOption(options.wrapperAttrs, type);
  if (customAttrs) {
    for (const [key, value] of Object.entries(customAttrs)) {
      span.setAttribute(key, value);
    }
  }

  // Add index as data attribute for animation sequencing
  span.dataset.index = String(index);

  // Set content
  if (typeof content === 'string') {
    span.textContent = content;
  } else {
    span.appendChild(content);
  }

  return span;
}

// Helper to resolve per-type or global config
function resolveWrapperOption<T>(
  option: T | Record<SplitType, T> | undefined,
  type: SplitType,
): T | undefined {
  if (!option) return undefined;
  if (typeof option === 'object' && type in option) {
    return (option as Record<SplitType, T>)[type];
  }
  return option as T;
}
```

**Animation-ready inline-block:**

For transforms to work correctly on spans, `display: inline-block` is often required. Users can set this via `wrapperStyle`:

```typescript
const { chars } = splitText('.title', {
  type: 'chars',
  wrapperStyle: {
    display: 'inline-block', // Enables transform animations
  },
});
```

**CSS class-based styling example:**

```css
/* Base styles */
.split-c,
.split-w {
  display: inline-block;
}

.split-l {
  display: block;
}

/* Animation classes */
.fade-in {
  opacity: 0;
  animation: fadeIn 0.5s ease forwards;
  animation-delay: calc(var(--index) * 0.05s);
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}
```

```typescript
// Set CSS variable for stagger delay
const { chars } = splitText('.title', {
  type: 'chars',
  wrapperClass: 'fade-in',
});

chars.forEach((char, i) => {
  char.style.setProperty('--index', String(i));
});
```

### Base CSS Strategy

When `injectStyles` is true (default), the package injects a minimal base stylesheet once per document via a `<style data-splittext>` tag (deduplicated). This ensures transforms and spacing work without requiring users to add CSS manually.

**Injected base CSS:**

- `.split-c`, `.split-w`: `display: inline-block; white-space: pre;` — enables transforms and preserves space width (a space alone in an inline-block has no width unless `white-space: pre` or an explicit width is set).
- `.split-space`: same as above; space-only character wrappers get this class so they retain width.
- `.split-l`: `display: block;`
- `.split-s`: same inline-block treatment as chars/words if needed for animation.

**Direction detection:** Before splitting, read `getComputedStyle(element).direction` and store it on the result object (e.g. `result.direction`) so consumers can adapt styling or BiDi handling.

**Documentation note:** Connected scripts (Arabic, Devanagari, etc.) lose shaping when split per-character — each letter loses its positional form (initial/medial/final/isolated). This is a fundamental limitation. Recommend per-word splitting (or use the optional `shaper` injection) for these scripts.

### Accessibility

DOM structure when `aria: 'auto'` and `preserveText: true` (defaults):

```html
<container>
  <span class="sr-only">Original text (visually hidden, exposed to AT & crawlers)</span>
  <div aria-hidden="true">
    <span class="split-c">H</span>
    <span class="split-c">e</span>
    <!-- ...split wrapper spans... -->
  </div>
</container>
```

- **`aria: 'auto'` (default):** Wrap all split content in an inner `<div aria-hidden="true">` so assistive tech ignores the visual split spans. The container itself remains accessible. When `preserveText` is true, the visually-hidden `<span>` with the original text sits as a sibling alongside the inner div, exposed to screen readers and crawlers. When `preserveText` is false, set `aria-label` with the original text on the container instead (the inner `<div aria-hidden="true">` still wraps the split spans).
- **`aria: 'none'`:** No ARIA changes, no inner wrapper div.

### SEO Considerations

When `preserveText` is true (default), create a visually-hidden duplicate of the original text for both SEO and accessibility:

- Clone the original text content into a `<span>` with the visually-hidden pattern: `position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0);` (or equivalent sr-only pattern).
- Insert this span as a direct child of the container, alongside the `<div aria-hidden="true">` that wraps the split content.
- The container remains accessible (no `aria-hidden` on it), so the visually-hidden span is exposed to assistive tech and crawlers.
- When `preserveText` is false, do not create the hidden block; use `aria-label` with the original text on the container instead (ARIA is not used by crawlers, so SEO is weaker in this mode).

### BiDi and Shaping

Optional injection points for correct RTL and connected-script behavior:

- **`bidiResolver`:** When provided, run it on the text before splitting. It returns an array of runs `{ text, direction: 'ltr' | 'rtl' }`. Wrap each run in a `<span dir="ltr|rtl">` (and add `.split-rtl` / `.split-ltr` classes), then apply character/word splitting within each run. Enables correct ordering for mixed LTR/RTL (e.g. via `bidi-js`).
- **`shaper`:** When provided, use its output instead of `Intl.Segmenter` for character segmentation (e.g. HarfBuzz/OpenType.js) so Arabic and other connected scripts keep positional forms.
- When neither is provided: use `getComputedStyle(element).direction` for the overall direction. If RTL text is detected and split type includes `'chars'` and `bidiResolver` is not provided, log a console warning recommending `bidiResolver` for correct display.
- Document the injection API with examples (e.g. using `bidi-js`) in the guides.

### Lazy Evaluation & Caching Strategy

The `SplitTextResult` object uses lazy getters with internal caching to avoid unnecessary DOM operations:

```typescript
class SplitTextResultImpl implements SplitTextResult {
  private _element: HTMLElement;
  private _originalHTML: string;
  private _linesRequested: boolean; // true only when type included 'lines'

  // Internal cache for split results
  private _cache: {
    chars?: HTMLSpanElement[];
    words?: HTMLSpanElement[];
    lines?: HTMLSpanElement[];
    sentences?: HTMLSpanElement[];
  } = {};

  constructor(element: HTMLElement, options?: SplitTextOptions) {
    this._element = element;
    this._originalHTML = element.innerHTML;

    // Eager split if type is provided; track whether 'lines' was requested (lines are opt-in and expensive)
    this._linesRequested = false;
    if (options?.type) {
      const types = Array.isArray(options.type) ? options.type : [options.type];
      this._linesRequested = types.includes('lines');
      for (const type of types) {
        this._performSplit(type);
      }
    }
  }

  // Lazy getter - split on first access, return cached thereafter
  get chars(): HTMLSpanElement[] {
    if (!this._cache.chars) {
      this._cache.chars = this._performSplit('chars');
    }
    return this._cache.chars;
  }

  get words(): HTMLSpanElement[] {
    if (!this._cache.words) {
      this._cache.words = this._performSplit('words');
    }
    return this._cache.words;
  }

  get lines(): HTMLSpanElement[] {
    if (!this._linesRequested) return [];
    if (!this._cache.lines) {
      this._cache.lines = this._performSplit('lines');
    }
    return this._cache.lines;
  }

  get sentences(): HTMLSpanElement[] {
    if (!this._cache.sentences) {
      this._cache.sentences = this._performSplit('sentences');
    }
    return this._cache.sentences;
  }

  private _performSplit(type: 'chars' | 'words' | 'lines' | 'sentences'): HTMLSpanElement[] {
    // Actual splitting logic - creates wrapper spans in DOM
    // Returns array of created HTMLSpanElements
  }

  revert(): void {
    this._element.innerHTML = this._originalHTML;
    this._cache = {}; // Clear cache on revert
  }
}
```

**Cache invalidation:**

- `revert()` clears the cache (and resets `_linesRequested` if applicable)
- `autoSplit` on resize clears and re-populates cache for accessed types; only re-run line detection if lines were previously requested
- Manual `split()` call can force re-split with new options

### Line Detection Algorithm

Line detection is **opt-in**: it runs only when `type` includes `'lines'`. It is inherently expensive because it requires layout-triggering DOM queries (`getClientRects()`). For long text, prefer word-level splitting or rely on `autoSplit` rather than frequent re-detection.

#### Preferred approach: Binary search for line breakpoints

Avoid calling `getClientRects()` inside a per-character loop. Instead:

1. Call `getClientRects()` once on the full text range to get total line count and Y positions.
2. Binary-search for the character index where each line break occurs (where the rect count increments).
3. This reduces layout queries from O(n) to O(k × log n) where k is the number of lines.

**Naive approach (for reference; avoid for long text):** Iterate character-by-character, expanding the range and calling `getClientRects()` each time to see when the rect count increases. This is O(n) layout queries and should be replaced by the binary-search approach above.

#### Alternative: Height-tracking approach (more efficient than naive, still O(n) queries)

```typescript
function detectLinesOptimized(element: HTMLElement): string[] {
  const textNode = element.firstChild as Text;
  const range = document.createRange();
  const heightTracker = document.createRange();
  const lines: string[] = [];
  let prevHeight = 0;

  range.selectNodeContents(element);
  range.collapse(true); // Collapse to start

  for (let i = 0; i < textNode.length; i++) {
    heightTracker.setEnd(textNode, i + 1);
    const currentHeight = heightTracker.getBoundingClientRect().height;

    if (currentHeight > prevHeight && i > 0) {
      // Line break detected - extract previous line text
      range.setEnd(textNode, i);
      lines.push(range.toString().trim());
      range.setStart(textNode, i);
      prevHeight = currentHeight;
    }
  }

  // Don't forget the last line
  range.setEnd(textNode, textNode.length);
  lines.push(range.toString().trim());

  return lines;
}
```

**Why Range API over offsetTop measurement:**

1. **No pre-wrapping required** - Detect lines from original text nodes
2. **Accurate to browser rendering** - Uses actual layout, not approximated positions
3. **Simpler code path** - Measure first, wrap second
4. **Works before any DOM mutation** - Original text stays intact during detection

**For nested elements**: Use `TreeWalker` to iterate child text nodes, applying Range detection to each:

```typescript
const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
let node: Text | null;
while ((node = walker.nextNode() as Text)) {
  // Apply Range-based line detection to each text node
}
```

**Re-splitting on resize**: If `autoSplit` is enabled:

1. Track which types have been accessed (are in cache)
2. On resize/font-load, clear cache and re-split only those types
3. Call `onSplit` callback with updated result

```typescript
private _handleResize(): void {
  const accessedTypes = Object.keys(this._cache) as SplitType[];
  this._cache = {}; // Clear cache

  // Re-split only previously accessed types
  for (const type of accessedTypes) {
    this._performSplit(type);
  }

  this._options.onSplit?.(this);
}
```

### Unicode/Emoji Handling

Use `Intl.Segmenter` for proper character segmentation (with fallback for older browsers):

```typescript
const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
const chars = [...segmenter.segment(text)].map((s) => s.segment);
```

### Nested Element Handling

The `nested` option controls how inner DOM structure is handled (default: `'flatten'`).

- **`'flatten'` (default):** Extract plain text via `element.textContent`, ignore all inner DOM. Split that string only. Store original `innerHTML` for `revert()`. Safest and most predictable; avoids complex or malformed DOM.
- **`'preserve'`:** Use `TreeWalker` to traverse text nodes within nested elements. Apply line detection (when lines are requested) and splitting per text node while keeping parent element references. Preserves links, bold, etc. Use guards: skip non-text/non-element nodes; skip `script`/`style`; enforce a max depth safety limit (e.g. 10 levels) to avoid runaway traversal.
- **`number`:** Same as preserve but with a depth limit: preserve up to N levels of nesting, flatten content deeper than N (treat as plain text).

The `ignore` option can be an array of selectors (e.g. `['sup', 'sub']`) or a predicate `(node: Node) => boolean` to skip nodes during traversal in preserve/number modes.

### Performance Considerations

The Range API approach has O(n) character iteration complexity, but:

1. **Instantaneous for typical text** - Single paragraphs feel instant (per Ben Nadel's testing)
2. **No layout thrashing** - Detection happens before any DOM mutation
3. **Efficient for repeated splits** - `autoSplit` re-detection is fast since original structure is preserved
4. **Consider chunking for very long text** - For 10k+ character blocks, batch processing may help
5. **Line detection is opt-in and expensive** - Use the binary-search algorithm (see Line Detection); for long text prefer word-level splitting or `autoSplit` rather than frequent line re-detection

### Browser Compatibility

- **Safari whitespace quirk (confirmed still present in Safari 26.2 / WebKit 605.1.15, Feb 2025):** Safari's `Range.getClientRects()` returns rects based on the physical markup structure, not the rendered layout. When a text node contains raw markup whitespace (multiple spaces, newlines that visually collapse), Safari treats each whitespace-separated chunk as a separate "line" rect. Chrome and Firefox correctly return rects based on the visual line breaks regardless of raw whitespace. **Whitespace normalization (`textNode.textContent = text.trim().replace(/\s+/g, ' ')`) is required before any `getClientRects()` line detection on Safari.** This must be done in the `lineDetection.ts` implementation, not left to consumers. Originally documented by Ben Nadel (blog #4310), confirmed with the test below.
- **`Range.getClientRects()`:** Widely supported (all modern browsers)
- **`Range.getBoundingClientRect()`:** Not yet standard but widely supported
- **Fallback**: For edge cases, the offsetTop-based measurement can serve as fallback

#### Safari whitespace test results (Feb 2025, test case described in this plan test section)

Tested with a paragraph containing extra markup whitespace (multiple spaces, newlines that visually collapse). Ran `Range.getClientRects()`-based line detection with and without `textNode.textContent = text.trim().replace(/\s+/g, ' ')`:

| Browser                       | Without normalization                       | With normalization | Verdict                                      |
| ----------------------------- | ------------------------------------------- | ------------------ | -------------------------------------------- |
| Chrome 145                    | 2 lines                                     | 2 lines            | Line count matches; normalization not needed |
| Safari 26.2 (WebKit 605.1.15) | 9 lines (one per whitespace-separated word) | 2 lines            | Line count differs; normalization required   |

Conclusion: whitespace normalization before `getClientRects()` is mandatory for Safari and must be applied unconditionally in `lineDetection.ts` (harmless on other browsers). A Playwright test for this is included in the Phase 4 test section.
