# Standalone Functions

The `@wix/interact` package exports standalone functions for managing interactions at the element level: `add()`, `remove()`, and `generate()`. These functions work with any HTML element to apply and remove interactions.

## Import

```typescript
// From the mini entry point
import { add, remove, generate } from '@wix/interact';

// From the web entry point (for use with interact-element)
import { add, remove } from '@wix/interact/web';

// From the React entry point
import { add, remove } from '@wix/interact/react';
```

> **Note**: The `add` and `remove` functions are available from both `@wix/interact/web` and `@wix/interact/react` entry points. The `generate` function is only available from the main `@wix/interact` entry point.

## Functions Overview

| Function            | Purpose                                                   | Parameters                                | Returns  |
| ------------------- | --------------------------------------------------------- | ----------------------------------------- | -------- |
| `add()`             | Add interactions to an element                            | `element`, `key?`                         | `void`   |
| `remove()`          | Remove interactions from an element                       | `key`                                     | `void`   |
| `generate()`        | Generate CSS for hiding elements with entrance animations | `config`                                  | `string` |
| `addListItems()`    | Add interactions to new list items                        | `controller`, `listContainer`, `elements` | `void`   |
| `removeListItems()` | Remove interactions from list items                       | `elements`                                | `void`   |

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

```typescript
import { add, remove } from '@wix/interact/react';

// Works with any HTML element, not just interact-element
const div = document.createElement('div');
div.setAttribute('data-interact-key', 'my-element');
document.body.appendChild(div);

add(div, 'my-element');
```

### Behavior Details

#### What `add()` Does:

1. **Creates Controller**: Instantiates an `InteractionController` for the element
2. **Caches Controller**: Stores the controller in `Interact.controllerCache` for future reference
3. **Finds Configuration**: Looks up the interaction configuration for the given key
4. **Registers Triggers**: Sets up event listeners for all configured triggers (hover, click, etc.)
5. **Applies Effects**: Registers effects that target this element from other sources
6. **Handles Conditions**: Evaluates media queries and conditions to determine which interactions to activate
7. **Prevents Duplicates**: Tracks added interactions to avoid duplicate registrations

#### Element Requirements:

```html
<!-- ✅ Using interact-element (web approach) -->
<interact-element data-interact-key="my-hero">
  <div class="hero-content">Content to animate</div>
</interact-element>

<!-- ✅ Using regular element (React approach) -->
<div data-interact-key="my-hero">Content to animate</div>

<!-- ❌ Missing data-interact-key (and no key parameter) -->
<div>Content without key</div>
```

#### Error Handling:

```typescript
// The function handles various error cases gracefully
const element = document.querySelector('.my-element');

// Missing key - logs warning
add(element as HTMLElement);
// Console: "Interact: No key provided"

// No matching configuration - silently does nothing
add(element as HTMLElement, 'nonexistent');
```

### Advanced Usage

#### Programmatic Element Creation

```typescript
import { add } from '@wix/interact';

// Create element programmatically
const container = document.createElement('div');
container.setAttribute('data-interact-key', 'dynamic-element');

const content = document.createElement('div');
content.textContent = 'Animated content';
container.appendChild(content);

document.body.appendChild(container);

// Add interactions
add(container, 'dynamic-element');
```

#### Batch Processing

```typescript
import { add } from '@wix/interact';

// Add interactions to multiple elements efficiently
function addInteractionsToElements(selector: string) {
  const elements = document.querySelectorAll(selector);

  elements.forEach((element) => {
    const key = element.getAttribute('data-interact-key');
    if (key) {
      add(element as HTMLElement, key);
    }
  });
}

// Usage
addInteractionsToElements('[data-interact-key]');
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

#### Dynamic Content Management

```typescript
import { add, remove } from '@wix/interact';

// Remove interactions when content changes
function updateContent(key: string, newContent: string) {
  // Remove old interactions
  remove(key);

  // Update content
  const element = document.querySelector(`[data-interact-key="${key}"]`);
  if (element?.firstElementChild) {
    element.firstElementChild.textContent = newContent;
  }

  // Re-add interactions if needed
  if (element) {
    add(element as HTMLElement, key);
  }
}
```

#### Cleanup Before Page Navigation

```typescript
import { remove } from '@wix/interact';

// Clean up all interactions before navigation
function cleanupInteractions() {
  const elements = document.querySelectorAll('[data-interact-key]');

  elements.forEach((element) => {
    const key = element.getAttribute('data-interact-key');
    if (key) {
      remove(key);
    }
  });

  console.log('All interactions cleaned up');
}

// Call before page unload
window.addEventListener('beforeunload', cleanupInteractions);
```

### Behavior Details

#### What `remove()` Does:

1. **Finds Cached Controller**: Looks up the controller in `Interact.controllerCache`
2. **Disconnects Controller**: Calls `disconnect()` on the controller
3. **Removes Event Listeners**: Cleans up all registered trigger handlers
4. **Clears Element State**: Resets any active interaction states on the element
5. **Cleans Instance State**: Calls `clearInteractionStateForKey()` on the managing instance
6. **Removes from Cache**: Deletes the controller from `Interact.controllerCache`

#### Safe to Call Multiple Times:

```typescript
// Safe to call remove() multiple times
remove('element');
remove('element'); // No error, simply does nothing
remove('nonexistent'); // No error, key not found
```

#### Automatic Cleanup:

```typescript
// The interact-element custom element automatically handles cleanup
const element = document.querySelector('interact-element[data-interact-key="auto"]');

// Removing from DOM automatically triggers cleanup via disconnectedCallback
element?.remove();
```

---

## `addListItems(controller, listContainer, elements)`

Manually adds interactions to newly added list items in a dynamic list. This function is typically called automatically by the mutation observer when using `listContainer`, but can be called manually for advanced use cases.

### Signature

```typescript
function addListItems(
  controller: IInteractionController,
  listContainer: string,
  elements: HTMLElement[],
): void;
```

### Parameters

**`controller: IInteractionController`**

- The interaction controller managing the list container
- Can be obtained via `Interact.getController(key)`

**`listContainer: string`**

- CSS selector for the list container
- Must match the `listContainer` specified in the interaction configuration

**`elements: HTMLElement[]`**

- Array of new elements to add interactions to
- These elements should be children (or descendants) of the list container

### Examples

#### Manual List Item Addition

```typescript
import { Interact } from '@wix/interact';

// Get the controller
const controller = Interact.getController('product-list');

if (controller) {
  // Create new items
  const newItems = [document.createElement('div'), document.createElement('div')];

  newItems.forEach((item, index) => {
    item.className = 'product-card';
    item.textContent = `Product ${index + 1}`;
  });

  // Add to DOM
  const container = controller.element.querySelector('.products');
  newItems.forEach((item) => container?.appendChild(item));

  // Manually add interactions to new items (typically automatic)
  // addListItems(controller, '.products', newItems);
}
```

#### Automatic vs Manual Usage:

**Automatic (Recommended):**

```typescript
// When using listContainer, mutation observer handles this automatically
{
    key: 'auto-list',
    listContainer: '.items',
    trigger: 'hover',
    effects: [/* ... */]
}

// Just add to DOM - interactions apply automatically
const container = document.querySelector('.items');
container?.appendChild(newElement);
```

**Manual (Advanced):**

```typescript
import { Interact } from '@wix/interact';
// Note: addListItems is not exported from public API
// It's used internally by InteractionController

const controller = Interact.getController('manual-list');
if (controller) {
  // The controller handles list items automatically via watchChildList
  controller.watchChildList('.container');
}
```

---

## `removeListItems(elements)`

Removes all interactions and event listeners from list item elements. Called automatically by mutation observers when items are removed from a list, but can be called manually for cleanup.

### Signature

```typescript
function removeListItems(elements: HTMLElement[]): void;
```

### Parameters

**`elements: HTMLElement[]`**

- Array of elements to remove interactions from
- These should be elements that previously had interactions added

### Examples

#### Manual Cleanup Before Removal

```typescript
// Note: removeListItems is typically handled automatically
// When using interact-element or Interaction component, cleanup is automatic

function removeProduct(productElement: HTMLElement) {
  // Simply remove from DOM - cleanup happens automatically
  productElement.remove();
}
```

#### Batch Removal

```typescript
function clearFilteredItems(category: string) {
  const items = document.querySelectorAll(`.product-card[data-category="${category}"]`);

  // Simply remove from DOM - cleanup happens automatically via mutation observer
  items.forEach((item) => item.remove());
}
```

---

## Performance Considerations

### Efficient Usage Patterns

#### Good: Batch Operations

```typescript
import { add } from '@wix/interact';

// Process multiple elements efficiently
const elements = document.querySelectorAll('[data-interact-key]');
elements.forEach((el) => {
  const key = (el as HTMLElement).dataset.interactKey;
  if (key) add(el as HTMLElement, key);
});
```

#### Avoid: Redundant Calls

```typescript
// Avoid: The controller already exists after first add()
add(element, 'hero');
add(element, 'hero'); // Redundant - controller already connected
```

## Error Handling

Both functions include comprehensive error handling:

```typescript
import { add, remove } from '@wix/interact';

// add() error scenarios
const element = document.querySelector('.my-element') as HTMLElement;

// Missing key - logs warning
add(element);
// Console: "Interact: No key provided"

// No configuration found - silently continues
add(element, 'unconfigured');

// remove() error scenarios
remove(''); // Safe, does nothing
remove('nonexistent'); // Safe, key not found in cache
```

## TypeScript Support

Full TypeScript support with proper type checking:

```typescript
import { add, remove } from '@wix/interact';

const element = document.querySelector('[data-interact-key="hero"]') as HTMLElement;

if (element) {
  add(element, 'hero');
}

// Type-safe key parameter
const key: string = 'hero';
remove(key);
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
function generateCSS(config: InteractConfig): string
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
  initial: false  // Element visible immediately, no hiding
}
```

### Examples

#### Basic SSR Usage

```typescript
import { generateCSS, InteractConfig } from '@wix/interact';

const config: InteractConfig = {
  interactions: [{
    key: 'hero',
    trigger: 'viewEnter',
    params: { type: 'once', threshold: 0.2 },
    effects: [{
      keyframeEffect: {
        name: 'fade-slide-in',
        keyframes: [
          { opacity: 0, transform: 'translateY(40px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ]
      },
      duration: 800,
      easing: 'ease-out'
    }]
  }],
  effects: {}
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

const config = {/* your config */};

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
          { filter: 'blur(0)', opacity: 1 }
        ]
      },
      duration: 1000,
      // Custom initial matches the animation's starting keyframe
      initial: {
        filter: 'blur(20px)',
        opacity: 0
      }
    }
  },
  interactions: [{
    key: 'content-block',
    trigger: 'viewEnter',
    effects: [{ effectId: 'blur-reveal' }]
  }]
};

const css = generateCSS(config);
// CSS will include a `from` keyframe with filter and opacity
```

#### Conditional Animations with Media Queries

```typescript
const config: InteractConfig = {
  conditions: {
    desktop: { type: 'media', predicate: '(min-width: 1024px)' },
    'prefers-motion': { type: 'media', predicate: '(prefers-reduced-motion: no-preference)' }
  },
  interactions: [{
    key: 'hero',
    trigger: 'viewEnter',
    effects: [{
      keyframeEffect: {
        name: 'complex-entrance',
        keyframes: [
          { opacity: 0, transform: 'translateY(60px) scale(0.9)' },
          { opacity: 1, transform: 'translateY(0) scale(1)' }
        ]
      },
      duration: 1000,
      conditions: ['desktop', 'prefers-motion']
    }]
  }]
};

const css = generateCSS(config);
// Generated CSS will be wrapped in:
// @media (min-width: 1024px) and (prefers-reduced-motion: no-preference) { ... }
```

#### Transition Effects

`generateCSS` also supports transition effects:

```typescript
const config: InteractConfig = {
  interactions: [{
    key: 'button',
    trigger: 'hover',
    effects: [{
      transition: {
        duration: 200,
        easing: 'ease-out',
        styleProperties: [
          { name: 'transform', value: 'scale(1.05)' },
          { name: 'box-shadow', value: '0 8px 16px rgba(0,0,0,0.15)' }
        ]
      }
    }]
  }]
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
[data-interact-key="hero"] > :first-child {
  --anim-def-hero-0: fade-slide-in 800ms ease-out forwards;
}

/* 3. Animation application rule */
[data-interact-key="hero"] > :first-child {
  animation-composition: replace;
  animation: var(--anim-def-hero-0, none);
}

/* 4. Transition state rules (for transition effects) */
[data-interact-key="button"]:state(hover-effect) > :first-child,
[data-interact-key="button"][data-interact-effect~="hover-effect"] > :first-child {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}
```

### Best Practices

1. **Call once at build time or server startup**: The output is deterministic, so cache the result
2. **Inject before first paint**: Place the `<style>` tag in `<head>` to prevent FOUC
3. **Use with `Interact.create()`**: The CSS handles styling; JavaScript handles triggers
4. **Match initial to keyframes**: When using custom `initial`, ensure it matches your animation's starting state
5. **Use conditions for accessibility**: Wrap animations in `prefers-reduced-motion` conditions

### Triggers Supported

| Trigger | Supported | Notes |
|---------|-----------|-------|
| `viewEnter` | ✅ | Full support with initial states |
| `hover` | ✅ | Transition effects work; alternate/repeat behaviors |
| `click` | ✅ | Transition effects for state changes |
| `animationEnd` | ✅ | Chained animations |
| `pageVisible` | ✅ | Similar to viewEnter |
| `viewProgress` | ❌ | Requires JavaScript scroll handling |
| `pointerMove` | ❌ | Requires JavaScript pointer tracking |

---

## See Also

- [Interact Class](interact-class.md) - Main interaction manager
- [InteractionController](interaction-controller.md) - Controller API
- [Custom Element](interact-element.md) - `interact-element` API
- [React Integration](../integration/react.md) - React components and hooks
- [Entrance Animations](../examples/entrance-animations.md) - `viewEnter` trigger examples
- [Type Definitions](types.md) - `IInteractionController` and other types
- [Getting Started](../guides/getting-started.md) - Basic usage examples
