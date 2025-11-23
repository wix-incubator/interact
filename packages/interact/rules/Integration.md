# @wix/interact Integration Rules

This document outlines the rules and best practices for generating code that integrates `@wix/interact` into webpages.

## 1. Overview

`@wix/interact` is a library for creating interactive animations and effects triggered by user actions (click, hover, scroll, etc.). It works by binding **Triggers** to **Effects** on specific **Elements**.

## 2. Core Components

### `<interact-element>`
The custom element wrapper is **required** for any element that triggers an interaction or recieves an effect.

**Rules:**
- Must have a `data-interact-key` attribute that is unique within the scope.
- Must contain at least one child element.
- **Usage:**
  ```html
  <interact-element data-interact-key="my-button">
      <button>Click Me</button>
  </interact-element>
  ```

### `Interact.create(config)`
The entry point for initializing interactions.

**Rules:**
- Should be called once with the full configuration, or per page for single-page apps.
- **Usage:**
  ```javascript
  import { Interact } from '@wix/interact';
  Interact.create(config);
  ```

## 3. Configuration Schema

The `InteractConfig` object defines the behavior.

```typescript
type InteractConfig = {
  interactions: Interaction[];          // Required: Array of interaction definitions
  effects?: Record<string, Effect>;     // Optional: Reusable named effects
  conditions?: Record<string, Condition>; // Optional: Reusable conditions (media/container queries)
};
```

### Interaction Definition
```typescript
{
  key: 'element-key',       // Matches data-interact-key
  trigger: 'trigger-type',  // e.g., 'hover', 'click'
  selector?: '.child-cls',  // Optional: Targets specific child inside the interact-element
  listContainer?: '.list',  // Optional: For list items
  params?: { ... },         // Trigger-specific parameters
  conditions?: ['cond-id'], // Array of condition IDs
  effects: [ ... ]          // Array of effects to apply
}
```

### Element Selection Hierarchy
1. **`listContainer`**: If present, selects a container to find list items.
2. **`selector`**: Matches elements within the source/container.
3. **Fallback**: If neither is provided, targets the **first child** of `<interact-element>`.

## 4. Triggers & Behaviors

| Trigger | Description | Key Parameters |
| :--- | :--- | :--- |
| `hover` | Mouse enter/leave | `type`: 'once', 'alternate', 'repeat', 'state' for animations, or `method`: 'add', 'remove', 'toggle', 'clear' for states |
| `click` | Mouse click | `type`: 'once', 'alternate', 'repeat', 'state' for animations, or `method`: 'add', 'remove', 'toggle', 'clear' for states |
| `viewEnter` | Element enters viewport | `type`: 'once', 'alternate', 'repeat', 'state'; `threshold` (0-1) |
| `viewProgress` | Scroll progress inside viewport | (No specific params, uses effect ranges) |
| `pointerMove` | Mouse movement | `hitArea`: 'self' (default) or 'root' |
| `animationEnd` | Chaining animations | `effectId`: ID of the previous effect |

**Best Practice:** When using `viewEnter` make sure the triggering element is un-transformed and un-clipped, especially by the effect.

## 5. Effects & Animations

Effects define *what* happens. They can be inline or referenced by ID.

### Effect Types

#### 1. Named Effects (Pre-built)
Use Motion effect presets for consistency.
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
  rangeStart: { name: 'cover', offset: { value: 0, type: 'percentage' } },
  rangeEnd: { name: 'cover', offset: { value: 100, type: 'percentage' } }
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

## 6. Examples

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
          easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
        }
      ]
    }
  },
  interactions: [{
    key: 'btn',
    trigger: 'hover',
    effects: [{
      effectId: 'scaleUp'
    }]
  }]
};
```

### Viewport Entrance
```typescript
const config = {
  interactions: [{
    key: 'hero',
    trigger: 'viewEnter',
    params: { type: 'once', threshold: 0.2 },
    effects: [{
      namedEffect: { type: 'FadeIn' },
      duration: 800
    }]
  }]
};
```

### Interactive Toggle (Click)
```typescript
const config = {
  interactions: [{
    key: 'menu-btn',
    trigger: 'click',
    params: { type: 'alternate' },
    effects: [{
      key: 'menu-content',
      effectId: 'menu-open', // Creates state 'menu-open'
      keyframeEffect: {
        name: 'slide',
        keyframes: [
          { transform: 'translateX(-100%)' },
          { transform: 'translateX(0)' }
        ]
      },
      duration: 300
    }]
  }]
};
```

