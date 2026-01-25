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
  - id: accessibility
    content: Add ARIA attribute handling for screen reader support
    status: pending
    dependencies:
      - core-split
  - id: masking
    content: Implement mask wrapper functionality for reveal animations
    status: pending
    dependencies:
      - core-split
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
- **Return arrays**: Return `{ chars, words, lines, sentences }` arrays of HTMLElements for direct use with animation libraries
- **Lazy evaluation with caching**: Split types are computed on-demand when accessed, not eagerly on invocation
- **Eager split when `type` provided**: If `type` option is specified, only those types are split immediately
- **Accessibility by default**: Add ARIA attributes automatically
- **Revertible**: Include a `revert()` method to restore original content
- **Responsive support**: Optional `autoSplit` mode that re-splits on resize/font-load
- **Range API for line detection**: Use `Range.getClientRects()` to detect line breaks from text nodes _before_ DOM manipulation, avoiding unnecessary wrapper creation during measurement

## Package Structure

```javascript
packages/splittext/
├── src/
│   ├── index.ts              # Main entry point
│   ├── splitText.ts          # Core splitting logic
│   ├── lineDetection.ts      # Range API-based line detection
│   ├── types.ts              # TypeScript interfaces
│   ├── utils.ts              # Helper functions
│   ├── accessibility.ts      # ARIA handling
│   └── react/
│       ├── index.ts          # React entry
│       └── useSplitText.ts   # React hook
├── test/
│   ├── splitText.spec.ts     # Unit tests
│   └── react.spec.tsx        # React hook tests
├── docs/
│   ├── README.md             # Overview
│   ├── api/
│   │   ├── splitText.md      # Function API
│   │   └── types.md          # Type definitions
│   ├── guides/
│   │   ├── getting-started.md
│   │   └── accessibility.md
│   └── examples/
│       └── animations.md
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

### Types ([`packages/splittext/src/types.ts`](packages/splittext/src/types.ts))

```typescript
interface SplitTextOptions {
  // What to split
  type?: 'chars' | 'words' | 'lines' | 'sentences' | ('chars' | 'words' | 'lines' | 'sentences')[];

  // Accessibility
  aria?: 'auto' | 'hidden' | 'none';  // default: 'auto'

  // Responsive re-splitting
  autoSplit?: boolean;
  onSplit?: (result: SplitTextResult) => Animation | void;

  // Advanced
  splitBy?: string;        // default: ' ' (space for words)
  ignore?: string[];       // selectors to skip (e.g., ['sup', 'sub'])
  preserveWhitespace?: boolean;
}

interface SplitTextResult {
  // Lazy getters - split on first access, return cached on subsequent access
  get chars: HTMLElement[];      // Splits into characters on first access
  get words: HTMLElement[];      // Splits into words on first access
  get lines: HTMLElement[];      // Splits into lines on first access
  get sentences: HTMLElement[];  // Splits into sentences on first access

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
2. Set up [`package.json`](packages/splittext/package.json) following existing conventions:

- Name: `@wix/splittext`
- Dual CJS/ESM exports
- React as optional peer dependency

3. Configure TypeScript, Vite, and Vitest matching [interact package](packages/interact/package.json)

### Phase 2: Core Splitting Logic

Key files to implement:

1. **`src/splitText.ts`** - Main function:

- Parse target (CSS selector or element)
- **Use Range API for line detection** (see Key Implementation Details)
- Extract text content preserving structure
- Split into chars/words/lines/sentences
- Create wrapper spans with appropriate classes after detection

2. **`src/lineDetection.ts`** - Range-based line detection:

- `detectLines(element)` - Main detection function using Range API
- `detectLinesFromTextNode(textNode)` - Per-node detection with `getClientRects()`
- Handle Safari whitespace normalization
- Support for nested elements via TreeWalker

2. **`src/accessibility.ts`**:

- Add `aria-label` with original text to container
- Add `aria-hidden="true"` to split elements
- Handle nested elements appropriately

3. **`src/utils.ts`**:

- Text segmentation (handle emoji, unicode)
- DOM manipulation helpers
- Resize/font-load observers for autoSplit

### Phase 3: React Integration

1. **`src/react/useSplitText.ts`**:

- Hook that wraps core function
- Handle cleanup on unmount
- Support autoSplit with effect dependencies

### Phase 4: Testing

Test coverage for:

- Basic splitting (chars, words, lines)
- Various text content (emoji, unicode, mixed)
- Nested elements handling
- Accessibility attributes
- Revert functionality
- AutoSplit behavior
- React hook lifecycle
- **Lazy evaluation**: Verify no DOM changes until getter accessed
- **Caching**: Verify same array reference returned on repeated access
- **Eager split with `type`**: Verify immediate DOM changes when type provided
- **Cache invalidation**: Verify cache cleared on `revert()` and `autoSplit` resize

### Phase 5: Documentation

Following the [interact docs structure](packages/interact/docs/README.md):

- API reference with TypeScript signatures
- Getting started guide
- Accessibility guide
- Animation examples with `@wix/motion`

## Integration Example

```typescript
import { splitText } from '@wix/splittext';

// Example 1: Lazy evaluation - no splitting happens yet
const result = splitText('.headline');

// Splitting happens on first access, result is cached
const chars = result.chars; // Splits into chars NOW, caches result
const chars2 = result.chars; // Returns cached result (no re-split)

// Lines are split separately when accessed
const lines = result.lines; // Splits into lines NOW, caches result

// Example 2: Eager split with type option
const eagerResult = splitText('.headline', { type: 'words' });
// Words are split immediately on invocation

// Other types still use lazy evaluation
const lines2 = eagerResult.lines; // Splits into lines on access

// Example 3: Multiple types eager
const multiResult = splitText('.headline', { type: ['chars', 'words'] });
// Both chars and words split immediately

// Example 4: With animation library
const { chars } = splitText('.title', { type: 'chars' });
animate(chars, { opacity: [0, 1], stagger: 0.05 });
```

## Key Implementation Details

### Lazy Evaluation & Caching Strategy

The `SplitTextResult` object uses lazy getters with internal caching to avoid unnecessary DOM operations:

```typescript
class SplitTextResultImpl implements SplitTextResult {
  private _element: HTMLElement;
  private _originalHTML: string;

  // Internal cache for split results
  private _cache: {
    chars?: HTMLElement[];
    words?: HTMLElement[];
    lines?: HTMLElement[];
    sentences?: HTMLElement[];
  } = {};

  constructor(element: HTMLElement, options?: SplitTextOptions) {
    this._element = element;
    this._originalHTML = element.innerHTML;

    // Eager split if type is provided
    if (options?.type) {
      const types = Array.isArray(options.type) ? options.type : [options.type];
      for (const type of types) {
        this._performSplit(type);
      }
    }
  }

  // Lazy getter - split on first access, return cached thereafter
  get chars(): HTMLElement[] {
    if (!this._cache.chars) {
      this._cache.chars = this._performSplit('chars');
    }
    return this._cache.chars;
  }

  get words(): HTMLElement[] {
    if (!this._cache.words) {
      this._cache.words = this._performSplit('words');
    }
    return this._cache.words;
  }

  get lines(): HTMLElement[] {
    if (!this._cache.lines) {
      this._cache.lines = this._performSplit('lines');
    }
    return this._cache.lines;
  }

  get sentences(): HTMLElement[] {
    if (!this._cache.sentences) {
      this._cache.sentences = this._performSplit('sentences');
    }
    return this._cache.sentences;
  }

  private _performSplit(type: 'chars' | 'words' | 'lines' | 'sentences'): HTMLElement[] {
    // Actual splitting logic - creates wrapper elements in DOM
    // Returns array of created HTMLElements
  }

  revert(): void {
    this._element.innerHTML = this._originalHTML;
    this._cache = {}; // Clear cache on revert
  }
}
```

**Benefits of lazy evaluation:**

1. **Zero overhead if unused** - `splitText()` is cheap if you don't access any getters
2. **Pay for what you use** - Only requested split types perform DOM operations
3. **Efficient re-access** - Cached results avoid redundant DOM manipulation
4. **Predictable eager mode** - When `type` is specified, those splits happen immediately (useful for animations that need elements ready synchronously)

**Cache invalidation:**

- `revert()` clears the cache
- `autoSplit` on resize clears and re-populates cache for accessed types
- Manual `split()` call can force re-split with new options

### Line Detection Algorithm

**Primary Approach: Range API with `getClientRects()`**

Use the DOM Range API to detect line breaks from text nodes _before_ creating wrapper elements. This avoids unnecessary DOM manipulation and provides accurate line detection based on the browser's actual rendering:

```typescript
function detectLines(textNode: Text): string[] {
  const range = document.createRange();
  const text = textNode.textContent || '';
  const lines: string[][] = [];
  let lineChars: string[] = [];

  // Normalize whitespace (Safari compatibility)
  textNode.textContent = text.trim().replace(/\s+/g, ' ');

  for (let i = 0; i < text.length; i++) {
    range.setStart(textNode, 0);
    range.setEnd(textNode, i + 1);

    // getClientRects() returns one rect per rendered line
    const lineIndex = range.getClientRects().length - 1;

    if (!lines[lineIndex]) {
      lines.push((lineChars = []));
    }
    lineChars.push(text.charAt(i));
  }

  return lines.map((chars) => chars.join('').trim());
}
```

**Alternative: Height-tracking approach (more efficient for long text)**

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

Unlike some libraries that strip nested tags, this implementation will:

1. Use `TreeWalker` to traverse text nodes within nested elements
2. Apply Range-based line detection to each text node
3. Preserve nested element structure (links, bold, etc.)
4. Split text nodes only while maintaining parent element references

```typescript
function processNestedElements(element: HTMLElement): void {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);

  const textNodes: Text[] = [];
  let node: Text | null;
  while ((node = walker.nextNode() as Text)) {
    if (node.textContent?.trim()) {
      textNodes.push(node);
    }
  }

  // Process each text node with Range API
  for (const textNode of textNodes) {
    // Line detection happens here, wrapper creation follows
  }
}
```

### Performance Considerations

The Range API approach has O(n) character iteration complexity, but:

1. **Instantaneous for typical text** - Single paragraphs feel instant (per Ben Nadel's testing)
2. **No layout thrashing** - Detection happens before any DOM mutation
3. **Efficient for repeated splits** - `autoSplit` re-detection is fast since original structure is preserved
4. **Consider chunking for very long text** - For 10k+ character blocks, batch processing may help

### Browser Compatibility

- **Safari quirk**: Requires whitespace normalization before Range operations
- **`Range.getClientRects()`**: Widely supported (all modern browsers)
- **`Range.getBoundingClientRect()`**: Not yet standard but widely supported
- **Fallback**: For edge cases, the offsetTop-based measurement can serve as fallback
