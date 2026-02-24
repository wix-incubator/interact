# @wix/interact Integration Rules

This document outlines the rules and best practices for generating code that integrates `@wix/interact` into a webpage.

## 1. Overview

`@wix/interact` is a library for creating interactive animations and effects triggered by user actions (click, hover, scroll, etc.). It works by binding **Triggers** and **Effects** to specific **Elements**.

## 2. Integrations

### `web` :: using Custom Elements

#### 1. Basic Setup

**Usage:**

```typescript
import { Interact } from '@wix/interact/web';

// Define your interaction configuration
const config = {
  interactions: [
    // ...
  ],
  effects: {
    // ...
  },
};

// Initialize the interact instance
const interact = Interact.create(config);
```

#### 2. HTML Setup

**Rules:**

- MUST have a `data-interact-key` attribute with a value that is unique within the scope.
- MUST contain at least one child element.

**Usage:**

```html
<!-- Wrap your target element with interact-element -->
<interact-element data-interact-key="my-element">
  <div>This will fade in when it enters the viewport!</div>
</interact-element>
```

### `react` :: using React

#### 1. Basic Setup

**Usage:**

```typescript
import { Interact } from '@wix/interact/react';

// Define your interaction configuration
const config = {
  interactions: [
    // ...
  ],
  effects: {
    // ...
  },
};

// Initialize the interact instance
const interact = Interact.create(config);
```

#### 2. HTML Setup

**Rules:**

- MUST replace the element itself with the `<Interaction/>` component.
- MUST set the `tagName` prop with the tag of the replaced element.
- MUST set the `interactKey` prop to a unique string within the scope.

**Usage:**

```tsx
import { Interaction } from '@wix/interact/react';

function MyComponent() {
  return (
    <Interaction tagName="div" interactKey="my-element" className="animated-content">
      Hello, animated world!
    </Interaction>
  );
}
```

## 3. Configuration Schema

The `InteractConfig` object defines the behavior.

```typescript
type InteractConfig = {
  interactions: Interaction[]; // Required: Array of interaction definitions
  effects?: Record<string, Effect>; // Optional: Reusable named effects
  conditions?: Record<string, Condition>; // Optional: Reusable conditions (media queries)
};
```

### Interaction Definition

```typescript
{
  key: 'element-key',       // Matches data-interact-key
  trigger: 'trigger-type',  // e.g., 'hover', 'click'
  selector?: '.child-cls',  // Optional: Targets specific child inside the interact-element
  listContainer?: '.list',  // Optional: A selector for the element containing a list, for interactions on lists
  params?: { ... },         // Trigger-specific parameters
  conditions?: ['cond-id'], // Array of condition IDs
  effects: [ ... ]          // Array of effects to apply
}
```

### Element Selection Hierarchy

1. **`listContainer` + `selector`**: If both are present, uses `querySelectorAll(selector)` within the container to find all matching elements as list items.
2. **`listContainer` only**: If present without `selector`, targets the immediate children of the container as list items.
3. **`selector` only**: If present without `listContainer`, matches all elements within the root element (using `querySelectorAll`).
4. **Fallback**: If neither is provided, targets the **first child** of `<interact-element>` in `web` or the root element in `react`.

## 4. Generating Critical CSS for Entrance Animations

### `generate(config)`

Generates critical CSS styles that prevent flash-of-unstyled-content (FOUC) for elements with `viewEnter` entrance animations.

**Rules:**

- MUST be called server-side or at build time to generate static CSS.
- MUST set `data-interact-initial="true"` on elements that have an entrance effect.

**Usage:**

```javascript
import { generate } from '@wix/interact/web';

const config = {
  /*...*/
};

// Generate CSS at build time or on server
const css = generate(config);

// Include in your HTML template
const html = `
<!DOCTYPE html>
<html>
<head>
    <style>${css}</style>
</head>
<body>
    <interact-element data-interact-key="hero" data-interact-initial="true">
        <section class="hero">
            ...
        </section>
    </interact-element>
    <script type="module" src="./main.js"></script>
</body>
</html>
`;
```

**When to Use:**

- For elements with an entrance effect that is triggered with `viewEnter`
- To prevent elements from being visible before their entrance animation plays
- For server-side rendering (SSR) or static site generation (SSG) scenarios

## 5. Triggers & Behaviors

| Trigger        | Description                                     | Key Parameters                                                                                                            | Rules File          |
| :------------- | :---------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------ | :------------------ |
| `hover`        | Mouse enter/leave                               | `type`: 'once', 'alternate', 'repeat', 'state' for animations, or `method`: 'add', 'remove', 'toggle', 'clear' for states | `./hover.md`        |
| `click`        | Mouse click                                     | `type`: 'once', 'alternate', 'repeat', 'state' for animations, or `method`: 'add', 'remove', 'toggle', 'clear' for states | `./click.md`        |
| `activate`     | Accessible click (click + keyboard Space/Enter) | Same as `click` with keyboard support                                                                                     | `./click.md`        |
| `interest`     | Accessible hover (hover + focus)                | Same as `hover` with focus support                                                                                        | `./hover.md`        |
| `viewEnter`    | Element enters viewport                         | `type`: 'once', 'alternate', 'repeat', 'state'; `threshold` (0-1)                                                         | `./viewenter.md`    |
| `viewProgress` | Scroll-driven using ViewTimeline                | (No specific params, uses effect ranges)                                                                                  | `./viewprogress.md` |
| `pointerMove`  | Mouse movement                                  | `hitArea`: 'self' (default) or 'root'; `axis`: 'x' or 'y' for keyframeEffect                                              | `./pointermove.md`  |
| `animationEnd` | Chaining animations                             | `effectId`: ID of the previous effect                                                                                     | --                  |

## 6. Effects & Animations

Effects define _what_ happens. They can be inline or referenced by ID.

### Effect Types

#### 1. Named Effects (Pre-built effect library)>

Use the @wix/motion-presets library for consistency.

**Install:**

```bash
> npm install @wix/motion-presets
```

**Import and register:**

```typescript
import { Interact } from '@wix/interact/web';
import * as presets from '@wix/motion-presets';

Interact.registerEffects(presets);
```

**Or register only required presets:**

```typescript
import { Interact } from '@wix/interact/web';
import { FadeIn, ParallaxScroll } from '@wix/motion-presets';

Interact.registerEffects({ FadeIn, ParallaxScroll });
```

```typescript
{
  namedEffect: { type: 'FadeIn' },
  duration: 800,
  easing: 'ease-out'
}
```

#### 2. Keyframe Effects (Custom)

Define explicit Web Animations API-like keyframes.

```typescript
{
  keyframeEffect: {
    name: 'custom-slide',
    keyframes: [
      { transform: 'translateY(20px)', opacity: 0 },
      { transform: 'translateY(0)', opacity: 1 }
    ]
  },
  duration: 500
}
```

#### 3. Transition Effects

Smoothly transition CSS properties.

```typescript
{
  transition: {
    duration: 300,
    styleProperties: [{ name: 'backgroundColor', value: 'red' }]
  }
}
```

#### 4. Scroll Effects

Used with `viewProgress`, linked to scroll progress while element is inside viewport.

```typescript
{
  keyframeEffect: { ... },
  rangeStart: { name: 'cover', offset: { value: 0, unit: 'percentage' } },
  rangeEnd: { name: 'cover', offset: { value: 100, unit: 'percentage' } },
  fill: 'both'
}
```

#### 5. Mouse Effects

Used with `pointerMove`, linked to mouse progress while moving over an element.

```typescript
{
  namedEffect: { type: 'Track3DMouse' },
  centeredToTarget: true
}
```

### Targeting

- **Self**: Omit `key` in the effect to target the trigger element. If using `selector` for trigger, also specify it again for the effect target.
- **Cross-Targeting**: Specify a different `key` and/or `selector` in the effect to animate a different element.

## 7. Examples

### Basic Hover (Scale)

```typescript
const config = {
  effects: {
    scaleUp: {
      transitionProperties: [
        {
          name: 'transform',
          value: 'scale(1.1)',
          duration: 300,
          delay: 100,
          easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        },
      ],
    },
  },
  interactions: [
    {
      key: 'btn',
      trigger: 'hover',
      effects: [
        {
          effectId: 'scaleUp',
        },
      ],
    },
  ],
};
```

### Viewport Entrance

```typescript
const config = {
  interactions: [
    {
      key: 'hero',
      trigger: 'viewEnter',
      params: { type: 'once', threshold: 0.2 },
      effects: [
        {
          namedEffect: { type: 'FadeIn' },
          duration: 800,
        },
      ],
    },
  ],
};
```

### Interactive Toggle (Click)

```typescript
const config = {
  interactions: [
    {
      key: 'menu-btn',
      trigger: 'click',
      params: { type: 'alternate' },
      effects: [
        {
          key: 'menu-content',
          effectId: 'menu-open', // Creates state 'menu-open'
          keyframeEffect: {
            name: 'slide',
            keyframes: [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }],
          },
          duration: 300,
        },
      ],
    },
  ],
};
```
