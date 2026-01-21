# Standalone Functions

The `@wix/interact` package exports standalone functions for managing interactions at the element level: `add()`, `remove()`, and `generate()`. These functions work with any HTML element to apply and remove interactions.

## Import

```typescript
import { add, remove, generate } from '@wix/interact';
```

> **Note**: The `add` and `remove` functions are available from both `@wix/interact/web` and `@wix/interact/react` entry points. The `generate` function is only available from the main `@wix/interact` entry point.

## Functions Overview

| Function     | Purpose                                                   | Parameters        | Returns  |
| ------------ | --------------------------------------------------------- | ----------------- | -------- |
| `add()`      | Add interactions to an element                            | `element`, `key?` | `void`   |
| `remove()`   | Remove interactions from an element                       | `key`             | `void`   |
| `generate()` | Generate CSS for hiding elements with entrance animations | `config`          | `string` |

---

## `add(element, key?)`

Adds all configured interactions and effects to an element based on its key configuration. This function creates an `InteractionController` internally to manage the element's interactions.

### Signature

```typescript
function add(element: HTMLElement, key?: string): void;
```

### Parameters

**`element: HTMLElement`**

- Any HTML element that should have interactions applied
- Can be an `interact-element` custom element or a regular HTML element
- Should have `data-interact-key` attribute if `key` is not provided

**`key?: string`** (optional)

- The unique identifier for the element in the interaction configuration
- If not provided, the function will use `element.dataset.interactKey`
- Must match a key defined in an `Interact` instance's configuration

### Returns

**`void`** - This function does not return a value. The element's controller is stored in `Interact.controllerCache`.

### Examples

#### Basic Usage

```typescript
import { Interact, add } from '@wix/interact';

// Create interaction configuration
const config = {
  interactions: [
    {
      trigger: 'viewEnter',
      key: 'my-hero',
      effects: [{ effectId: 'fade-in' }],
    },
  ],
  effects: {
    'fade-in': {
      duration: 1000,
      keyframeEffect: {
        name: 'fade-in',
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
      },
    },
  },
};

Interact.create(config);

// Get the element and add interactions
const element = document.querySelector('[data-interact-key="my-hero"]');
if (element) {
  add(element as HTMLElement, 'my-hero');
}
```

#### Using data-interact-key Attribute

```typescript
// When key is stored in the element's data attribute
const element = document.querySelector('[data-interact-key="hero"]');
if (element) {
  // Key is inferred from data-interact-key
  add(element as HTMLElement);
}
```

#### With Regular HTML Elements (React approach)

```tsx
import { add, remove } from '@wix/interact/react';

function MyComponent() {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (elementRef.current) {
      add(elementRef.current, 'my-hero');
    }

    return () => {
      if (elementRef.current) {
        remove('my-hero');
      }
    };
  }, []);

  return (
    <div ref={elementRef} data-interact-key="my-hero">
      Content to animate
    </div>
  );
}
```

### Element Requirements:

```html
<!-- ✅ Using interact-element (web approach) -->
<interact-element data-interact-key="my-hero">
  <div class="hero-content">Content to animate</div>
</interact-element>

<!-- ✅ Using regular element (Vanilla/React approach) -->
<div data-interact-key="my-hero">Content to animate</div>

<!-- ❌ Missing data-interact-key (and no key parameter) -->
<div>Content without key</div>
```

### Advanced Usage

#### Programmatic Element Creation

```typescript
import { add } from '@wix/interact';

// Create element programmatically
const container = document.createElement('div');

// add stuff to container...

document.body.appendChild(container);

// Add interactions
add(container, 'dynamic-element');
```

---

## `remove(key)`

Removes all interactions and effects from an element and cleans up associated resources.

### Signature

```typescript
function remove(key: string): void;
```

### Parameters

**`key: string`**

- The unique identifier for the element to remove interactions from
- Should match the key used when interactions were added
- Used to look up the cached controller and its interactions

### Returns

**`void`** - This function does not return a value

### Examples

#### Basic Removal

```typescript
import { remove } from '@wix/interact';

// Remove all interactions from an element
remove('hero');

// The element is no longer interactive and is removed from cache
console.log('Interactions removed for hero');
```

---

## `generate(config)`

Generates CSS styles needed to hide elements that have entrance animations with a `viewEnter` trigger. This prevents a flash of unstyled content (FOUC) where elements briefly appear before their entrance animation starts.

### Signature

```typescript
function generate(config: InteractConfig): string;
```

### Parameters

**`config: InteractConfig`**

- The interaction configuration object
- Used to determine which elements need initial hiding styles

### Returns

**`string`** - A CSS string that can be injected into a `<style>` tag or stylesheet

### Generated CSS

The function generates CSS that:

1. **Respects reduced motion preferences**: Wrapped in `@media (prefers-reduced-motion: no-preference)` to ensure accessibility
2. **Targets first child of elements with `data-interact-initial="true"`**: Only affects elements explicitly marked for entrance animations
3. **Excludes completed animations**: Uses `:not([data-motion-enter="done"])` to show elements after their animation completes

```css
@media (prefers-reduced-motion: no-preference) {
  [data-interact-initial='true'] > :first-child:not([data-motion-enter='done']) {
    visibility: hidden;
    transform: none;
    translate: none;
    scale: none;
    rotate: none;
  }
}
```

### Examples

#### Basic Usage

```typescript
import { Interact, generate } from '@wix/interact';

const config = {
  interactions: [
    {
      key: 'hero',
      trigger: 'viewEnter',
      params: { type: 'once', threshold: 0.2 },
      effects: [
        {
          keyframeEffect: {
            name: 'fade-in',
            keyframes: [
              { opacity: 0, transform: 'translateY(40px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
          },
          duration: 800,
        },
      ],
    },
  ],
  effects: {},
};

// Generate the CSS
const css = generate(config);

// Inject into page
const styleElement = document.createElement('style');
styleElement.textContent = css;
document.head.appendChild(styleElement);

// Create the Interact instance
Interact.create(config);
```

#### Server-Side Rendering (SSR)

For SSR scenarios, generate the CSS on the server and include it in the initial HTML:

```typescript
// server.ts
import { generate, InteractConfig } from '@wix/interact';

const config: InteractConfig = {
  interactions: [
    /* your interactions */
  ],
  effects: {},
};

const css = generate(config);

// Include in your HTML template
const html = `
<!DOCTYPE html>
<html>
<head>
  <style>${css}</style>
</head>
<body>
  <!-- Your content -->
</body>
</html>
`;
```

### HTML Setup

For the generated CSS to work, the `<interact-element>` must have the `data-interact-initial="true"` attribute:

```html
<interact-element data-interact-key="hero" data-interact-initial="true">
  <!-- First child will be hidden until viewEnter animation completes -->
  <section class="hero">
    <h1>Welcome</h1>
  </section>
</interact-element>

<!-- Without the attribute, element is visible immediately -->
<interact-element data-interact-key="footer">
  <footer>Footer content</footer>
</interact-element>
```

---

## `generateCSS(config)`

Generates complete CSS for time-based animations from an `InteractConfig`. This function is designed for **Server-Side Rendering (SSR)** or **efficient Client-Side Rendering (CSR)** by pre-generating CSS animations that can be rendered in a `<style>` tag at the top of the document.

Unlike runtime JavaScript animations, `generateCSS` outputs pure CSS that browsers can parse and execute immediately, providing:

- **Faster initial render**: Animations start without waiting for JavaScript hydration
- **Better performance**: CSS animations run on the compositor thread
- **SSR compatibility**: Works with any server-side rendering framework
- **Reduced JavaScript overhead**: Animation logic handled by the browser

### Signature

```typescript
function generateCSS(config: InteractConfig): string;
```

### Parameters

**`config: InteractConfig`**

- The interaction configuration object
- Only processes time-based triggers: `viewEnter`, `hover`, `click`, `animationEnd`, `pageVisible`
- Ignores scrub-based triggers (`viewProgress`, `pointerMove`) which require JavaScript

### Returns

**`string`** - A complete CSS string containing:

- `@keyframes` rules for all animations
- Animation property rules with CSS custom properties
- Transition rules for transition effects
- Initial state styles for elements with entrance animations

### How It Works

1. **Parses the configuration** to find all time-based interactions
2. **Generates `@keyframes`** rules for each unique animation
3. **Creates CSS rules** that apply animations to elements via `[data-interact-key]` selectors
4. **Applies initial states** to hide elements before entrance animations (using the `initial` property)
5. **Respects conditions** by wrapping rules in `@media` or `@container` queries as needed

### The `initial` Property

The `initial` property on effects defines the CSS state of an element **before** its animation starts. This is critical for entrance animations to prevent a "flash" of the final state before the animation begins.

```typescript
type initial = Record<string, string | number> | false;
```

**Default behavior**: When not specified, `generateCSS` applies a default initial state:

```typescript
{
  visibility: 'hidden',
  transform: 'none',
  translate: 'none',
  scale: 'none',
  rotate: 'none',
}
```

**Custom initial state**: Override with specific properties:

```typescript
{
  key: 'hero',
  keyframeEffect: {
    name: 'slide-up',
    keyframes: [
      { opacity: 0, transform: 'translateY(50px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ]
  },
  duration: 800,
  initial: {
    opacity: 0,
    transform: 'translateY(50px)'
  }
}
```

**Disable initial state**: Set to `false` to skip the initial `from` keyframe:

```typescript
{
  initial: false; // Element visible immediately, no hiding
}
```

### Examples

#### Basic SSR Usage

```typescript
import { generateCSS, InteractConfig } from '@wix/interact';

const config: InteractConfig = {
  interactions: [
    {
      key: 'hero',
      trigger: 'viewEnter',
      params: { type: 'once', threshold: 0.2 },
      effects: [
        {
          keyframeEffect: {
            name: 'fade-slide-in',
            keyframes: [
              { opacity: 0, transform: 'translateY(40px)' },
              { opacity: 1, transform: 'translateY(0)' },
            ],
          },
          duration: 800,
          easing: 'ease-out',
        },
      ],
    },
  ],
  effects: {},
};

// Generate CSS at build time or on the server
const animationCSS = generateCSS(config);

// Output the CSS in your HTML template
const html = `
<!DOCTYPE html>
<html>
<head>
  <style id="interact-animations">${animationCSS}</style>
</head>
<body>
  <div data-interact-key="hero">
    <section class="hero">
      <h1>Welcome</h1>
    </section>
  </div>
</body>
</html>
`;
```

#### Client-Side Rendering with Pre-Generated CSS

For CSR applications, inject the CSS before the first paint:

```typescript
import { Interact, generateCSS } from '@wix/interact';

const config = {
  /* your config */
};

// Generate and inject CSS immediately
const css = generateCSS(config);
const style = document.createElement('style');
style.id = 'interact-css';
style.textContent = css;
document.head.appendChild(style);

// Then initialize Interact (can happen later, even after hydration)
Interact.create(config);
```

#### React SSR with Next.js

```tsx
// app/layout.tsx (App Router)
import { generateCSS } from '@wix/interact';
import { interactConfig } from './interact-config';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const animationCSS = generateCSS(interactConfig);

  return (
    <html>
      <head>
        <style dangerouslySetInnerHTML={{ __html: animationCSS }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

#### Using Custom Initial States

```typescript
const config: InteractConfig = {
  effects: {
    'blur-reveal': {
      keyframeEffect: {
        name: 'blur-reveal',
        keyframes: [
          { filter: 'blur(20px)', opacity: 0 },
          { filter: 'blur(0)', opacity: 1 },
        ],
      },
      duration: 1000,
      // Custom initial matches the animation's starting keyframe
      initial: {
        filter: 'blur(20px)',
        opacity: 0,
      },
    },
  },
  interactions: [
    {
      key: 'content-block',
      trigger: 'viewEnter',
      effects: [{ effectId: 'blur-reveal' }],
    },
  ],
};

const css = generateCSS(config);
// CSS will include a `from` keyframe with filter and opacity
```

#### Conditional Animations with Media Queries

```typescript
const config: InteractConfig = {
  conditions: {
    desktop: { type: 'media', predicate: '(min-width: 1024px)' },
    'prefers-motion': { type: 'media', predicate: '(prefers-reduced-motion: no-preference)' },
  },
  interactions: [
    {
      key: 'hero',
      trigger: 'viewEnter',
      effects: [
        {
          keyframeEffect: {
            name: 'complex-entrance',
            keyframes: [
              { opacity: 0, transform: 'translateY(60px) scale(0.9)' },
              { opacity: 1, transform: 'translateY(0) scale(1)' },
            ],
          },
          duration: 1000,
          conditions: ['desktop', 'prefers-motion'],
        },
      ],
    },
  ],
};

const css = generateCSS(config);
// Generated CSS will be wrapped in:
// @media (min-width: 1024px) and (prefers-reduced-motion: no-preference) { ... }
```

#### Transition Effects

`generateCSS` also supports transition effects:

```typescript
const config: InteractConfig = {
  interactions: [
    {
      key: 'button',
      trigger: 'hover',
      effects: [
        {
          transition: {
            duration: 200,
            easing: 'ease-out',
            styleProperties: [
              { name: 'transform', value: 'scale(1.05)' },
              { name: 'box-shadow', value: '0 8px 16px rgba(0,0,0,0.15)' },
            ],
          },
        },
      ],
    },
  ],
};

const css = generateCSS(config);
// Generates transition rules with :state() and [data-interact-effect] selectors
```

### Generated CSS Structure

The output CSS follows this structure:

```css
/* 1. @keyframes rules */
@keyframes fade-slide-in {
  from {
    visibility: hidden;
    transform: none;
    /* ... default initial state */
  }
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 2. Animation custom property definitions (conditional) */
[data-interact-key='hero'] > :first-child {
  --anim-def-hero-0: fade-slide-in 800ms ease-out forwards;
}

/* 3. Animation application rule */
[data-interact-key='hero'] > :first-child {
  animation-composition: replace;
  animation: var(--anim-def-hero-0, none);
}

/* 4. Transition state rules (for transition effects) */
[data-interact-key='button']:state(hover-effect) > :first-child,
[data-interact-key='button'][data-interact-effect~='hover-effect'] > :first-child {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}
```

### Best Practices

1. **Call once at build time or server startup**: The output is deterministic, so cache the result
2. **Inject before first paint**: Place the `<style>` tag in `<head>` to prevent FOUC
3. **Use with `Interact.create()`**: The CSS handles styling; JavaScript handles triggers
4. **Match initial to keyframes**: When using custom `initial`, ensure it matches your animation's starting state
5. **Use conditions for accessibility**: Wrap animations in `prefers-reduced-motion` conditions

### Triggers Supported

| Trigger        | Supported | Notes                                               |
| -------------- | --------- | --------------------------------------------------- |
| `viewEnter`    | ✅        | Full support with initial states                    |
| `hover`        | ✅        | Transition effects work; alternate/repeat behaviors |
| `click`        | ✅        | Transition effects for state changes                |
| `animationEnd` | ✅        | Chained animations                                  |
| `pageVisible`  | ✅        | Similar to viewEnter                                |
| `viewProgress` | ❌        | Requires JavaScript scroll handling                 |
| `pointerMove`  | ❌        | Requires JavaScript pointer tracking                |

---

## See Also

- [Interact Class](interact-class.md) - Main interaction manager
- [InteractionController](interaction-controller.md) - Controller API
- [Custom Element](interact-element.md) - `interact-element` API
- [React Integration](../integration/react.md) - React components and hooks
- [Entrance Animations](../examples/entrance-animations.md) - `viewEnter` trigger examples
- [Type Definitions](types.md) - `IInteractionController` and other types
- [Getting Started](../guides/getting-started.md) - Basic usage examples
