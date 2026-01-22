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
  - id: core-split
    content: Implement core splitText function with chars/words/lines splitting
    status: pending
    dependencies:
      - types
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
---

# Text Splitting Package Plan

## Overview

Create a new `@wix/splittext` package within the `packages/` directory that exports a functional API for splitting text into animatable parts (characters, words, lines, sentences). The package will be framework-agnostic with optional React bindings.

## Key Design Decisions

Based on the reference libraries (GSAP SplitText, Motion splitText, Anime.js splitText), the API will:

- **Functional approach**: Export a `splitText()` function (like Motion/Anime.js) rather than a class-based API
- **Return arrays**: Return `{ chars, words, lines }` arrays of HTMLElements for direct use with animation libraries
- **Accessibility by default**: Add ARIA attributes automatically (like GSAP)
- **Revertible**: Include a `revert()` method to restore original content
- **Responsive support**: Optional `autoSplit` mode that re-splits on resize/font-load (inspired by GSAP)
- **Masking support**: Optional mask wrappers for reveal animations

## Package Structure

```javascript
packages/splittext/
├── src/
│   ├── index.ts              # Main entry point
│   ├── splitText.ts          # Core splitting logic
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
function splitText(
  target: string | HTMLElement,
  options?: SplitTextOptions
): SplitTextResult;
```

### Types ([`packages/splittext/src/types.ts`](packages/splittext/src/types.ts))

```typescript
interface SplitTextOptions {
  // What to split
  type?: 'chars' | 'words' | 'lines' | ('chars' | 'words' | 'lines')[];
  
  // Masking (wrap elements for clip reveal effects)
  mask?: 'chars' | 'words' | 'lines';
  
  // Custom classes
  charClass?: string;   // default: 'split-char'
  wordClass?: string;   // default: 'split-word'
  lineClass?: string;   // default: 'split-line'
  maskClass?: string;   // default: 'split-mask'
  
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
  chars: HTMLElement[];
  words: HTMLElement[];
  lines: HTMLElement[];
  masks: HTMLElement[];
  
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
  options?: SplitTextOptions
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
- Extract text content preserving structure
- Split into chars/words/lines
- Create wrapper spans with appropriate classes
- Handle line detection (measure word positions)
- Apply mask wrappers if requested

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

### Phase 5: Documentation

Following the [interact docs structure](packages/interact/docs/README.md):

- API reference with TypeScript signatures
- Getting started guide
- Accessibility guide
- Animation examples with `@wix/motion`

## Integration Example

```typescript
import { splitText } from '@wix/splittext';
import { motion } from '@wix/motion';

// Split heading into characters
const { chars, revert } = splitText('h1', { 
  type: 'chars',
  mask: 'chars'  // Add mask wrappers for reveal effect
});

// Animate with motion
motion.animate(chars, {
  y: ['100%', '0%'],
  opacity: [0, 1]
}, {
  duration: 0.5,
  delay: motion.stagger(0.03)
});

// Restore original HTML when done
setTimeout(revert, 2000);
```

## Key Implementation Details

### Line Detection Algorithm

Lines are detected by measuring word positions:

1. Split text into words first
2. Measure `offsetTop` of each word element
3. Group consecutive words with same `offsetTop` into lines
4. Re-wrap if `autoSplit` is enabled and container width changes

### Unicode/Emoji Handling

Use `Intl.Segmenter` for proper character segmentation (with fallback for older browsers):

```typescript
const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
const chars = [...segmenter.segment(text)].map(s => s.segment);
```

### Nested Element Handling

Unlike some libraries that strip nested tags, this implementation will:

1. Walk the DOM tree
2. Split text nodes only