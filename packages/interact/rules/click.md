# Click Trigger Rules for @wix/interact

These rules help generate click-based interactions using the `@wix/interact` library. Click triggers respond to mouse click events and support multiple behavior patterns for different user experience needs.

## Rule 1: Click with TimeEffect and Alternate Pattern

**Use Case**: Toggle animations that play forward on first click and reverse on subsequent clicks (e.g., menu toggles, accordion expand/collapse, modal open/close)

**When to Apply**:

- When you need reversible animations
- For toggle states that should animate back to original position
- When creating expand/collapse functionality
- For modal or sidebar open/close animations

**Pattern**:

```typescript
{
    key: '[SOURCE_IDENTIFIER]',
    trigger: 'click',
    params: {
        type: 'alternate'
    },
    effects: [
        {
            key: '[TARGET_IDENTIFIER]',
            [EFFECT_TYPE]: [EFFECT_DEFINITION],
            fill: 'both',
            reversed: [INITIAL_REVERSED_BOOL],
            duration: [DURATION_MS],
            easing: '[EASING_FUNCTION]',
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:

- `[SOURCE_IDENTIFIER]`: Unique identifier for clickable element (e.g., 'menu-button', 'accordion-header'). Should equal the value of the data-interact-key attribute on the wrapping interact-element.
- `[TARGET_IDENTIFIER]`: Unique identifier for animated element (can be same as trigger or different). Should equal the value of the data-interact-key attribute on the wrapping interact-element.
- `[EFFECT_TYPE]`: Either `namedEffect` or `keyframeEffect`
- `[EFFECT_DEFINITION]`: Named effect object (e.g., { type: 'SlideIn', ...params }, { type: 'FadeIn', ...params }) or keyframe object (e.g., { name: 'custom-fade', keyframes: [{ opacity: 0 }, { opacity: 1 }] }, { name: 'custom-slide', keyframes: [{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }] })
- `[INITIAL_REVERSED_BOOL]`: Optional boolean value indicating whether the first toggle should play the reversed animation.
- `[DURATION_MS]`: Animation duration in milliseconds (typically 200-500ms for clicks)
- `[EASING_FUNCTION]`: Timing function ('ease-out', 'ease-in-out', or cubic-bezier)
- `[UNIQUE_EFFECT_ID]`: Optional unique identifier for animation chaining

**Example - Menu Toggle**:

```typescript
{
    key: 'hamburger-menu',
    trigger: 'click',
    params: {
        type: 'alternate'
    },
    effects: [
        {
            key: 'mobile-nav',
            namedEffect: {
                type: 'SlideIn',
                direction: 'left',
                power: 'medium'
            },
            fill: 'both',
            reversed: true,
            duration: 300,
            easing: 'ease-out',
            effectId: 'mobile-nav-toggle'
        }
    ]
}
```

**Example - Accordion Expand**:

```typescript
{
    key: 'accordion-header',
    trigger: 'click',
    params: {
        type: 'alternate'
    },
    effects: [
        {
            key: 'accordion-content',
            keyframeEffect: {
                name: 'accordion',
                keyframes: [
                    { clipPath: 'inset(0 0 100% 0)', opacity: '0' },
                    { clipPath: 'inset(0 0 0 0)', opacity: '1' }
                ]
            },
            fill: 'both',
            reversed: true,
            duration: 400,
            easing: 'ease-in-out'
        }
    ]
}
```

---

## Rule 2: Click with TimeEffect and State Pattern

**Use Case**: Animations that can be paused and resumed with clicks (e.g., video controls, loading animations, slideshow controls)

**When to Apply**:

- When you need play/pause functionality
- For controlling ongoing animations
- When users should be able to interrupt and resume animations
- For interactive media controls

**Pattern**:

```typescript
{
    key: '[SOURCE_IDENTIFIER]',
    trigger: 'click',
    params: {
        type: 'state'
    },
    effects: [
        {
            key: '[TARGET_IDENTIFIER]',
            [EFFECT_TYPE]: [EFFECT_DEFINITION],
            fill: 'both',
            reversed: [INITIAL_REVERSED_BOOL],
            duration: [DURATION_MS],
            easing: '[EASING_FUNCTION]',
            iterations: [ITERATION_COUNT],
            alternate: [ALTERNATE_BOOL],
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:

- `[ITERATION_COUNT]`: Number of iterations or Infinity for infinite looping animations
- `[ALTERNATE_BOOL]`: Optional boolean value indicating whether to alternate/toggle the playing direction of the animation on each iterations. Relevant only if `[ITERATION_COUNT]` is not 1.
- Other variables same as Rule 1

**Example - Loading Spinner Control**:

```typescript
{
    key: 'loading-control',
    trigger: 'click',
    params: {
        type: 'state'
    },
    effects: [
        {
            key: 'spinner',
            keyframeEffect: {
                name: 'spin',
                keyframes: [
                    { transform: 'rotate(0deg)' },
                    { transform: 'rotate(360deg)' }
                ]
            },
            duration: 1000,
            easing: 'linear',
            iterations: Infinity,
            effectId: 'spinner-rotation'
        }
    ]
}
```

**Example - Slideshow Pause**:

```typescript
{
    key: 'slideshow-toggle',
    trigger: 'click',
    params: {
        type: 'state'
    },
    effects: [
        {
            key: 'slideshow-container',
            namedEffect: { type: 'ShuttersIn' },
            duration: 3000,
            iterations: 10,
            alternate: true,
            effectId: 'slideshow-animation'
        }
    ]
}
```

---

## Rule 3: Click with TimeEffect and Repeat Pattern

**Use Case**: Animations that restart from the beginning each time clicked (e.g., pulse effects, notification badges, emphasis animations)

**When to Apply**:

- When you want fresh animation on each click
- For attention-grabbing effects
- When animation should always start from initial state
- For feedback animations that confirm user actions

**Pattern**:

```typescript
{
    key: '[SOURCE_IDENTIFIER]',
    trigger: 'click',
    params: {
        type: 'repeat'
    },
    effects: [
        {
            key: '[TARGET_IDENTIFIER]',
            [EFFECT_TYPE]: [EFFECT_DEFINITION],
            duration: [DURATION_MS],
            easing: '[EASING_FUNCTION]',
            delay: [DELAY_MS],
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:

- `[DELAY_MS]`: Optional delay before animation starts (useful for sequencing)
- Other variables same as Rule 1

**Example - Button Pulse Feedback**:

```typescript
{
    key: 'action-button',
    trigger: 'click',
    params: {
        type: 'repeat'
    },
    effects: [
        {
            key: 'action-button',
            keyframeEffect: {
                name: 'button-shadow',
                keyframes: [
                    { transform: 'scale(1)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                    { transform: 'scale(1.1)', boxShadow: '0 8px 16px rgba(0,0,0,0.2)' },
                    { transform: 'scale(1)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
                ]
            },
            duration: 300,
            easing: 'ease-out'
        }
    ]
}
```

**Example - Success Notification**:

```typescript
{
    key: 'save-button',
    trigger: 'click',
    params: {
        type: 'repeat'
    },
    effects: [
        {
            key: 'success-badge',
            namedEffect: {
                type: 'BounceIn',
                direction: 'center',
                power: 'medium'
            },
            duration: 600,
            easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
            delay: 300,
            effectId: 'success-feedback'
        }
    ]
}
```

---

## Rule 4: Click with State Toggles and TransitionEffects

**Use Case**: CSS property changes that toggle between states (e.g., theme switching, style variations, color changes)

**When to Apply**:

- When animating CSS properties directly
- For theme toggles and style switches
- When you need precise control over CSS transitions
- For simple property changes without complex keyframes

**Pattern**:

```typescript
{
    key: '[SOURCE_IDENTIFIER]',
    trigger: 'click',
    params: {
        method: 'toggle'
    },
    effects: [
        {
            key: '[TARGET_IDENTIFIER]',
            transition: {
                duration: [DURATION_MS],
                delay: [DELAY_MS],
                easing: '[EASING_FUNCTION]',
                styleProperties: [
                    { name: '[CSS_PROPERTY_1]', value: '[VALUE_1]' },
                    { name: '[CSS_PROPERTY_2]', value: '[VALUE_2]' }
                ]
            },
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:

- `[CSS_PROPERTY_N]`: CSS property name (e.g., 'background-color', 'color', 'border-radius')
- `[VALUE_N]`: CSS property value (e.g., '#2563eb', 'white', '12px')
- Other variables same as previous rules

**Example - Theme Toggle**:

```typescript
{
    key: 'theme-switcher',
    trigger: 'click',
    params: {
        method: 'toggle'
    },
    effects: [
        {
            key: 'page-body',
            transition: {
                duration: 400,
                easing: 'ease-in-out',
                styleProperties: [
                    { name: 'background-color', value: '#1a1a1a' },
                    { name: 'color', value: '#ffffff' },
                    { name: 'border-color', value: '#374151' },
                    { name: '--accent-color', value: '#475137ff' } // custom CSS properties are also supported
                ]
            },
            effectId: 'theme-switch'
        }
    ]
}
```

**Example - Button Style Toggle**:

```typescript
{
    key: 'style-toggle',
    trigger: 'click',
    params: {
        method: 'toggle'
    },
    effects: [
        {
            key: 'style-toggle',
            transition: {
                duration: 300,
                easing: 'ease-out',
                styleProperties: [
                    { name: 'background-color', value: '#ef4444' },
                    { name: 'color', value: '#ffffff' },
                    { name: 'border-radius', value: '24px' },
                    { name: 'transform', value: 'scale(1.05)' }
                ]
            }
        }
    ]
}
```

**Example - Card State Toggle**:

```typescript
{
    key: 'interactive-card',
    trigger: 'click',
    params: {
        method: 'toggle'
    },
    effects: [
        {
            key: 'interactive-card',
            transition: {
                duration: 250,
                easing: 'ease-in-out',
                styleProperties: [
                    { name: 'background-color', value: '#f3f4f6' },
                    { name: 'border-color', value: '#2563eb' },
                    { name: 'box-shadow', value: '0 20px 25px rgba(0,0,0,0.15)' }
                ]
            }
        }
    ]
}
```

---

## Advanced Patterns and Combinations

### Multi-Target Click Effects

When one click should animate multiple elements:

```typescript
{
    key: 'master-control',
    trigger: 'click',
    params: {
        type: 'alternate'
    },
    effects: [
        {
            key: 'element-1',
            namedEffect: { type: 'FadeIn' },
            duration: 300,
            delay: 0,
            fill: 'both'
        },
        {
            key: 'element-2',
            namedEffect: { type: 'SlideIn' },
            duration: 400,
            delay: 100,
            fill: 'both'
        },
        {
            key: 'element-3',
            transition: {
                duration: 200,
                delay: 200,
                styleProperties: [
                    { name: 'box-shadow', value: '0 20px 25px rgba(0.2,0,0,0.15)' }
                ]
            }
        }
    ]
}
```

### Click with Animation Chaining

Using effectId for sequential animations:

```typescript
// First click animation
{
    key: 'sequence-trigger',
    trigger: 'click',
    params: {
        type: 'once'
    },
    effects: [
        {
            key: 'first-element',
            namedEffect: { type: 'FadeIn' },
            duration: 500,
            effectId: 'first-fade'
        }
    ]
},
// Chained animation
{
    key: 'first-element',
    trigger: 'animationEnd',
    params: {
        effectId: 'first-fade'
    },
    effects: [
        {
            key: 'second-element',
            namedEffect: { type: 'SlideIn' },
            duration: 400,
            effectId: 'second-slide'
        }
    ]
}
```

---

## Best Practices for Click Interactions

### Performance Guidelines

1. **Keep click animations short** (100-500ms) for immediate feedback
2. **Use `transform` and `opacity`** for smooth animations
3. **Avoid animating layout properties** like width/height in clicks
4. **Consider using `will-change`** for complex click animations

### User Experience Guidelines

1. **Provide immediate visual feedback** (within 100ms)
2. **Use alternate pattern** for toggle states
3. **Use repeat pattern** for confirmation actions
4. **Use state pattern** for media controls
5. **Ensure click targets are accessible** (minimum 44px touch target)

### Accessibility Considerations

1. **Respect `prefers-reduced-motion`** setting
2. **Provide alternative interaction methods** (keyboard support)
3. **Ensure sufficient color contrast** during transitions
4. **Don't rely solely on animation** to convey state changes

### Common Use Cases by Pattern

**Alternate Pattern**:

- Navigation menus
- Accordion sections
- Modal dialogs
- Sidebar toggles
- Dropdown menus

**State Pattern**:

- Video/audio controls
- Loading animations
- Slideshow controls
- Progress indicators

**Repeat Pattern**:

- Action confirmations
- Notification badges
- Button feedback
- Success animations
- Error indicators

**Transition Effects**:

- Theme switching
- Style variations
- Color changes
- Simple state toggles
- CSS custom property updates

---

These rules provide comprehensive coverage for click trigger interactions in `@wix/interact`, supporting the four main behavior patterns and two primary effect types as outlined in the development plan.
