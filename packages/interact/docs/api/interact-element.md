# interact-element Custom Element

The `interact-element` is a custom HTML element that serves as a wrapper for content that should have interactions applied to it. It automatically manages the connection between DOM elements and the `@wix/interact` system.

## Basic Usage

```html
<interact-element data-interact-key="unique-id">
  <div class="content">Your interactive content here</div>
</interact-element>
```

```typescript
import { Interact } from '@wix/interact';

// Configure interactions for the element
const config = {
  interactions: [{
    trigger: 'viewEnter',
    key: 'unique-id',
    effects: [{ effectId: 'fade-in' }]
  }],
  effects: {
    'fade-in': {
      duration: 1000,
      keyframeEffect: {
        name: 'fade-in',
        keyframes: [
          { opacity: 0 },
          { opacity: 1 }
        ]
      }
    }
  }
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
<interact-element data-interact-key="empty">
</interact-element>


<!-- ❌ Incorrect: Text node only -->
<interact-element data-interact-key="text">
  Just text content
</interact-element>
```

## Framework Integration

### React

```tsx
import React from 'react';

// Basic React usage
function InteractiveComponent() {
  return (
    <interact-element data-interact-key="react-component">
      <div className="content">
        <h2>React Component</h2>
        <p>This will be animated</p>
      </div>
    </interact-element>
  );
}

// TypeScript with proper typing
import { IInteractElement } from '@wix/interact';

function TypedComponent() {
  const ref = React.useRef<IInteractElement>(null);
  
  const handleClick = () => {
    ref.current?.toggleEffect('clicked', 'toggle');
  };
  
  return (
    <interact-element 
      ref={ref}
      data-interact-key="typed-component"
    >
      <button onClick={handleClick}>
        Toggle Effect
      </button>
    </interact-element>
  );
}
```

### Vue.js

```vue
<template>
  <interact-element 
    :data-interact-key="elementPath"
    ref="interactElement"
  >
    <div class="vue-content">
      <h2>{{ title }}</h2>
      <button @click="toggleEffect">Toggle</button>
    </div>
  </interact-element>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { IInteractElement } from '@wix/interact';

const elementPath = ref('#vue-component');
const title = ref('Vue Component');
const interactElement = ref<IInteractElement>();

const toggleEffect = () => {
  interactElement.value?.toggleEffect('active', 'toggle');
};
</script>
```

### Angular

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import type { IInteractElement } from '@wix/interact';

@Component({
  selector: 'app-interactive',
  template: `
    <interact-element 
      #interactElement
      data-interact-key="angular-component"
    >
      <div class="angular-content">
        <h2>{{ title }}</h2>
        <button (click)="toggleEffect()">Toggle</button>
      </div>
    </interact-element>
  `
})

export class InteractiveComponent implements AfterViewInit {
  @ViewChild('interactElement') 
  interactElement!: ElementRef<IInteractElement>;
  
  title = 'Angular Component';
  
  ngAfterViewInit() {
    // Element is ready for interaction
    console.log('Connected:', this.interactElement.nativeElement.connected);
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

For older browsers, the element falls back to CSS custom properties:

```css
/* Legacy syntax */
interact-element:--hover-effect > :first-child {
  transform: scale(1.05);
}

/* Or data attribute fallback */
interact-element[data-interact-effect~="hover-effect"] > :first-child {
  transform: scale(1.05);
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
if (element._internals) {
  console.log('Active states:', Array.from(element._internals.states));
} else {
  const effectAttr = element.dataset.interactEffect;
  console.log('Active effects:', effectAttr?.split(' ') || []);
}

// Clear all states
element.toggleEffect('', 'clear');
```

### List Management with watchChildList

The `watchChildList(listContainer: string)` method sets up automatic tracking of list item additions and removals.

**Signature:**
```typescript
watchChildList(listContainer: string): void
```

**Parameters:**
- `listContainer: string` - CSS selector for the container to watch

**Example:**
```typescript
const element = document.querySelector('interact-element') as IInteractElement;

// Start watching for child changes in a specific container
element.watchChildList('.dynamic-list');

// Now any DOM mutations will trigger automatic interaction management
const container = element.querySelector('.dynamic-list');

// Adding items - interactions applied automatically
const newItem = document.createElement('div');
newItem.className = 'list-item';
container.appendChild(newItem); // Automatically gets interactions

// Removing items - cleanup happens automatically  
const itemToRemove = container.querySelector('.item-5');
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

**Manual Usage:**
For advanced cases where you need explicit control:

```typescript
const element = document.querySelector('[data-interact-key="my-list"]') as IInteractElement;

// Manually set up observer
element.watchChildList('.custom-container');

// Later, add items as needed
const container = element.querySelector('.custom-container');
const items = createNewItems();
items.forEach(item => container.appendChild(item));
// All items automatically get interactions
```

## Browser Support

### Modern Browsers
- ✅ Full feature support including CSS custom states
- ✅ ElementInternals API for state management
- ✅ Adopted stylesheets for dynamic CSS

### Legacy Browsers
- ✅ Automatic fallback to data attributes
- ✅ CSS custom property fallbacks
- ✅ Polyfill support for custom elements

### Detection

```typescript
function checkSupport() {
  const element = document.createElement('interact-element') as IInteractElement;
  
  return {
    customElements: !!window.customElements,
    elementInternals: !!element.attachInternals,
    adoptedStyleSheets: !!document.adoptedStyleSheets,
    cssCustomStates: !!element._internals?.states
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
  const element = Interact.getElement(key);
  
  if (!element) {
    console.log(`Element ${key} not found in cache`);
    return;
  }
  
  console.log(`Element ${key}:`, {
    connected: element.connected,
    hasChild: !!element.firstElementChild,
    hasSheet: !!element.sheet,
    hasInternals: !!element._internals,
    states: element._internals ? 
      Array.from(element._internals.states) : 
      element.dataset.interactEffect?.split(' ') || []
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
  
  if (!element.dataset.wixPath) {
    issues.push('Missing data-interact-key attribute');
  }
  
  if (!element.firstElementChild) {
    issues.push('Missing child element');
  }
  
  if (!element.connected) {
    issues.push('Element not connected to interaction system');
  }
  
  return issues;
}
```

## See Also

- [Interact Class](interact-class.md) - Main interaction manager
- [Functions](functions.md) - `add()` and `remove()` functions  
- [Type Definitions](types.md) - `IInteractElement` interface
- [Configuration Guide](../guides/configuration.md) - Setting up interactions
- [Getting Started](../guides/getting-started.md) - Basic usage examples
