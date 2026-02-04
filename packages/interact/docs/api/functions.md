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
3. **Excludes completed animations**: Uses `:not([data-interact-enter="done"])` to show elements after their animation completes

**For the `web` integration (with custom elements)**:
```css
@media (prefers-reduced-motion: no-preference) {
  [data-interact-initial='true'] > :first-child:not([data-interact-enter='done']) {
    visibility: hidden;
    transform: none;
    translate: none;
    scale: none;
    rotate: none;
  }
}
```

**For other integrations (without custom elements)**:
```css
@media (prefers-reduced-motion: no-preference) {
  [data-interact-initial='true']:not([data-interact-enter='done']) {
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

## See Also

- [Interact Class](interact-class.md) - Main interaction manager
- [InteractionController](interaction-controller.md) - Controller API
- [Custom Element](interact-element.md) - `interact-element` API
- [React Integration](../integration/react.md) - React components and hooks
- [Entrance Animations](../examples/entrance-animations.md) - `viewEnter` trigger examples
- [Type Definitions](types.md) - `IInteractionController` and other types
- [Getting Started](../guides/getting-started.md) - Basic usage examples
