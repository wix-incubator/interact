# interact-element Custom Element

The `interact-element` is a custom HTML element that serves as a wrapper for content that should have interactions applied to it. It automatically manages the connection between DOM elements and the `@wix/interact` system through an internal `InteractionController`.

> **Note for React Users**: Consider using the [`Interaction` component](../integration/react.md) from `@wix/interact/react` instead, which provides better React integration with ref forwarding and automatic cleanup.

## Import and Setup

When using the web entry point, you must ensure the custom element is defined before using it:

```typescript
import { Interact } from '@wix/interact/web';

// Create your configuration - this automatically defines the custom element
const interact = Interact.create(config);

// Or manually define it
Interact.defineInteractElement?.();
```

## Basic Usage

```html
<interact-element data-interact-key="unique-id">
  <div class="content">Your interactive content here</div>
</interact-element>
```

```typescript
import { Interact } from '@wix/interact/web';

// Configure interactions for the element
const config = {
  interactions: [
    {
      trigger: 'viewEnter',
      key: 'unique-id',
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
```

## HTML Usage

### Basic Structure

```html
<!-- Minimal structure -->
<interact-element data-interact-key="my-element">
  <div>Content to animate</div>
</interact-element>
```

### Required Attributes

#### `data-interact-key`

**Required:** Yes  
**Type:** `string`  
**Description:** Unique identifier matching the interaction configuration.

**Example:**

```html
<interact-element data-interact-key="hero">
  <div>Hero content</div>
</interact-element>
```

### Child Element Requirements

The custom element **must** contain at least one child to be the event/animation target element:

```html
<!-- ✅ Correct: Single child element -->
<interact-element data-interact-key="hero">
  <div class="hero-content">
    <h1>Title</h1>
    <p>Description</p>
  </div>
</interact-element>

<!-- ❌ Incorrect: No child element -->
<interact-element data-interact-key="empty"> </interact-element>

<!-- ❌ Incorrect: Text node only -->
<interact-element data-interact-key="text"> Just text content </interact-element>
```

## Properties

### `controller: IInteractionController`

The internal controller that manages this element's interactions.

**Example:**

```typescript
const element = document.querySelector('interact-element') as IInteractElement;

// Access the controller
const controller = element.controller;
console.log('Connected:', controller.connected);
console.log('Key:', controller.key);

// Toggle effects through controller
controller.toggleEffect('my-effect', 'add');
```

### `_internals: ElementInternals | null`

The element's internals for CSS custom state management.

**Example:**

```typescript
const element = document.querySelector('interact-element') as IInteractElement;

if (element._internals) {
  // Check active states
  console.log('States:', Array.from(element._internals.states));
}
```

## Methods

### `connect(key?: string)`

Connects the element to the interaction system.

**Parameters:**

- `key?: string` - Optional key override; defaults to `data-interact-key` attribute

**Example:**

```typescript
const element = document.querySelector('interact-element') as IInteractElement;

// Manually connect (usually automatic via connectedCallback)
element.connect('my-key');
```

### `disconnect()`

Disconnects the element from the interaction system and cleans up resources.

**Example:**

```typescript
const element = document.querySelector('interact-element') as IInteractElement;

// Manually disconnect
element.disconnect();
```

### `toggleEffect(effectId, method, item?)`

Toggles a CSS state effect on the element.

**Parameters:**

- `effectId: string` - The effect identifier
- `method: 'add' | 'remove' | 'toggle' | 'clear'` - How to change the state
- `item?: HTMLElement | null` - Optional specific element for list items

**Example:**

```typescript
const element = document.querySelector('interact-element') as IInteractElement;

// Add an effect
element.toggleEffect('active', 'add');

// Toggle an effect
element.toggleEffect('expanded', 'toggle');

// Remove an effect
element.toggleEffect('active', 'remove');

// Clear all effects
element.toggleEffect('', 'clear');
```

### `getActiveEffects(): string[]`

Returns an array of currently active effect IDs.

**Example:**

```typescript
const element = document.querySelector('interact-element') as IInteractElement;

const activeEffects = element.getActiveEffects();
console.log('Active effects:', activeEffects);
// e.g., ['hover', 'expanded']
```

## Framework Integration

### Vanilla JavaScript

```typescript
import { Interact } from '@wix/interact/web';

const config = {
  interactions: [
    {
      key: 'my-card',
      trigger: 'hover',
      effects: [{ effectId: 'lift' }],
    },
  ],
  effects: {
    lift: {
      duration: 200,
      keyframeEffect: {
        name: 'lift',
        keyframes: [{ transform: 'translateY(-4px)' }],
      },
    },
  },
};

Interact.create(config);

// Elements automatically connect when added to DOM
document.body.innerHTML = `
  <interact-element data-interact-key="my-card">
    <div class="card">Card content</div>
  </interact-element>
`;
```

### React (Using interact-element)

> **Recommended**: Use the [`Interaction` component](../integration/react.md) from `@wix/interact/react` instead.

```tsx
import React, { useEffect, useRef } from 'react';
import { Interact, IInteractElement } from '@wix/interact/web';

function InteractiveCard() {
  const ref = useRef<IInteractElement>(null);

  useEffect(() => {
    Interact.create(config);
    return () => Interact.destroy();
  }, []);

  const handleClick = () => {
    ref.current?.toggleEffect('clicked', 'toggle');
  };

  return (
    <interact-element ref={ref} data-interact-key="card">
      <button onClick={handleClick}>Toggle Effect</button>
    </interact-element>
  );
}
```

### Vue.js

```vue
<template>
  <interact-element :data-interact-key="elementKey" ref="interactElement">
    <div class="vue-content">
      <h2>{{ title }}</h2>
      <button @click="toggleEffect">Toggle</button>
    </div>
  </interact-element>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Interact, type IInteractElement } from '@wix/interact/web';

const elementKey = ref('vue-component');
const title = ref('Vue Component');
const interactElement = ref<IInteractElement>();

onMounted(() => {
  Interact.create(config);
});

onUnmounted(() => {
  Interact.destroy();
});

const toggleEffect = () => {
  interactElement.value?.toggleEffect('active', 'toggle');
};
</script>
```

### Angular

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Interact, type IInteractElement } from '@wix/interact/web';

@Component({
  selector: 'app-interactive',
  template: `
    <interact-element #interactElement data-interact-key="angular-component">
      <div class="angular-content">
        <h2>{{ title }}</h2>
        <button (click)="toggleEffect()">Toggle</button>
      </div>
    </interact-element>
  `,
})
export class InteractiveComponent implements AfterViewInit, OnDestroy {
  @ViewChild('interactElement')
  interactElement!: ElementRef<IInteractElement>;

  title = 'Angular Component';

  ngAfterViewInit() {
    Interact.create(config);
  }

  ngOnDestroy() {
    Interact.destroy();
  }

  toggleEffect() {
    this.interactElement.nativeElement.toggleEffect('active', 'toggle');
  }
}
```

## State Management

### Modern CSS States

When `ElementInternals` is supported, effects use modern CSS custom states:

```css
/* Modern syntax */
interact-element:state(hover-effect) > :first-child {
  transform: scale(1.05);
}

interact-element:state(active) > :first-child {
  background-color: blue;
}
```

### Legacy Fallback

For older browsers, the element falls back to data attributes:

```css
/* Data attribute fallback */
interact-element[data-interact-effect~='hover-effect'] > :first-child {
  transform: scale(1.05);
}

interact-element[data-interact-effect~='active'] > :first-child {
  background-color: blue;
}
```

### Programmatic State Control

```typescript
const element = document.querySelector('interact-element') as IInteractElement;

// Add multiple states
element.toggleEffect('hover', 'add');
element.toggleEffect('focus', 'add');
element.toggleEffect('disabled', 'add');

// Check current states
const activeEffects = element.getActiveEffects();
console.log('Active effects:', activeEffects);

// Clear all states
element.toggleEffect('', 'clear');
```

## List Management with watchChildList

The `controller.watchChildList(listContainer: string)` method sets up automatic tracking of list item additions and removals.

**Signature:**

```typescript
controller.watchChildList(listContainer: string): void
```

**Parameters:**

- `listContainer: string` - CSS selector for the container to watch

**Example:**

```typescript
const element = document.querySelector('interact-element') as IInteractElement;

// Start watching for child changes in a specific container
element.controller.watchChildList('.dynamic-list');

// Now any DOM mutations will trigger automatic interaction management
const container = element.querySelector('.dynamic-list');

// Adding items - interactions applied automatically
const newItem = document.createElement('div');
newItem.className = 'list-item';
container?.appendChild(newItem); // Automatically gets interactions

// Removing items - cleanup happens automatically
const itemToRemove = container?.querySelector('.item-5');
itemToRemove?.remove(); // Automatically cleaned up
```

**Automatic Usage:**
When you use `listContainer` in your configuration, `watchChildList` is called automatically:

```typescript
// This configuration automatically sets up the observer
{
    key: 'product-list',
    listContainer: '.products',  // Automatically calls watchChildList('.products')
    trigger: 'hover',
    effects: [/* ... */]
}
```

## Lifecycle

### Connection Flow

1. Element is added to DOM
2. `connectedCallback()` is called
3. `connect()` creates or retrieves an `InteractionController`
4. Controller is stored in `Interact.controllerCache`
5. Interactions are applied based on configuration

### Disconnection Flow

1. Element is removed from DOM
2. `disconnectedCallback()` is called
3. `disconnect()` cleans up the controller
4. Event listeners are removed
5. Controller is removed from cache (if element is fully removed)

## Browser Support

### Modern Browsers

- Full feature support including CSS custom states
- ElementInternals API for state management
- Adopted stylesheets for dynamic CSS

### Legacy Browsers

- Automatic fallback to data attributes
- CSS custom property fallbacks
- Polyfill support for custom elements

### Detection

```typescript
function checkSupport() {
  const element = document.createElement('interact-element') as IInteractElement;

  return {
    customElements: !!window.customElements,
    elementInternals: !!element.attachInternals,
    adoptedStyleSheets: !!document.adoptedStyleSheets,
    cssCustomStates: !!element._internals?.states,
  };
}

const support = checkSupport();
console.log('Browser support:', support);
```

## Debugging

### Element Inspection

```typescript
// Debug element state
function debugElement(key: string) {
  const controller = Interact.getController(key);

  if (!controller) {
    console.log(`Controller for ${key} not found in cache`);
    return;
  }

  const element = controller.element as IInteractElement;

  console.log(`Element ${key}:`, {
    connected: controller.connected,
    hasChild: !!element.firstElementChild,
    hasSheet: !!controller.sheet,
    hasInternals: !!element._internals,
    activeEffects: controller.getActiveEffects(),
  });
}

// Usage
debugElement('hero');
```

### Common Issues

```typescript
// Check for common problems
function validateElement(element: IInteractElement) {
  const issues: string[] = [];

  if (!element.dataset.interactKey) {
    issues.push('Missing data-interact-key attribute');
  }

  if (!element.firstElementChild) {
    issues.push('Missing child element');
  }

  if (!element.controller?.connected) {
    issues.push('Controller not connected to interaction system');
  }

  return issues;
}
```

## Comparison with Interaction Component

| Feature      | `<interact-element>` | `<Interaction>` (React) |
| ------------ | -------------------- | ----------------------- |
| Import       | `@wix/interact/web`  | `@wix/interact/react`   |
| Type         | Web Component        | React Component         |
| Ref handling | Manual               | Built-in forwarding     |
| TypeScript   | Requires casting     | Full inference          |
| SSR          | Requires care        | Better compatibility    |
| Framework    | Any                  | React only              |

## See Also

- [Interact Class](interact-class.md) - Main interaction manager
- [InteractionController](interaction-controller.md) - Controller API
- [Functions](functions.md) - `add()` and `remove()` functions
- [Type Definitions](types.md) - `IInteractElement` interface
- [React Integration](../integration/react.md) - React components
- [Configuration Guide](../guides/configuration-structure.md) - Setting up interactions
- [Getting Started](../guides/getting-started.md) - Basic usage examples
