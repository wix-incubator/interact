# @wix/interact

A powerful, declarative interaction library for creating engaging web animations and effects. Built on top of `@wix/motion`, it provides a configuration-driven approach to adding triggers, animations, and state transitions to web applications.

## Features

- 🎯 **Declarative Configuration** - Define complex interactions through simple JSON configuration
- 🎨 **Rich Animation Support** - Integration with `@wix/motion` for high-performance animations  
- 🖱️ **Multiple Trigger Types** - Support for hover, click, scroll, viewport, and custom triggers
- 📱 **Responsive Conditions** - Media query and container-based conditional interactions
- 🔧 **Custom Elements** - Web Components API for easy framework integration
- ⚡ **Performance Optimized** - Efficient event handling and animation management
- 🧩 **Framework Agnostic** - Works with React, vanilla JS, and other frameworks

## Installation

```bash
npm install @wix/interact
```

## Quick Start

### 1. Basic Setup

```typescript
import { Interact } from '@wix/interact';

// Define your interaction configuration
const config = {
  interactions: [
    {
      trigger: 'viewEnter',
      key: '#my-element',
      effects: [
        {
          effectId: 'fade-in',
        }
      ]
    }
  ],
  effects: {
    'fade-in': {
      duration: 1000,
      keyframeEffect: {
        name: 'fade',
        keyframes: {opacity: [0, 1]}
      }
    }
  }
};

// Initialize the interact instance
const interact = Interact.create(config);
```

### 2. HTML Setup

```html
<!-- Wrap your target element with interact-element -->
<interact-element data-interact-key="my-element">
  <div>This will fade in when it enters the viewport!</div>
</interact-element>
```

### 3. Framework Integration

#### React
```tsx
import React from 'react';

function MyComponent() {
  return (
    <interact-element data-interact-key="my-element">
      <div className="animated-content">
        Hello, animated world!
      </div>
    </interact-element>
  );
}
```

## Core Concepts

### Triggers
Define when interactions should occur:
- `viewEnter` - When element enters viewport
- `click` - On element click
- `hover` - On element hover
- `viewProgress` - Based on scroll progress
- `pointerMove` - On pointer/mouse movement
- `pageVisible` - When page becomes visible
- `animationEnd` - When another animation completes

### Effects
Define what should happen:
- **Time-based animations** - Duration-based effects with easing
- **Scroll-driven animations** - Progress-based effects tied to scroll
- **Pointer-driven animations** - Progress-based effects linked to pointer position
- **CSS transitions** - Style property transitions
- **Custom effects** - Integration with `@wix/motion`

### Configuration Structure
```typescript
{
  interactions: [    // Define trigger → effect relationships
    {
      trigger: 'viewEnter',
      key: 'source-element',
      effects: [{ effectId: 'my-effect' }]
    }
  ],
  effects: {         // Define reusable effect definitions
    'my-effect': {
      duration: 1000,
      keyframeEffect: {
        name: 'fade',
        keyframes: { opacity: [0, 1] }
      }
    }
  },
  conditions: {      // Define conditional logic
    'mobile-only': {
      type: 'media',
      predicate: '(max-width: 768px)'
    }
  }
}
```

## API Reference

### Interact Class

#### Static Methods
```typescript
// Create a new instance with configuration
Interact.create(config: InteractConfig): Interact

// Get instance that handles a specific key
Interact.getInstance(key: string): Interact | undefined

// Get cached element by key
Interact.getElement(key: string): IInteractElement | undefined
```

### Standalone Functions
```typescript
// Add interactions to an element
add(element: IInteractElement, key: string): boolean

// Remove all interactions from an element
remove(key: string): void
```

## Examples

### Entrance Animation
```typescript
{
  interactions: [{
    trigger: 'viewEnter',
    key: 'hero',
    effects: [{ effectId: 'slide-up' }]
  }],
  effects: {
    'slide-up': {
      duration: 800,
      easing: 'ease-out',
      keyframeEffect: {
        name: 'slide-up',
        keyframes: {
          transform: ['translateY(20px)', 'translateY(0)'],
          opacity: [0, 1]
        }
      }
    }
  }
}
```

### Click Interaction
```typescript
{
  interactions: [{
    trigger: 'click',
    key: 'button',
    effects: [{ effectId: 'bounce' }]
  }],
  effects: {
    'bounce': {
      duration: 600,
      namedEffect: {
        type: 'Bounce'
      }
    }
  }
}
```

### Responsive Interactions
```typescript
{
  interactions: [{
    trigger: 'hover',
    key: 'card',
    conditions: ['desktop-only'],
    effects: [{ effectId: 'lift' }]
  }],
  conditions: {
    'desktop-only': {
      type: 'media',
      predicate: '(min-width: 1024px)'
    }
  },
  effects: {
    'lift': {
      duration: 200,
      keyframeEffect: {
        name: 'lift',
        keyframes: {
          transform: ['translateY(0)', 'translateY(-8px)'],
          boxShadow: ['0 2px 4px rgb(0 0 0 / 0.1)', '0 8px 16px rgb(0 0 0 / 0.15)']
        }
      }
    }
  }
}
```

## Documentation

- [Full API Documentation](https://wix-incubator.github.io/interact-ai/docs/api)
- [Guides and Tutorials](https://wix-incubator.github.io/interact-ai/docs/guides)
- [Examples and Patterns](https://wix-incubator.github.io/interact-ai/docs/examples)
- [Integration Guides](https://wix-incubator.github.io/interact-ai/docs/integration)

## AI Support

- [Rules for Interaction Generation](https://wix-incubator.github.io/interact-ai/rules)

## Development

```bash
# Install dependencies
yarn install

# Run tests
yarn test

# Run playground
yarn playground

# Build package
yarn build
```

## Browser Support

- ✅ Modern browsers with Web Components support
- ⚠️ If using setting styles via JS in `transition` or `transitionProerties` - which use `adoptedStyleSheets`, browser support is: Chrome 73+, Firefox 101+, Safari 16.4+, Edge 79+

## Related Packages

- [`@wix/motion`](../motion/README.md) - Core animation engine
- [`fizban`](https://github.com/wix-incubator/fizban) - For polyfilling scroll-driven animations
- [`kuliso`](https://github.com/wix-incubator/kuliso) - For polyfilling pointer-driven animations

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this package.

## License

UNLICENSED - Internal Wix package
