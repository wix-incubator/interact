# Type Definitions

Complete TypeScript interface and type definitions for `@wix/interact`. These types ensure type safety when configuring interactions and working with the API.

## Import

```typescript
import type {
  InteractConfig,
  Interaction,
  Effect,
  TriggerType,
  // ... other types
} from '@wix/interact';
```

## Configuration Types

### `InteractConfig`

The main configuration object for defining interactions, effects, and conditions.

```typescript
type InteractConfig = {
  effects: Record<string, Effect>;
  conditions?: Record<string, Condition>;
  interactions: Interaction[];
};
```

**Properties:**
- `interactions` - Array of interaction definitions (required)
- `effects` - Map of reusable effect definitions by ID (required)
- `conditions` - Map of conditional logic definitions by ID (optional)

**Example:**
```typescript
const config: InteractConfig = {
  interactions: [
    {
      trigger: 'viewEnter',
      key: 'hero',
      effects: [{ effectId: 'fade-in' }]
    },
    {
      trigger: 'hover',
      key: 'button',
      conditions: ['desktop-only'],
      effects: [{ effectId: 'lift' }]
    }
  ],
  effects: {
    'fade-in': {
      duration: 1000,
      keyframeEffect: {
        name: 'fade-in',
        keyframes: [
          { opacity: 0, transform: 'translateY(20px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ]
      }
    },
    'lift': {
      duration: 200,
      keyframeEffect: {
        name: 'lift',
        keyframes: [
          { transform: 'translateY(0)' },
          { transform: 'translateY(-4px)' }
        ]
      }
    }
  },
  conditions: {
    'desktop-only': {
      type: 'media',
      predicate: '(min-width: 1024px)'
    }
  }
};
```

### `Interaction`

Defines a single interaction binding a trigger to effects.

```typescript
type Interaction = {
  key: string;
  trigger: TriggerType;
  selector?: string;
  listContainer?: string;
  params?: TriggerParams;
  conditions?: string[];
  effects: ((Effect | EffectRef) & { interactionId?: string })[];
};
```

**Properties:**
- `key` - Unique identifier for the custom element that triggers the interaction
- `trigger` - Type of trigger event
- `selector` - Optional CSS selector to target an element within the custom element or within each list item if combined with `listContainer`
- `listContainer` - Optional selector for list container when targeting list items
- `params` - Optional parameters for the trigger
- `conditions` - Optional array of condition IDs to evaluate
- `effects` - Array of effects to apply when triggered

**Example:**
```typescript
const interaction: Interaction = {
  trigger: 'viewEnter',
  key: 'hero',
  params: {
    type: 'once',
    threshold: 0.2,
    inset: '50px'
  },
  conditions: ['reduced-motion-off'],
  effects: [
    { effectId: 'entrance-animation' },
    { 
      key: 'hero-text',
      effectId: 'text-reveal',
      conditions: ['desktop-only']
    }
  ]
};
```

## Trigger Types

### `TriggerType`

Union type of all supported trigger types.

```typescript
type TriggerType =
  | 'hover'
  | 'click'
  | 'viewEnter'
  | 'pageVisible'
  | 'animationEnd'
  | 'viewProgress'
  | 'pointerMove';
```

### Trigger Parameters

#### `ViewEnterParams`
Parameters for viewport entry triggers (`viewEnter`, `pageVisible`, `viewProgress`).

```typescript
type ViewEnterParams = {
  type?: ViewEnterType;
  threshold?: number;
  inset?: string;
};

type ViewEnterType = 'once' | 'repeat' | 'alternate';
```

**Properties:**
- `type` - How the trigger behaves on repeated intersections
  - `'once'` - Trigger only the first time (default)
  - `'repeat'` - Trigger every time element enters viewport
  - `'alternate'` - Alternate between enter/exit effects
- `threshold` - Percentage of element that must be visible (0-1)
- `inset` - CSS-style inset to shrink the root intersection area

**Examples:**
```typescript
// Trigger once when 50% visible
const onceParams: ViewEnterParams = {
  type: 'once',
  threshold: 0.5
};

// Trigger repeatedly with margin
const repeatParams: ViewEnterParams = {
  type: 'repeat',
  threshold: 0.1,
  inset: '100px'
};

// Alternate effects on enter/exit
const alternateParams: ViewEnterParams = {
  type: 'alternate',
  threshold: 0.3
};
```

#### `StateParams`
Parameters for state-based triggers (`hover`, `click`).

```typescript
type StateParams = {
  method: TransitionMethod;
};

type TransitionMethod = 'add' | 'remove' | 'toggle' | 'clear';
```

**Properties:**
- `method` - How to modify the element's state
  - `'add'` - Add the effect state
  - `'remove'` - Remove the effect state
  - `'toggle'` - Toggle the effect state
  - `'clear'` - Clear all effect states

**Examples:**
```typescript
// Toggle effect on click
const toggleClick: StateParams = {
  method: 'toggle'
};

// Add effect on hover enter, remove on hover exit
const hoverState: StateParams = {
  method: 'add' // hover exit automatically uses 'remove'
};
```

#### `PointerMoveParams`
Parameters for pointer/mouse movement triggers.

```typescript
type PointerMoveParams = {
  hitArea?: 'root' | 'self';
};
```

**Properties:**
- `hitArea` - Defines the area that responds to pointer movement
  - `'self'` - Only the source element (default)
  - `'root'` - The entire viewport/root container

**Example:**
```typescript
const pointerParams: PointerMoveParams = {
  hitArea: 'root' // Track mouse across entire page
};
```

#### `AnimationEndParams`
Parameters for animation completion triggers.

```typescript
type AnimationEndParams = {
  effectId: string;
};
```

**Properties:**
- `effectId` - ID of the effect whose completion triggers this interaction

**Example:**
```typescript
const chainedAnimation: AnimationEndParams = {
  effectId: 'entrance-animation' // Trigger when entrance completes
};
```

## Effect Types

### `Effect`

Union type of all effect types.

```typescript
type Effect = (TimeEffect | ScrubEffect | TransitionEffect) & {
  conditions?: string[];
};
```

### `TimeEffect`

Duration-based animations with easing and timing control.

```typescript
type TimeEffect = {
  key?: string;
  selector?: string;
  listContainer?: string;
  duration: number;
  easing?: string;
  iterations?: number;
  alternate?: boolean;
  fill?: Fill;
  reversed?: boolean;
  delay?: number;
  effectId?: string;
} & EffectProperty;

type Fill = 'none' | 'forwards' | 'backwards' | 'both';
```

**Properties:**
- `key` - unique identifier for targeting a custom element (optional, defaults to source key from the `Interaction`)
- `selector` - CSS selector for targeting an element inside the custom element or each list item if combined with `listContainer` (optional, defaults to `firstElementChild`)
- `listContainer` - CSS selector for list container when targeting list items (optional)
- `duration` - Animation duration in milliseconds (required)
- `easing` - Easing function name or custom cubic-bezier
- `iterations` - Number of times to repeat (default: 1)
- `alternate` - Whether to alternate direction on iterations
- `fill` - How to apply styles before/after animation
- `reversed` - Whether to play animation in reverse
- `delay` - Delay before animation starts in milliseconds

**Examples:**
```typescript
// Basic fade animation
const fadeEffect: TimeEffect = {
  duration: 800,
  easing: 'ease-out',
  keyframeEffect: {
    name: 'fade',
    keyframes: [
      { opacity: 0 },
      { opacity: 1 }
    ]
  }
};

// Complex bounce with iterations
const bounceEffect: TimeEffect = {
  duration: 600,
  iterations: 3,
  alternate: true,
  easing: 'ease-in-out',
  fill: 'forwards',
  keyframeEffect: {
    name: 'bounce',
    keyframes: [
      { transform: 'translateY(0)' },
      { transform: 'translateY(-20px)' },
      { transform: 'translateY(0)' }
    ]
  }
};

// Delayed entrance
const delayedEffect: TimeEffect = {
  duration: 1000,
  delay: 500,
  easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  namedEffect: {
      type: 'slideInLeft'
  }
};
```

### `ScrubEffect`

Scroll-driven animations tied to scroll progress.

```typescript
type ScrubEffect = {
  key?: string;
  selector?: string;
  listContainer?: string;
  easing?: string;
  iterations?: number;
  alternate?: boolean;
  fill?: Fill;
  reversed?: boolean;
  rangeStart?: RangeOffset;
  rangeEnd?: RangeOffset;
  centeredToTarget?: boolean;
  transitionDuration?: number;
  transitionDelay?: number;
  transitionEasing?: ScrubTransitionEasing;
} & EffectProperty;
```

**Scroll-specific Properties:**
- `rangeStart` - Scroll position where animation starts
- `rangeEnd` - Scroll position where animation ends
- `centeredToTarget` - Whether to center scroll range on target element
- `transitionDuration` - Smooth transition duration when entering/exiting scrub
- `transitionDelay` - Delay for scrub transition
- `transitionEasing` - Easing for scrub transition

**Examples:**
```typescript
// Parallax background
const parallaxEffect: ScrubEffect = {
  easing: 'linear',
  rangeStart: { name: 'contain', offset: { value: 0, type: 'percentage' } },
  rangeEnd: { name: 'contain', offset: { value: 100, type: 'percentage' } },
  keyframeEffect: {
    name: 'parallax',
    keyframes: [
      { transform: 'translateY(0)' },
      { transform: 'translateY(-50px)' }
    ]
  }
};

// Progress-based fade
const progressFade: ScrubEffect = {
  centeredToTarget: true,
  transitionDuration: 300,
  keyframeEffect: {
    name: 'progress-fade',
    keyframes: [
      { opacity: 0 },
      { opacity: 1 },
      { opacity: 0 }
    ]
  }
};
```

### `TransitionEffect`

CSS transition-based effects for style property changes.

```typescript
type TransitionEffect = {
  key?: string;
  effectId?: string;
  transition?: TransitionOptions & {
    styleProperties: StyleProperty[];
  };
  transitionProperties?: TransitionProperty[];
};

type TransitionOptions = {
  duration?: number;
  delay?: number;
  easing?: string;
};

type StyleProperty = {
  name: string;
  value: string;
};

type TransitionProperty = StyleProperty & TransitionOptions;
```

**Examples:**
```typescript
// Simple color transition
const colorTransition: TransitionEffect = {
  transition: {
    duration: 300,
    easing: 'ease-out',
    styleProperties: [
      { name: 'background-color', value: '#3b82f6' },
      { name: 'color', value: 'white' }
    ]
  }
};

// Individual property transitions
const complexTransition: TransitionEffect = {
  transitionProperties: [
    {
      name: 'transform',
      value: 'scale(1.05)',
      duration: 200,
      easing: 'ease-out'
    },
    {
      name: 'box-shadow',
      value: '0 10px 20px rgba(0,0,0,0.1)',
      duration: 300,
      delay: 50
    }
  ]
};
```

### `EffectRef`

Reference to a reusable effect definition.

```typescript
type EffectRef = {
  key?: string;
  selector?: string;
  listContainer?: string;
  effectId: string;
  conditions?: string[];
};
```

**Properties:**
- `key`, `selector`, `listContainer` - Same as in `Effect` for targeting elements
- `effectId` - ID of the effect in the `effects` configuration object
- `conditions` - Additional conditions for this effect usage

**Example:**
```typescript
// Reference a reusable effect
const effectRef: EffectRef = {
  effectId: 'slide-up',
  key: 'custom-target',
  conditions: ['desktop-only']
};

// Used in interaction
const interaction: Interaction = {
  trigger: 'viewEnter',
  key: 'trigger',
  effects: [
    effectRef, // Reference existing effect
    {
      // Inline effect
      duration: 500,
      keyframeEffect: {
        name: 'fade',
        keyframes: [
          { opacity: 0 },
          { opacity: 1 }
        ]
      }
    }
  ]
};
```

## Effect Properties

### `EffectProperty`

Union type for defining animation content.

```typescript
type EffectProperty = 
  | { keyframeEffect: MotionKeyframeEffect }
  | { namedEffect: NamedEffect }
  | { customEffect: CustomEffect };
```

**Types:**
- `keyframeEffect` - Raw keyframe animation definition
- `namedEffect` - Pre-built animation from `@wix/motion`
- `customEffect` - Custom animation function

**Examples:**
```typescript
// Keyframe effect
const keyframeEffect = {
  name: 'bounce-in',
  keyframes: [
    { transform: 'translateX(-100%)', opacity: 0 },
    { transform: 'translateX(0)' },
    { transform: 'translateX(10px)' },
    { transform: 'translateX(0)', opacity: 1 },
  ]
};

// Named effect
const namedEffect = {
  namedEffect: {
      type: 'SlideIn'
  } // Pre-built animation
};

// Custom effect  
const customEffect = {
  customEffect: (element: HTMLElement) => {
    // Custom animation logic
    return element.animate([
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(360deg)' }
    ], { duration: 1000 });
  }
};
```

## Condition Types

### `Condition`

Defines conditional logic for interactions.

```typescript
type Condition = {
  type: 'media' | 'container';
  predicate?: string;
};
```

**Properties:**
- `type` - Type of condition check
  - `'media'` - Media query condition
  - `'container'` - Container query condition
- `predicate` - The query string to evaluate

**Examples:**
```typescript
// Media query conditions
const mobileOnly: Condition = {
  type: 'media',
  predicate: '(max-width: 767px)'
};

const darkMode: Condition = {
  type: 'media',
  predicate: '(prefers-color-scheme: dark)'
};

const reducedMotion: Condition = {
  type: 'media',
  predicate: '(prefers-reduced-motion: reduce)'
};

// Container query condition
const wideContainer: Condition = {
  type: 'container',
  predicate: '(min-width: 400px)'
};
```

## Custom Element Types

### `IInteractElement`

Interface for the custom `interact-element`.

```typescript
interface IInteractElement extends HTMLElement {
  _internals: (ElementInternals & { states: Set<string> }) | null;
  connected: boolean;
  sheet: CSSStyleSheet | null;
  
  connectedCallback(): void;
  disconnectedCallback(): void;
  connect(path?: string): void;
  renderStyle(cssText: string): void;
  toggleEffect(effectId: string, method: StateParams['method']): void;
  watchChildList(listContainer: string): void;
}
```

**Properties:**
- `_internals` - Element internals for custom state management
- `connected` - Whether the element has active interactions
- `sheet` - CSS stylesheet for dynamic styles

**Methods:**
- `connect()` - Manually connect interactions
- `renderStyle()` - Inject dynamic CSS
- `toggleEffect()` - Programmatically control effect states
- `watchChildList()` - Set up mutation observer for dynamic list tracking

## Cache and Internal Types

### `InteractCache`

Internal cache structure for parsed configuration.

```typescript
type InteractCache = {
  effects: { [effectId: string]: Effect };
  conditions: { [conditionId: string]: Condition };
  interactions: {
    [key: string]: {
      triggers: Interaction[];
      effects: Record<string, (InteractionTrigger & { effect: Effect | EffectRef })[]>;
      interactionIds: Set<string>;
    };
  };
};
```

### `TriggerParams`

Union type of all trigger parameter types.

```typescript
type TriggerParams =
  | StateParams
  | PointerTriggerParams
  | ViewEnterParams
  | PointerMoveParams
  | AnimationEndParams;
```

### `InteractionParamsTypes`

Map of trigger types to their parameter types.

```typescript
type InteractionParamsTypes = {
  hover: StateParams | PointerTriggerParams;
  click: StateParams | PointerTriggerParams;
  viewEnter: ViewEnterParams;
  pageVisible: ViewEnterParams;
  animationEnd: AnimationEndParams;
  viewProgress: ViewEnterParams;
  pointerMove: PointerMoveParams;
};
```

## Utility Types

### `CreateTransitionCSSParams`

Parameters for creating transition CSS.

```typescript
type CreateTransitionCSSParams = {
  key: string;
  effectId: string;
  transition?: TransitionEffect['transition'];
  properties?: TransitionProperty[];
  childSelector?: string;
};
```

### `HandlerObject`

Internal type for event handler management.

```typescript
type HandlerObject = {
  source: HTMLElement;
  target: HTMLElement;
  cleanup: () => void;
  handler?: () => void;
};
```

### Configuration Builders

```typescript
// Type-safe configuration builder
class InteractConfigBuilder {
  private config: Partial<InteractConfig> = { interactions: [], effects: {} };
  
  addInteraction(interaction: Interaction): this {
    this.config.interactions!.push(interaction);
    return this;
  }
  
  addEffect(id: string, effect: Effect): this {
    this.config.effects![id] = effect;
    return this;
  }
  
  addCondition(id: string, condition: Condition): this {
    if (!this.config.conditions) this.config.conditions = {};
    this.config.conditions[id] = condition;
    return this;
  }
  
  build(): InteractConfig {
    return this.config as InteractConfig;
  }
}

// Usage
const config = new InteractConfigBuilder()
  .addEffect('fade', {
    duration: 1000,
    keyframeEffect: {
      name: 'fade',
      keyframes: [
        { opacity: 0 },
        { opacity: 1 }
      ]
    }
  })
  .addInteraction({
    trigger: 'viewEnter',
    key: 'hero',
    effects: [{ effectId: 'fade' }]
  })
  .build();
```

## See Also

- [Interact Class](interact-class.md) - Main API class
- [Functions](functions.md) - Standalone functions
- [Custom Element](interact-element.md) - Custom element API
- [Configuration Guide](../guides/configuration.md) - Building configurations
- [Examples](../examples/README.md) - Practical usage examples
