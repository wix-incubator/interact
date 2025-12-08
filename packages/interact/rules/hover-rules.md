# Hover Trigger Rules

This document contains rules for generating hover trigger interactions in `@wix/interact`. These rules cover all hover behavior patterns and common use cases.

## Rule 1: Basic Hover Effect Configuration

**Purpose**: Generate basic hover interactions with enter/leave animations

**Pattern**:
```typescript
{
    key: '[SOURCE_IDENTIFIER]',
    trigger: 'hover',
    effects: [
        {
            key: '[TARGET_IDENTIFIER]',
            [EFFECT_TYPE]: [EFFECT_DEFINITION],
            fill: 'both',
            duration: [DURATION_MS],
            easing: '[EASING_FUNCTION]'
        }
    ]
}
```

**Variables**:
- `[SOURCE_IDENTIFIER]`: Unique identifier for hoverable element (e.g., '#menu-button', '#accordion-header'). Should equal the value of the data-interact-key attribute on the wrapping interact-element.
- `[TARGET_IDENTIFIER]`: Unique identifier for animated element (can be same as trigger or different). Should equal the value of the data-interact-key attribute on the wrapping interact-element.
- `[EFFECT_TYPE]`: Either `namedEffect` or `keyframeEffect`
- `[EFFECT_DEFINITION]`: Named effect object (e.g., { type: 'SlideIn', ...params }, { type: 'FadeIn', ...params }) or keyframe object (e.g., { name: 'custom-fade', keyframes: [{ opacity: 0 }, { opacity: 1 }] }, { name: 'custom-slide', keyframes: [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }] })
- `[DURATION_MS]`: Animation duration in milliseconds (typically 200-500ms for micro-interactions)
- `[EASING_FUNCTION]`: Timing function ('ease-out', 'ease-in-out', or cubic-bezier)
- `[UNIQUE_EFFECT_ID]`: Optional unique identifier for animation chaining

**Default Values**:
- `DURATION_MS`: 300 (for micro-interactions)
- `EASING_FUNCTION`: 'ease-out' (for smooth feel)
- `TARGET_IDENTIFIER`: Same as source key (self-targeting)

**Common Use Cases**:
- Button hover states
- Card lift effects  
- Image zoom effects
- Color/opacity changes

**Example Generations**:
```typescript
// Button hover
{
    key: 'primary-button',
    trigger: 'hover',
    effects: [
        {
            key: 'primary-button',
            keyframeEffect: {
                name: 'button-shadow',
                keyframes: [
                    { transform: 'scale(1)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                    { transform: 'scale(1.05)', boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }
                ]
            },
            fill: 'both',
            duration: 200,
            easing: 'ease-out'
        }
    ]
}

// Image hover zoom
{
    key: 'product-image',
    trigger: 'hover',
    effects: [
        {
            key: 'product-image-media',
            keyframeEffect: {
                name: 'image-scale',
                keyframes: [
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.1)' }
                ]
            },
            fill: 'both',
            duration: 400,
            easing: 'ease-out'
        }
    ]
}
```

## Rule 2: Hover Enter/Leave Animations with Named Effects

**Purpose**: Generate hover interactions using pre-built named effects from @wix/motion

**Pattern**:
```typescript
{
    key: '[SOURCE_IDENTIFIER]',
    trigger: 'hover',
    params: {
        type: 'alternate'
    },
    effects: [
        {
            key: '[TARGET_IDENTIFIER]',
            namedEffect: {
                type: '[NAMED_EFFECT_TYPE]',
                [EFFECT_PROPERTIES]
            },
            fill: 'both',
            reversed: [REVERSED_BOOL],
            duration: [DURATION_MS],
            easing: '[EASING_FUNCTION]'
        }
    ]
}
```

**Variables**:
- `[REVERSED_BOOL]`: Optional boolean value indicating whether the mouse enter animation is reversed (and mouse leave is forwards).
- `[NAMED_EFFECT_TYPE]`: Name of the pre-built named effect from @wix/motion to use.
- `[EFFECT_PROPERTIES]`: Named effect specific properties (distance, angle, perspective, etc.)
- Other variables same as Rule 1

**Available Named Effects for Hover**:
- **Size Changes**: `ExpandIn`, `Pulse`, `GrowIn`
- **Opacity/Blur Changes**: `FadeIn`, `Flash`, `BlurIn`
- **Translation Effects**: `SlideIn`, `GlideIn`, `FloatIn`, `BounceIn`, `GlitchIn`
- **Rotation Effects**: `SpinIn`, `TiltIn`, `ArcIn`, `TurnIn`, `FlipIn`, `Spin`, `Swing`
- **Special Attention Effects**: `Bounce`, `DropIn`, `Rubber`, `Jello`, `Cross`, `Wiggle`, `Poke`

**Important**: Spatial effects that change the hit-area considerably (translation, rotation) should use different source and target keys to avoid unwanted flickering on hover enter/leave.

**Default Values**:
- `type`: 'alternate' (plays forward on enter, reverses on leave)
- `DURATION_MS`: 250
- `EASING_FUNCTION`: 'ease-out'

**Example Generations**:
```typescript
// Card scale effect
{
    key: 'feature-card',
    trigger: 'hover',
    params: {
        type: 'alternate'
    },
    effects: [
        {
            key: 'feature-card',
            namedEffect: { 
                type: 'Pulse',
                power: 'soft'
            },
            fill: 'both',
            duration: 250,
            easing: 'ease-out'
        }
    ]
}

// Icon rotation effect (different source/target to avoid flickering)
{
    key: 'button',
    trigger: 'hover',
    params: {
        type: 'alternate'
    },
    effects: [
        {
            key: 'button-icon',
            namedEffect: { 
                type: 'SpinIn',
                direction: 'clockwise',
                power: 'soft'
            },
            fill: 'both',
            duration: 200,
            easing: 'ease-out'
        }
    ]
}
```

## Rule 3: Hover Interactions with Alternate Pattern

**Purpose**: Generate hover interactions that play forward on mouse enter and reverse on mouse leave

**Pattern**:
```typescript
{
    key: '[SOURCE_IDENTIFIER]',
    trigger: 'hover',
    params: {
        type: 'alternate'
    },
    effects: [
        {
            key: '[TARGET_IDENTIFIER]',
            keyframeEffect: {
                name: '[UNIQUE_KEYFRAME_EFFECT_NAME]',
                keyframes: [
                    { [PROPERTY_1]: '[START_VALUE]', [PROPERTY_2]: '[START_VALUE]' },
                    { [PROPERTY_1]: '[END_VALUE]', [PROPERTY_2]: '[END_VALUE]' }
                ]
            },
            fill: 'both',
            duration: [DURATION_MS],
            easing: '[EASING_FUNCTION]'
        }
    ]
}
```

**Variables**:
- `[UNIQUE_KEYFRAME_EFFECT_NAME]`: unique name for the keyframeEffect.
- `[PROPERTY_N]`: animatable CSS property.
- `[START/END_VALUE]`: values for the animated CSS properties in the start/end frame.
- Other variables same as Rule 1

**Best Properties for Hover Effects**:
- `transform`: scale, translate, rotate transformations
- `opacity`: fade effects
- `box-shadow`: elevation changes
- `filter`: blur, brightness, hue-rotate
- `background-color`: color transitions
- Spatial effects that change the hit-area of the animated element considerably (e.g. Translation effects, Rotation effects, etc.) should have different source and target to avoid unwanted flickering.

**Default Values**:
- `type`: 'alternate'
- `DURATION_MS`: 300
- `EASING_FUNCTION`: 'ease-out'

**Example Generations**:
```typescript
// Card hover with multiple properties
{
    key: 'portfolio-item',
    trigger: 'hover',
    params: {
        type: 'alternate'
    },
    effects: [
        {
            key: 'portfolio-item',
            keyframeEffect: {
                name: 'portfolio',
                keyframes: [
                    { transform: 'translateY(0)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', filter: 'brightness(1)' },
                    { transform: 'translateY(-8px)', boxShadow: '0 20px 25px rgba(0,0,0,0.15)', filter: 'brightness(1.1)' }
                ]
            },
            fill: 'both',
            duration: 300,
            easing: 'ease-out'
        }
    ]
}

// Image overlay reveal
{
    key: 'gallery-image',
    trigger: 'hover',
    params: {
        type: 'alternate'
    },
    effects: [
        {
            key: 'image-overlay',
            keyframeEffect: {
                name: 'image-overlay-slide',
                keyframes: [
                    { opacity: '0', transform: 'translateY(100%)' },
                    { opacity: '1', transform: 'translateY(0)' }
                ]
            },
            fill: 'both',
            duration: 250,
            easing: 'ease-out'
        }
    ]
}
```

## Rule 4: Hover Interactions with Repeat Pattern

**Purpose**: Generate hover interactions that restart animation each time mouse enters

**Pattern**:
```typescript
{
    key: '[SOURCE_IDENTIFIER]',
    trigger: 'hover',
    params: {
        type: 'repeat'
    },
    effects: [
        {
            key: '[TARGET_IDENTIFIER]',
            [EFFECT_TYPE]: [EFFECT_DEFINITION],
            duration: [DURATION_MS],
            easing: '[EASING_FUNCTION]'
        }
    ]
}
```

**Variables**:
- Same as Rule 1

**Use Cases for Repeat Pattern**:
- Attention-grabbing animations
- Pulse effects
- Shake/wiggle animations
- Bounce effects

**Default Values**:
- `type`: 'repeat'
- `DURATION_MS`: 600 (longer for noticeable repeat)
- `EASING_FUNCTION`: 'ease-in-out'

**Example Generations**:
```typescript
// Button pulse effect
{
    key: 'cta-button',
    trigger: 'hover',
    params: {
        type: 'repeat'
    },
    effects: [
        {
            key: 'cta-button',
            namedEffect: {
                type: 'Breath'
            },
            duration: 600,
            easing: 'ease-in-out'
        }
    ]
}

// Icon shake effect
{
    key: 'notification-bell',
    trigger: 'hover',
    params: {
        type: 'repeat'
    },
    effects: [
        {
            key: 'notification-bell',
            keyframeEffect: {
                name: 'shake',
                keyframes: [
                    { transform: 'rotate(0deg)' },
                    { transform: 'rotate(15deg)' },
                    { transform: 'rotate(-15deg)' },
                    { transform: 'rotate(0deg)' }
                ]
            },
            duration: 500,
            easing: 'ease-in-out'
        }
    ]
}
```

## Rule 5: Hover Interactions with Play/Pause Pattern

**Purpose**: Generate hover interactions that pause/resume on hover (state-based control)

**Pattern**:
```typescript
{
    key: '[SOURCE_IDENTIFIER]',
    trigger: 'hover',
    params: {
        type: 'state'
    },
    effects: [
        {
            key: '[TARGET_IDENTIFIER]',
            [EFFECT_TYPE]: [EFFECT_DEFINITION],
            duration: [DURATION_MS],
            iterations: Infinity,
            easing: '[EASING_FUNCTION]'
        }
    ]
}
```

**Variables**:
- Same as Rule 1

**Use Cases for State Pattern**:
- Controlling loop animations
- Pausing video effects
- Interactive loading spinners
- Continuous animation control

**Default Values**:
- `type`: 'state'
- `iterations`: Infinity
- `DURATION_MS`: 2000 (longer for smooth loops)
- `EASING_FUNCTION`: 'linear' (for continuous motion)

**Example Generations**:
```typescript
// Rotating loader that plays on hover and pauses on mouse leave
{
    key: 'loading-spinner',
    trigger: 'hover',
    params: {
        type: 'state'
    },
    effects: [
        {
            key: 'loading-spinner',
            keyframeEffect: {
                name: 'spin',
                keyframes: [
                    { transform: 'rotate(0deg)' },
                    { transform: 'rotate(360deg)' }
                ]
            },
            duration: 2000,
            iterations: Infinity,
            easing: 'linear'
        }
    ]
}

// Pulsing element that plays on hover and pauses on mouse leave
{
    key: 'live-indicator',
    trigger: 'hover',
    params: {
        type: 'state'
    },
    effects: [
        {
            key: 'live-indicator',
            namedEffect: {
                type: 'Pulse'
            },
            duration: 1500,
            iterations: Infinity,
            easing: 'ease-in-out'
        }
    ]
}
```

## Rule 6: Multi-Target Hover Effects

**Purpose**: Generate hover interactions that affect multiple elements from a single source

**Pattern**:
```typescript
{
    key: '[SOURCE_IDENTIFIER]',
    trigger: 'hover',
    params: {
        type: '[BEHAVIOR_TYPE]'
    },
    effects: [
        {
            key: '[TARGET_1]',
            [EFFECT_TYPE]: [EFFECT_DEFINITION_1],
            fill: [FILL_1],
            reversed: [REVERSED_BOOL_1],
            duration: [DURATION_1],
            delay: [DELAY_1]
        },
        {
            key: '[TARGET_2]',
            [EFFECT_TYPE]: [EFFECT_DEFINITION_2],
            fill: [FILL_2],
            reversed: [REVERSED_BOOL_2],
            duration: [DURATION_2],
            delay: [DELAY_2]
        }
    ]
}
```

**Variables**:
- `[BEHAVIOR_TYPE]`: type of behavior for the effect. use `alternate`, `repeat`, or `state` according to the previous rules.
- `[FILL_N]`: Optional fill value for the Nth effect - same ass CSS animation-fill-mode (e.g. 'both', 'forwards', 'backwards').
- `[REVERSED_BOOL_N]`: Same as `[REVERSED_BOOL]` from Rule 2 only for the Nth effect.
- `[DURATION_N]`: Same as `[DURATION_MS]` from Rule 1 only for the Nth effect.
- `[DELAY_N]`: Delay in milliseconds of the Nth effect.

**Use Cases**:
- Card hover affecting image, text, and button
- Navigation item hover affecting icon and text
- Complex component state changes

**Timing Strategies**:
- Simultaneous: All delays = 0
- Staggered: Incrementing delays (0, 50, 100ms)
- Sequential: Non-overlapping delays

**Example Generations**:
```typescript
// Product card with multiple targets
{
    key: 'product-card',
    trigger: 'hover',
    params: {
        type: 'alternate'
    },
    effects: [
        {
            key: 'product-card',
            keyframeEffect: {
                name: 'product-card-move',
                keyframes: [
                    { transform: 'translateY(0)' },
                    { transform: 'translateY(-8px)' }
                ]
            },
            fill: 'both',
            duration: 200,
            delay: 0
        },
        {
            key: 'product-image',
            keyframeEffect: {
                name: 'product-image-scale',
                keyframes: [
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.05)' }
                ]
            },
            fill: 'both',
            duration: 300,
            delay: 50
        },
        {
            key: 'product-title',
            keyframeEffect: {
                name: 'product-title-color',
                keyframes: [
                    { color: '#374151' },
                    { color: '#2563eb' }
                ]
            },
            fill: 'both',
            duration: 150,
            delay: 100
        },
        {
            key: 'add-to-cart-btn',
            keyframeEffect: {
                name: 'button-fade',
                keyframes: [
                    { opacity: '0', transform: 'translateY(10px)' },
                    { opacity: '1', transform: 'translateY(0)' }
                ]
            },
            fill: 'both',
            duration: 200,
            delay: 150
        }
    ]
}
```

## Best Practices for Hover Rules

### Performance Guidelines
1. **Keep durations short** (100-400ms) for responsiveness
2. **Avoid animating layout properties**: width, height, margin, padding

### User Experience Guidelines
1. **Use 'alternate' type** for most hover effects (natural enter/leave)
2. **Use 'repeat' sparingly** - can be annoying if overused
3. **Use 'state' for controlling** ongoing animations
4. **Stagger multi-target effects** for more polished feel

### Timing Recommendations
- **Micro-interactions**: 100-200ms
- **Button hovers**: 200-300ms  
- **Card/image effects**: 300-400ms
- **Complex multi-target**: 200-500ms total

### Easing Recommendations
- **Enter animations**: 'ease-out' (quick start, slow end)
- **Interactive elements**: 'ease-in-out' (smooth both ways)
- **Attention effects**: 'ease-in-out' (natural feel)
- **Continuous motion**: 'linear' (consistent speed)
