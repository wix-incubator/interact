# @wix/interact Documentation

Welcome to the complete documentation for the `@wix/interact` package - a powerful, declarative interaction library for creating engaging web animations and effects.

## Package Entry Points

| Entry Point           | Use Case           | Key Exports                             |
| --------------------- | ------------------ | --------------------------------------- |
| `@wix/interact/web`   | Web Components     | `Interact`, `generate`                  |
| `@wix/interact/react` | React applications | `Interact`, `generate`, `Interaction`   |
| `@wix/interact`       | Vanilla JS         | `Interact`, `add`, `remove`, `generate` |

## Table of Contents

### **API Reference**

Complete reference documentation for all classes, methods, and types.

- [**Core API**](api/README.md) - Main classes and functions
  - [Interact Class](api/interact-class.md) - Main interaction manager
  - [InteractionController](api/interaction-controller.md) - Controller class for element interactions
  - [Standalone Functions](api/functions.md) - `add()`, `remove()`, `generate()`, `addListItems()`, `removeListItems()`
  - [Custom Element](api/interact-element.md) - `<interact-element>` API
  - [Element Selection](api/element-selection.md) - Selection priority and patterns
- [**Type Definitions**](api/types.md) - Complete TypeScript interfaces
  - [Configuration Types](api/types.md#configuration-types) - `InteractConfig`, `Interaction`, `Effect`
  - [Controller Types](api/types.md#controller-and-element-types) - `IInteractionController`, `IInteractElement`
  - [Trigger Types](api/types.md#trigger-types) - All trigger parameters and types
  - [Effect Types](api/types.md#effect-types) - Time, scrub, and transition effects
  - [React Types](api/types.md#react-types) - `InteractRef` and React-specific types

### **Guides & Tutorials**

Learn the concepts and patterns for building effective interactions.

- [**Getting Started**](guides/getting-started.md) - Your first interaction in 5 minutes
- [**Core Concepts**](guides/README.md) - Understanding the interaction system
  - [Understanding Triggers](guides/understanding-triggers.md) - When interactions happen
  - [Working with Effects](guides/effects-and-animations.md) - What happens during interactions
  - [Configuration Structure](guides/configuration-structure.md) - Organizing complex interactions
  - [Custom Elements](guides/custom-elements.md) - How `interact-element` works
  - [Lists and Dynamic Content](guides/lists-and-dynamic-content.md) - Working with repeating elements
  - [State Management](guides/state-management.md) - CSS states vs data attributes
  - [Conditions & Media Queries](guides/conditions-and-media-queries.md) - Responsive interactions
- [**Performance**](guides/performance.md) - Optimization tips and best practices

### **Examples & Patterns**

Practical examples and common interaction patterns.

- [**Basic Examples**](examples/README.md) - Simple, copy-paste examples
  - [Entrance Animations](examples/entrance-animations.md) - Viewport-triggered effects
  - [Click Interactions](examples/click-interactions.md) - User-triggered actions
  - [Hover Effects](examples/hover-effects.md) - Mouse interaction patterns
  - [Scroll Animations](examples/scroll-animations.md) - Progress-based effects
  - [List Patterns](examples/list-patterns.md) - 20+ list and grid animation patterns
- [**Advanced Patterns**](examples/advanced-patterns.md) - Complex interaction sequences
- [**Real-world Examples**](examples/real-world.md) - Production-ready implementations

### **Integration Guides**

Framework-specific integration and migration guides.

- [**Framework Integration**](integration/README.md) - Using with different frameworks
  - [React Integration](integration/react.md) - `Interaction` component, `createInteractRef`, hooks
  - [Vanilla JavaScript](integration/vanilla-js.md) - Direct DOM usage
  - [Other Frameworks](integration/other-frameworks.md) - Vue, Angular, Svelte, etc.
- [**Migration Guides**](integration/migration.md) - Coming from other libraries
- [**Testing**](integration/testing.md) - Testing interaction behaviors
- [**Debugging**](integration/debugging.md) - Development tools and techniques

### **Advanced Topics**

Deep-dive technical documentation for power users.

- [**Architecture**](advanced/architecture.md) - System design and decisions
- [**Custom Triggers**](advanced/custom-triggers.md) - Building your own triggers
- [**Browser Compatibility**](advanced/browser-support.md) - Polyfills and fallbacks
- [**Performance Deep Dive**](advanced/performance-optimization.md) - Advanced optimization
- [**Contributing**](advanced/contributing.md) - Development and contribution guide

## Quick Navigation

### I want to...

**Get started quickly**
→ [Getting Started Guide](guides/getting-started.md)

**Use with React**
→ [React Integration](integration/react.md)

**Understand the concepts**
→ [Core Concepts](guides/README.md)

**See code examples**
→ [Examples & Patterns](examples/README.md)

**Look up API details**
→ [API Reference](api/README.md)

**Integrate with my framework**
→ [Integration Guides](integration/README.md)

**Debug an issue**
→ [Debugging Guide](integration/debugging.md)

**Optimize performance**
→ [Performance Guide](guides/performance.md)

**Extend functionality**
→ [Advanced Topics](advanced/README.md)

## Quick Start

### React

```tsx
import { useEffect } from 'react';
import { Interact, Interaction } from '@wix/interact/react';

const config = {
  interactions: [
    {
      key: 'card',
      trigger: 'hover',
      effects: [
        {
          keyframeEffect: {
            name: 'lift',
            keyframes: [{ transform: 'translateY(-4px)' }],
          },
          duration: 200,
        },
      ],
    },
  ],
  effects: {},
};

function App() {
  useEffect(() => {
    const instance = Interact.create(config);
    return () => instance.destroy();
  }, []);

  return (
    <Interaction tagName="div" interactKey="card" className="card">
      <h2>Hover me!</h2>
    </Interaction>
  );
}
```

### Web Components

```html
<interact-element data-interact-key="card">
  <div class="card">
    <h2>Hover me!</h2>
  </div>
</interact-element>
```

```javascript
import { Interact } from '@wix/interact/web';

Interact.create({
  interactions: [
    {
      key: 'card',
      trigger: 'hover',
      effects: [
        {
          keyframeEffect: {
            name: 'lift',
            keyframes: [{ transform: 'translateY(-4px)' }],
          },
          duration: 200,
        },
      ],
    },
  ],
});
```

### Vanilla JS

```html
<div class="card" data-interact-key="nice-card">
  <h2>Hover me!</h2>
</div>
```

```javascript
import { Interact, add } from '@wix/interact';

const niceCard = document.querySelector('[data-interact-key="nice-card"]');

add(niceCard);

Interact.create({
  interactions: [
    {
      key: 'nice-card',
      trigger: 'hover',
      effects: [
        {
          keyframeEffect: {
            name: 'lift',
            keyframes: [{ transform: 'translateY(-4px)' }],
          },
          duration: 200,
        },
      ],
    },
  ],
});
```

## Version Information

This documentation is for `@wix/interact` v2.0.0. For earlier versions or migration information, see the [Migration Guide](integration/migration.md).

## Feedback

Found an issue with the documentation? Please [open an issue](https://github.com/wix-incubator/interact/issues) or contribute improvements via pull request.
