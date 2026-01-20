# Interact Class

The `Interact` class is the main entry point for managing interactions in your application. It provides both static methods for global operations and instance methods for managing specific interaction configurations.

## Import

```typescript
// Web entry point (with defineInteractElement)
import { Interact } from '@wix/interact/web';

// React entry point
import { Interact } from '@wix/interact/react';

// Base entry point (no framework-specific features)
import { Interact } from '@wix/interact';
```

## Class Overview

```typescript
class Interact {
  // Static properties
  static instances: Interact[]
  static controllerCache: Map<string, IInteractionController>
  static forceReducedMotion: boolean
  static defineInteractElement?: () => boolean  // Only on web entry

  // Instance properties
  dataCache: InteractCache
  addedInteractions: { [interactionId: string]: boolean }
  controllers: Set<IInteractionController>

  // Static methods
  static create(config: InteractConfig): Interact
  static getInstance(key: string): Interact | undefined
  static getController(key: string): IInteractionController | undefined
  static setController(key: string, controller: IInteractionController): void
  static deleteController(key: string): void
  static destroy(): void
  static setup(options: { forceReducedMotion?: boolean, ... }): void
  static registerEffects(effects: Record<string, NamedEffect>): void

  // Instance methods
  constructor()
  init(config: InteractConfig): void
  destroy(): void
  has(key: string): boolean
  get(key: string): CachedInteractionData | undefined
  setController(key: string, controller: IInteractionController): void
  deleteController(key: string): void
  clearInteractionStateForKey(key: string): void
  clearMediaQueryListenersForKey(key: string): void
}
```

## Static Methods

### `Interact.create(config)`

Creates a new `Interact` instance with the provided configuration and initializes it.

**Parameters:**

- `config: InteractConfig` - The interaction configuration object

**Returns:** `Interact` - The initialized interact instance

**Example:**

```typescript
import { Interact } from '@wix/interact/web';

const config = {
  interactions: [
    {
      trigger: 'viewEnter',
      key: 'hero',
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

const interact = Interact.create(config);
```

**Details:**

- Automatically calls `init()` on the created instance
- Adds the instance to the global instances array
- When using the web entry point, registers the custom `interact-element` if not already registered
- Returns the fully initialized instance ready for use

### `Interact.getInstance(key)`

Retrieves the `Interact` instance that manages interactions for a specific element key.

**Parameters:**

- `key: string` - The element key to search for

**Returns:** `Interact | undefined` - The instance managing this key, or undefined if not found

**Example:**

```typescript
// Get the instance managing interactions for 'hero'
const instance = Interact.getInstance('hero');

if (instance) {
  console.log('Found instance managing hero');
  console.log('Has interactions:', instance.has('hero'));
}
```

**Use Cases:**

- Finding which instance manages a specific element
- Debugging interaction configuration
- Checking if an element has active interactions
- Programmatically managing interaction state

### `Interact.getController(key)`

Retrieves a cached `InteractionController` by its key.

**Parameters:**

- `key: string | undefined` - The element key to retrieve

**Returns:** `IInteractionController | undefined` - The cached controller, or undefined if not found

**Example:**

```typescript
// Get a cached controller
const controller = Interact.getController('my-element');

if (controller) {
  console.log('Controller found in cache');
  console.log('Connected:', controller.connected);

  // You can interact with the controller directly
  controller.toggleEffect('my-effect', 'add');

  // Get active effects
  const activeEffects = controller.getActiveEffects();
  console.log('Active effects:', activeEffects);
}
```

**Details:**

- Controllers are automatically cached when `add()` is called or when elements connect
- Cache is cleared when `remove()` is called or when elements disconnect
- Useful for programmatic element manipulation
- Returns the controller that manages the element's interactions

### `Interact.setController(key, controller)`

Manually sets a controller in the cache. This is typically used internally but can be useful for advanced use cases.

**Parameters:**

- `key: string` - The key to associate with the controller
- `controller: IInteractionController` - The controller to cache

**Returns:** `void`

**Example:**

```typescript
import { InteractionController } from '@wix/interact/web';

// Manually cache a controller (advanced usage)
const element = document.querySelector('[data-interact-key="custom"]');
if (element) {
  const controller = new InteractionController(element as HTMLElement, 'custom');
  Interact.setController('custom', controller);
}
```

**Note:** This method is primarily for internal use. In most cases, controllers are automatically cached when using the standard API.

### `Interact.deleteController(key)`

Removes a controller from the cache.

**Parameters:**

- `key: string` - The key of the controller to remove

**Returns:** `void`

**Example:**

```typescript
// Remove a controller from cache
Interact.deleteController('my-element');
```

### `Interact.destroy()`

Destroys all `Interact` instances and clears all cached controllers.

**Returns:** `void`

**Example:**

```typescript
// Clean up everything
Interact.destroy();

console.log('All instances destroyed:', Interact.instances.length === 0);
console.log('Cache cleared:', Interact.controllerCache.size === 0);
```

### `Interact.setup(options)`

Configures global settings for the Interact system.

**Parameters:**

- `options: { forceReducedMotion?: boolean, viewEnter?: object, viewProgress?: object, pointerMove?: object, allowA11yTriggers?: boolean}`

**Example:**

```typescript
// Force reduced motion globally
Interact.setup({
  forceReducedMotion: true,
});

// Configure trigger-specific options
Interact.setup({
  viewEnter: { threshold: 0.5 },
  viewProgress: {
    /* scroll options */
  },
});

// Enable accessibility for click and hover triggers
Interact.setup({
  allowA11yTriggers: true,
});
```

### `Interact.registerEffects(effects)`

Registers named-effect (or presets) modules so you can reference them via `namedEffect` (e.g. presets from `@wix/motion-presets` or your own custom-made effects).

**Parameters:**

- `effects: Record<string, EffectModule>` - An object mapping effect names (used as `namedEffect.type`) to effect modules

**Returns:** `void`

**Example:**

```typescript
import { Interact } from '@wix/interact/web';
import * as presets from '@wix/motion-presets';

// Register all presets at once
Interact.registerEffects(presets);

// Now you can use namedEffect in your configuration
const config = {
  interactions: [
    {
      key: 'hero',
      trigger: 'viewEnter',
      effects: [
        {
          namedEffect: { type: 'FadeIn' }, // Works because FadeIn is registered
          duration: 1000,
        },
      ],
    },
  ],
};

Interact.create(config);
```

**Selective Registration:**

```typescript
import { Interact } from '@wix/interact/web';
import { FadeIn, SlideIn } from '@wix/motion-presets';

// Register only the effects you need (smaller bundle)
Interact.registerEffects({ FadeIn, SlideIn });
```

**Custom effect registration:**

```typescript
import { Interact } from '@wix/interact/web';

Interact.registerEffects({
  CustomFadeIn: {
    web: (options) => [
      { ...options, name: 'CustomFadeIn', keyframes: [{ opacity: 0 }, { opacity: 1 }] },
    ],
    getNames: () => ['CustomFadeIn'],
    style: (options) => [
      { ...options, name: 'CustomFadeIn', keyframes: [{ opacity: 0 }, { opacity: 1 }] },
    ],
  },
});
```

**Details:**

- Effects must be registered before calling `Interact.create()` with configurations that reference them
- Registration is global — once registered, effects are available to all Interact instances

### `Interact.defineInteractElement` (Web Entry Only)

Available only when importing from `@wix/interact/web`. Defines the `interact-element` custom element.

**Returns:** `boolean` - `true` if the element was newly defined, `false` if already defined

**Example:**

```typescript
import { Interact } from '@wix/interact/web';

// Manually define the custom element (usually done automatically by create())
const wasNewlyDefined = Interact.defineInteractElement?.();
console.log('Was newly defined:', wasNewlyDefined);
```

**Note:** This is called automatically by `Interact.create()` when using the web entry point.

## Instance Methods

### `constructor()`

Creates a new `Interact` instance with empty caches.

**Example:**

```typescript
// Create an empty instance (typically you'd use Interact.create() instead)
const instance = new Interact();

// Initialize with configuration
instance.init(config);
```

**Details:**

- Initializes empty `dataCache` with effects, conditions, and interactions
- Initializes empty `addedInteractions` tracking object
- Does not register with global instances array (use `Interact.create()` for that)

### `init(config)`

Initializes the instance with a configuration object.

**Parameters:**

- `config: InteractConfig` - The interaction configuration

**Returns:** `void`

**Example:**

```typescript
const instance = new Interact();

const config = {
  interactions: [
    {
      trigger: 'click',
      key: 'button',
      effects: [{ effectId: 'bounce' }],
    },
  ],
  effects: {
    bounce: {
      duration: 500,
      namedEffect: 'bounce',
    },
  },
};

instance.init(config);
```

**Details:**

- Parses and caches the configuration for efficient lookup
- When using web entry, registers the custom element if not already registered
- Connects any already-cached controllers to their interactions
- Can be called multiple times to update configuration

### `destroy()`

Destroys this instance and cleans up all its resources.

**Returns:** `void`

**Example:**

```typescript
const instance = Interact.create(config);

// Later, clean up this specific instance
instance.destroy();
```

**Details:**

- Disconnects all controllers managed by this instance
- Removes all media query listeners
- Clears all interaction state
- Removes this instance from `Interact.instances`

### `has(key)`

Checks if the instance has interactions configured for a specific element key.

**Parameters:**

- `key: string` - The element key to check

**Returns:** `boolean` - True if interactions exist for this key

**Example:**

```typescript
const instance = Interact.create(config);

// Check if an element has interactions
if (instance.has('hero')) {
  console.log('hero has interactions configured');
} else {
  console.log('hero has no interactions');
}

// Useful for conditional logic
if (instance.has('optional-animation')) {
  // Only add element if it has interactions
  document.body.appendChild(createOptionalElement());
}
```

**Use Cases:**

- Conditional element creation
- Debugging configuration issues
- Dynamic interaction management
- Performance optimization (avoid creating elements without interactions)

### `get(key)`

Gets the cached interaction data for a specific element key.

**Parameters:**

- `key: string` - The element key to retrieve

**Returns:** `CachedInteractionData | undefined` - The cached data or undefined

**Example:**

```typescript
const instance = Interact.create(config);

const data = instance.get('hero');
if (data) {
  console.log('Triggers:', data.triggers);
  console.log('Effects:', data.effects);
  console.log('Selectors:', data.selectors);
}
```

### `setController(key, controller)`

Associates a controller with this instance.

**Parameters:**

- `key: string` - The element key
- `controller: IInteractionController` - The controller to associate

**Returns:** `void`

### `deleteController(key)`

Removes a controller from this instance and cleans up its state.

**Parameters:**

- `key: string` - The element key to remove

**Returns:** `void`

### `clearInteractionStateForKey(key)`

Clears all interaction state for a specific element key, removing any active interactions and resetting state.

**Parameters:**

- `key: string` - The element key to clear

**Returns:** `void`

**Example:**

```typescript
// Clear all interaction state for an element
instance.clearInteractionStateForKey('hero');

// Useful when dynamically changing interactions
instance.clearInteractionStateForKey('dynamic-element');
// Update configuration...
// Re-add element to activate new interactions
```

**Details:**

- Removes all interaction IDs associated with the key
- Clears the `addedInteractions` tracking for those interactions
- Does not remove the controller from cache (use `deleteController()` for that)
- Useful for resetting element state before applying new interactions

### `clearMediaQueryListenersForKey(key)`

Clears all media query listeners for a specific element key.

**Parameters:**

- `key: string` - The element key to clear listeners for

**Returns:** `void`

## Instance Properties

### `dataCache: InteractCache`

Contains the parsed and cached interaction configuration.

**Structure:**

```typescript
{
  effects: { [effectId: string]: Effect },
  conditions: { [conditionId: string]: Condition },
  interactions: {
    [key: string]: {
      triggers: Interaction[],
      effects: Record<string, (InteractionTrigger & { effect: Effect | EffectRef })[]>,
      interactionIds: Set<string>,
      selectors: Set<string>
    }
  }
}
```

**Example:**

```typescript
const instance = Interact.create(config);

// Access cached data
console.log('Available effects:', Object.keys(instance.dataCache.effects));
console.log('Available conditions:', Object.keys(instance.dataCache.conditions));
console.log('Element keys with interactions:', Object.keys(instance.dataCache.interactions));

// Check specific element data
const heroData = instance.dataCache.interactions['hero'];
if (heroData) {
  console.log('Triggers for hero:', heroData.triggers.length);
  console.log('Effects for hero:', Object.keys(heroData.effects));
}
```

### `addedInteractions: { [interactionId: string]: boolean }`

Tracks which interactions have been added to prevent duplicates.

**Example:**

```typescript
// Check if specific interactions are active
const instance = Interact.getInstance('hero');
if (instance) {
  const interactionIds = Object.keys(instance.addedInteractions);
  console.log('Active interactions:', interactionIds);

  // Check specific interaction
  const specificId = 'hero::fade-in::1';
  if (instance.addedInteractions[specificId]) {
    console.log('Fade-in interaction is active');
  }
}
```

### `controllers: Set<IInteractionController>`

Set of all controllers managed by this instance.

**Example:**

```typescript
const instance = Interact.create(config);

// Iterate through controllers
instance.controllers.forEach((controller) => {
  console.log(`Controller for ${controller.key}:`, {
    connected: controller.connected,
    element: controller.element,
  });
});
```

## Static Properties

### `Interact.instances: Interact[]`

Array of all created `Interact` instances.

**Example:**

```typescript
// Get all instances
console.log('Total instances:', Interact.instances.length);

// Find instances with specific configurations
const instancesWithHover = Interact.instances.filter((instance) => {
  return Object.values(instance.dataCache.interactions).some((data) =>
    data.triggers.some((trigger) => trigger.trigger === 'hover'),
  );
});

console.log('Instances with hover interactions:', instancesWithHover.length);
```

### `Interact.controllerCache: Map<string, IInteractionController>`

Global cache of all `InteractionController` instances by key.

**Example:**

```typescript
// Get all cached controllers
console.log('Cached controllers:', Interact.controllerCache.size);

// Iterate through cached controllers
Interact.controllerCache.forEach((controller, key) => {
  console.log(`Controller at ${key}:`, {
    connected: controller.connected,
    hasElement: !!controller.element,
  });
});
```

### `Interact.forceReducedMotion: boolean`

Global flag to force reduced motion for all interactions.

**Example:**

```typescript
// Check or set reduced motion
console.log('Reduced motion:', Interact.forceReducedMotion);

// Force reduced motion globally
Interact.forceReducedMotion = true;
```

## Error Handling

The `Interact` class includes built-in error handling and validation:

```typescript
// Configuration validation
const config = {
  interactions: [
    {
      // Missing key will log an error
      trigger: 'click',
      effects: [{ effectId: 'missing-effect' }],
    },
  ],
};

const instance = Interact.create(config);
// Console: "Interaction 1 is missing a key for source element."
```

## Best Practices

### 1. Use `Interact.create()` for Standard Usage

```typescript
// ✅ Recommended
const interact = Interact.create(config);

// ❌ Avoid manual construction unless you have a specific reason
const interact = new Interact();
interact.init(config);
```

### 2. Check Instance Existence

```typescript
// ✅ Safe access
const instance = Interact.getInstance('element');
if (instance && instance.has('element')) {
  // Work with instance
}

// ❌ Unsafe access
const instance = Interact.getInstance('element')!;
instance.clearInteractionStateForKey('element'); // Could throw
```

### 3. Clean Up When Needed

```typescript
// ✅ Clean up when removing elements
instance.destroy();

// Or clean up specific elements
instance.deleteController('removed-element');
```

### 4. Use Appropriate Entry Point

```typescript
// ✅ For web components (vanilla JS, custom elements)
import { Interact } from '@wix/interact/web';

// ✅ For React applications
import { Interact } from '@wix/interact/react';
```

## TypeScript Support

The `Interact` class provides full TypeScript support with proper type inference:

```typescript
import { Interact, InteractConfig, TimeEffect } from '@wix/interact/web';

const config: InteractConfig = {
  interactions: [
    /* ... */
  ],
  effects: {
    fade: {
      duration: 1000,
      keyframeEffect: {
        name: 'fade',
        keyframes: [{ opacity: 0 }, { opacity: 1 }],
      },
    } satisfies TimeEffect,
  },
};

const interact: Interact = Interact.create(config);
```

## See Also

- [Standalone Functions](functions.md) - `add()` and `remove()` functions
- [InteractionController](interaction-controller.md) - Controller class API
- [Type Definitions](types.md) - `InteractConfig` and related types
- [Custom Element](interact-element.md) - `interact-element` API
- [React Integration](../integration/react.md) - React components and hooks
- [Configuration Guide](../guides/configuration-structure.md) - Building interaction configurations
