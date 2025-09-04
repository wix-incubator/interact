# Hover Trigger Rules

This document contains rules for generating hover trigger interactions in `@wix/interact`. These rules cover all hover behavior patterns and common use cases.

## Rule 1: Basic Hover Effect Configuration

**Purpose**: Generate basic hover interactions with enter/leave animations

**Pattern**:
```typescript
{
    source: '[SELECTOR]',
    trigger: 'hover',
    effects: [
        {
            target: '[TARGET_SELECTOR]',
            [EFFECT_TYPE]: [EFFECT_DEFINITION],
            duration: [DURATION],
            easing: '[EASING]'
        }
    ]
}
```

**Default Values**:
- `DURATION`: 300 (for micro-interactions)
- `EASING`: 'ease-out' (for smooth feel)
- `TARGET_SELECTOR`: Same as source selector (self-targeting)

**Common Use Cases**:
- Button hover states
- Card lift effects  
- Image zoom effects
- Color/opacity changes

**Example Generations**:
```typescript
// Button hover
{
    source: '#primary-button',
    trigger: 'hover',
    effects: [
        {
            target: '#primary-button',
            keyframeEffect: {
                name: 'button-shadow',
                keyframes: [
                    { transform: 'scale(1)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                    { transform: 'scale(1.05)', boxShadow: '0 8px 16px rgba(0,0,0,0.15)' }
                ]
            },
            duration: 200,
            easing: 'ease-out'
        }
    ]
}

// Image hover zoom
{
    source: '.product-image',
    trigger: 'hover',
    effects: [
        {
            target: '.product-image img',
            keyframeEffect: {
                name: 'image-scale',
                keyframes: [
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.1)' }
                ]
            },
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
    source: '[SELECTOR]',
    trigger: 'hover',
    params: {
        type: 'alternate'
    },
    effects: [
        {
            target: '[TARGET_SELECTOR]',
            namedEffect: '[NAMED_EFFECT]',
            duration: [DURATION],
            easing: '[EASING]'
        }
    ]
}
```

**Available Named Effects for Hover**:
- `Scale` - Size changes
- `FadeIn` - Opacity changes
- `BlurIn` - Blur effects
- `GlitchIn` - Glitch effects
- `TiltIn` - Rotation effects

**Default Values**:
- `type`: 'alternate' (plays forward on enter, reverses on leave)
- `DURATION`: 250
- `EASING`: 'ease-out'

**Example Generations**:
```typescript
// Card scale effect
{
    source: '#feature-card',
    trigger: 'hover',
    params: {
        type: 'alternate'
    },
    effects: [
        {
            target: '#feature-card',
            namedEffect: 'Scale',
            duration: 250,
            easing: 'ease-out'
        }
    ]
}

// Icon tilt effect
{
    source: '.icon-button',
    trigger: 'hover',
    params: {
        type: 'alternate'
    },
    effects: [
        {
            target: '.icon-button .icon',
            namedEffect: 'TiltIn',
            duration: 200,
            easing: 'ease-in-out'
        }
    ]
}
```

## Rule 3: Hover Interactions with Alternate Pattern

**Purpose**: Generate hover interactions that play forward on mouse enter and reverse on mouse leave

**Pattern**:
```typescript
{
    source: '[SELECTOR]',
    trigger: 'hover',
    params: {
        type: 'alternate'
    },
    effects: [
        {
            target: '[TARGET_SELECTOR]',
            keyframeEffect: {
                name: '[UNIQUE_KEYFRAME_EFFECT_NAME]',
                keyframes: [
                    { [PROPERTY_1]: '[START_VALUE]', [PROPERTY_2]: '[START_VALUE]' },
                    { [PROPERTY_1]: '[END_VALUE]', [PROPERTY_2]: '[END_VALUE]' }
                ]
            },
            duration: [DURATION],
            easing: '[EASING]'
        }
    ]
}
```

**Best Properties for Hover Effects**:
- `transform`: scale, translate, rotate transformations
- `opacity`: fade effects
- `boxShadow`: elevation changes
- `filter`: blur, brightness, hue-rotate
- `backgroundColor`: color transitions

**Default Values**:
- `type`: 'alternate'
- `DURATION`: 300
- `EASING`: 'ease-out'

**Example Generations**:
```typescript
// Card hover with multiple properties
{
    source: '.portfolio-item',
    trigger: 'hover',
    params: {
        type: 'alternate'
    },
    effects: [
        {
            target: '.portfolio-item',
            keyframeEffect: {
                name: 'portfolio',
                keyframes: [
                    { transform: 'translateY(0)', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', filter: 'brightness(1)' },
                    { transform: 'translateY(-8px)', boxShadow: '0 20px 25px rgba(0,0,0,0.15)', filter: 'brightness(1.1)' }
                ]
            },
            duration: 300,
            easing: 'ease-out'
        }
    ]
}

// Image overlay reveal
{
    source: '#gallery-image',
    trigger: 'hover',
    params: {
        type: 'alternate'
    },
    effects: [
        {
            target: '#image-overlay',
            keyframeEffect: {
                name: 'image-overlay-slide',
                keyframes: [
                    { opacity: '0', transform: 'translateY(100%)' },
                    { opacity: '1', transform: 'translateY(0)' }
                ]
            },
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
    source: '[SELECTOR]',
    trigger: 'hover',
    params: {
        type: 'repeat'
    },
    effects: [
        {
            target: '[TARGET_SELECTOR]',
            [EFFECT_TYPE]: [EFFECT_DEFINITION],
            duration: [DURATION],
            easing: '[EASING]'
        }
    ]
}
```

**Use Cases for Repeat Pattern**:
- Attention-grabbing animations
- Pulse effects
- Shake/wiggle animations
- Bounce effects

**Default Values**:
- `type`: 'repeat'
- `DURATION`: 600 (longer for noticeable repeat)
- `EASING`: 'ease-in-out'

**Example Generations**:
```typescript
// Button pulse effect
{
    source: '#cta-button',
    trigger: 'hover',
    params: {
        type: 'repeat'
    },
    effects: [
        {
            target: '#cta-button',
            keyframeEffect: {
                name: 'breath',
                keyframes: [
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.1)' },
                    { transform: 'scale(1)' }
                ]
            },
            duration: 600,
            easing: 'ease-in-out'
        }
    ]
}

// Icon shake effect
{
    source: '.notification-bell',
    trigger: 'hover',
    params: {
        type: 'repeat'
    },
    effects: [
        {
            target: '.notification-bell',
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
    source: '[SELECTOR]',
    trigger: 'hover',
    params: {
        type: 'state'
    },
    effects: [
        {
            target: '[TARGET_SELECTOR]',
            [EFFECT_TYPE]: [EFFECT_DEFINITION],
            duration: [DURATION],
            iterations: Infinity,
            easing: '[EASING]'
        }
    ]
}
```

**Use Cases for State Pattern**:
- Controlling loop animations
- Pausing video effects
- Interactive loading spinners
- Continuous animation control

**Default Values**:
- `type`: 'state'
- `iterations`: Infinity
- `DURATION`: 2000 (longer for smooth loops)
- `EASING`: 'linear' (for continuous motion)

**Example Generations**:
```typescript
// Rotating loader that pauses on hover
{
    source: '#loading-spinner',
    trigger: 'hover',
    params: {
        type: 'state'
    },
    effects: [
        {
            target: '#loading-spinner',
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

// Pulsing element that pauses on hover
{
    source: '.live-indicator',
    trigger: 'hover',
    params: {
        type: 'state'
    },
    effects: [
        {
            target: '.live-indicator',
            keyframeEffect: {
                name: 'pulse',
                keyframes: [
                    { opacity: '0.5' },
                    { opacity: '1' },
                    { opacity: '0.5' }
                ]
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
    source: '[SELECTOR]',
    trigger: 'hover',
    params: {
        type: '[BEHAVIOR_TYPE]'
    },
    effects: [
        {
            target: '[TARGET_1]',
            [EFFECT_TYPE]: [EFFECT_DEFINITION_1],
            duration: [DURATION_1],
            delay: [DELAY_1]
        },
        {
            target: '[TARGET_2]',
            [EFFECT_TYPE]: [EFFECT_DEFINITION_2],
            duration: [DURATION_2],
            delay: [DELAY_2]
        }
    ]
}
```

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
    source: '.product-card',
    trigger: 'hover',
    params: {
        type: 'alternate'
    },
    effects: [
        {
            target: '.product-card',
            keyframeEffect: {
                name: 'product-card-move',
                keyframes: [
                    { transform: 'translateY(0)' },
                    { transform: 'translateY(-8px)' }
                ]
            },
            duration: 200,
            delay: 0
        },
        {
            target: '.product-image',
            keyframeEffect: {
                name: 'product-image-scale',
                keyframes: [
                    { transform: 'scale(1)' },
                    { transform: 'scale(1.05)' }
                ]
            },
            duration: 300,
            delay: 50
        },
        {
            target: '.product-title',
            keyframeEffect: {
                name: 'product-title-color',
                keyframes: [
                    { color: '#374151' },
                    { color: '#2563eb' }
                ]
            },
            duration: 150,
            delay: 100
        },
        {
            target: '.add-to-cart-btn',
            keyframeEffect: {
                name: 'button-fade',
                keyframes: [
                    { opacity: '0', transform: 'translateY(10px)' },
                    { opacity: '1', transform: 'translateY(0)' }
                ]
            },
            duration: 200,
            delay: 150
        }
    ]
}
```

## Rule 7: Conditional Hover Effects

**Purpose**: Generate hover effects that only apply under certain conditions

**Pattern**:
```typescript
{
    source: '[SELECTOR]',
    trigger: 'hover',
    params: {
        type: '[BEHAVIOR_TYPE]'
    },
    conditions: ['[CONDITION_ID]'],
    effects: [
        {
            target: '[TARGET_SELECTOR]',
            [EFFECT_TYPE]: [EFFECT_DEFINITION],
            duration: [DURATION],
            easing: '[EASING]'
        }
    ]
}
```

**Common Conditions for Hover**:
- `desktop-only`: Only on desktop devices
- `prefers-motion`: Only when user allows animations
- `large-screen`: Only on larger viewports
- `touch-device`: Only on touch-enabled devices

**Example Generations**:
```typescript
// Desktop-only hover effect
{
    source: '#hero-image',
    trigger: 'hover',
    params: {
        type: 'alternate'
    },
    conditions: ['desktop-only', 'prefers-motion'],
    effects: [
        {
            target: '#hero-image',
            namedEffect: 'Scale',
            duration: 400,
            easing: 'ease-out'
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
