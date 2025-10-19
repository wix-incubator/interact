# PointerMove Trigger Rules for @wix/interact

These rules help generate pointer-driven interactions using the `@wix/interact` library. PointerMove triggers create real-time animations that respond to mouse movement over elements, perfect for 3D effects, cursor followers, and interactive cards.

## Rule 1: Single Element Pointer Effects with 3D Named Effects

**Use Case**: Interactive 3D transformations on individual elements that respond to mouse position (e.g., card tilting, 3D product showcases, interactive buttons)

**When to Apply**: 
- For interactive card hover effects
- When creating 3D product showcases
- For engaging button interactions
- When building interactive UI elements that respond to mouse movement

**Pattern**:
```typescript
{
    key: '[SOURCE_KEY]',
    trigger: 'pointerMove',
    params: {
        hitArea: '[HIT_AREA]'
    },
    effects: [
        {
            key: '[TARGET_KEY]',
            namedEffect: {
                type: '[3D_EFFECT_TYPE]',
                [EFFECT_PROPERTIES]
            },
            centeredToTarget: [CENTERED_TO_TARGET],
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:
- `[SOURCE_KEY]`: Unique identifier for source element that tracks mouse movement
- `[TARGET_KEY]`: Unique identifier for target element to animate (can be same as source or different)
- `[HIT_AREA]`: 'self' (mouse within source element) or 'root' (mouse anywhere in viewport)
- `[3D_EFFECT_TYPE]`: 'Tilt3DMouse', 'Track3DMouse', 'SwivelMouse'
- `[EFFECT_PROPERTIES]`: Named effect specific properties (angle, perspective, power, etc.)
- `[CENTERED_TO_TARGET]`: true (center range at target) or false (use source element bounds)
- `[UNIQUE_EFFECT_ID]`: Optional unique identifier

**Example - Interactive Product Card**:
```typescript
{
    key: 'product-card',
    trigger: 'pointerMove',
    params: {
        hitArea: 'self'
    },
    effects: [
        {
            key: 'product-card',
            namedEffect: {
                type: 'Tilt3DMouse',
                angle: 15,
                perspective: 1000,
                power: 'medium'
            }
        }
    ]
}
```

---

## Rule 2: Single Element Pointer Effects with Movement Named Effects

**Use Case**: Cursor-following and position-tracking effects on individual elements (e.g., floating elements, cursor followers, responsive decorations)

**When to Apply**:
- For cursor-following elements
- When creating floating responsive decorations
- For interactive element positioning
- When building mouse-aware UI components

**Pattern**:
```typescript
{
    key: '[SOURCE_KEY]',
    trigger: 'pointerMove',
    params: {
        hitArea: '[HIT_AREA]'
    },
    effects: [
        {
            key: '[TARGET_KEY]',
            namedEffect: {
                type: '[MOVEMENT_EFFECT_TYPE]',
                distance: { value: [DISTANCE_VALUE], type: '[DISTANCE_UNIT]' },
                axis: '[AXIS_CONSTRAINT]',
                power: '[POWER_LEVEL]'
            },
            centeredToTarget: [CENTERED_TO_TARGET],
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:
- `[MOVEMENT_EFFECT_TYPE]`: 'TrackMouse', 'AiryMouse', 'BounceMouse'
- `[DISTANCE_VALUE]`: Numeric value for movement distance
- `[DISTANCE_UNIT]`: 'px', 'percentage', 'vw', 'vh'
- `[AXIS_CONSTRAINT]`: 'both', 'horizontal', 'vertical'
- `[POWER_LEVEL]`: 'soft', 'medium', 'hard'
- Other variables same as Rule 1

**Example - Cursor Follower Element**:
```typescript
{
    key: 'cursor-follower',
    trigger: 'pointerMove',
    params: {
        hitArea: 'root'
    },
    effects: [
        {
            namedEffect: {
                type: 'TrackMouse',
                distance: { value: 50, type: 'percentage' },
                axis: 'both',
                power: 'medium'
            },
            centeredToTarget: false
        }
    ]
}
```

**Example - Floating Decoration**:
```typescript
{
    key: 'hero-section',
    trigger: 'pointerMove',
    params: {
        hitArea: 'self'
    },
    effects: [
        {
            key: 'floating-element',
            namedEffect: {
                type: 'AiryMouse',
                distance: { value: 30, type: 'px' },
                axis: 'both',
                power: 'soft'
            },
            centeredToTarget: true,
            effectId: 'hero-float'
        }
    ]
}
```

---

## Rule 3: Single Element Pointer Effects with Scale Named Effects

**Use Case**: Dynamic scaling and deformation effects on individual elements based on mouse position (e.g., interactive scaling, organic transformations, blob effects)

**When to Apply**:
- For interactive scaling buttons
- When creating organic blob-like interactions
- For dynamic size responsive elements
- When building creative morphing interfaces

**Pattern**:
```typescript
{
    key: '[SOURCE_KEY]',
    trigger: 'pointerMove',
    params: {
        hitArea: '[HIT_AREA]'
    },
    effects: [
        {
            key: '[TARGET_KEY]',
            namedEffect: {
                type: '[SCALE_EFFECT_TYPE]',
                [SCALE_PROPERTIES]
            },
            centeredToTarget: [CENTERED_TO_TARGET],
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:
- `[SCALE_EFFECT_TYPE]`: 'ScaleMouse', 'BlobMouse', 'SkewMouse'
- `[SCALE_PROPERTIES]`: Effect-specific properties (scale, distance, axis, power)
- Other variables same as Rule 1

**Example - Interactive Scale Button**:
```typescript
{
    key: 'scale-button',
    trigger: 'pointerMove',
    params: {
        hitArea: 'self'
    },
    effects: [
        {
            key: 'scale-button',
            namedEffect: {
                type: 'ScaleMouse',
                scale: 1.1,
                distance: { value: 100, type: 'px' },
                axis: 'both',
                power: 'medium'
            },
            centeredToTarget: true
        }
    ]
}
```

**Example - Organic Blob Effect**:
```typescript
{
    key: 'blob-container',
    trigger: 'pointerMove',
    params: {
        hitArea: 'self'
    },
    effects: [
        {
            key: 'blob-shape',
            namedEffect: {
                type: 'BlobMouse',
                intensity: 0.8,
                smoothness: 0.6,
                power: 'medium'
            },
            effectId: 'blob-morph'
        }
    ]
}
```

---

## Rule 4: Single Element Pointer Effects with Visual Named Effects

**Use Case**: Visual effect transformations on individual elements based on mouse position (e.g., motion blur, rotation effects, visual filters)

**When to Apply**:
- For creative visual interfaces
- When adding motion blur to interactions
- For rotation-based mouse effects
- When creating dynamic visual feedback

**Pattern**:
```typescript
{
    key: '[SOURCE_KEY]',
    trigger: 'pointerMove',
    params: {
        hitArea: '[HIT_AREA]'
    },
    effects: [
        {
            key: '[TARGET_KEY]',
            namedEffect: {
                type: '[VISUAL_EFFECT_TYPE]',
                [VISUAL_PROPERTIES]
            },
            centeredToTarget: [CENTERED_TO_TARGET],
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:
- `[VISUAL_EFFECT_TYPE]`: 'BlurMouse', 'SpinMouse'
- `[VISUAL_PROPERTIES]`: Effect-specific properties (blur amount, rotation speed, power)
- Other variables same as Rule 1

**Example - Motion Blur Card**:
```typescript
{
    key: 'motion-card',
    trigger: 'pointerMove',
    params: {
        hitArea: 'self'
    },
    effects: [
        {
            key: 'motion-card',
            namedEffect: {
                type: 'BlurMouse',
                blurAmount: 5,
                motionIntensity: 0.7,
                power: 'medium'
            },
            centeredToTarget: true
        }
    ]
}
```

**Example - Spinning Element**:
```typescript
{
    key: 'spin-trigger',
    trigger: 'pointerMove',
    params: {
        hitArea: 'self'
    },
    effects: [
        {
            key: 'spinning-icon',
            namedEffect: {
                type: 'SpinMouse',
                rotationSpeed: 0.5,
                direction: 'clockwise',
                power: 'soft'
            },
            centeredToTarget: false,
            effectId: 'icon-spin'
        }
    ]
}
```

---

## Rule 5: Multi-Element Pointer Parallax Effects with Named Effects

**Use Case**: Coordinated pointer-driven animations across multiple elements creating layered parallax effects (e.g., multi-layer backgrounds, depth effects, coordinated element responses)

**When to Apply**:
- For multi-layer background effects
- When creating depth and parallax interactions
- For coordinated UI element responses
- When building immersive pointer-driven experiences

**Pattern**:
```typescript
{
    key: '[CONTAINER_KEY]',
    trigger: 'pointerMove',
    params: {
        hitArea: '[HIT_AREA]'
    },
    effects: [
        {
            key: '[BACKGROUND_LAYER_KEY]',
            namedEffect: {
                type: '[BACKGROUND_EFFECT_TYPE]',
                distance: { value: [BACKGROUND_DISTANCE], type: '[DISTANCE_UNIT]' },
                power: '[BACKGROUND_POWER]'
            },
            centeredToTarget: [CENTERED_TO_TARGET]
        },
        {
            key: '[MIDGROUND_LAYER_KEY]',
            namedEffect: {
                type: '[MIDGROUND_EFFECT_TYPE]',
                distance: { value: [MIDGROUND_DISTANCE], type: '[DISTANCE_UNIT]' },
                power: '[MIDGROUND_POWER]'
            },
            centeredToTarget: [CENTERED_TO_TARGET]
        },
        {
            key: '[FOREGROUND_LAYER_KEY]',
            namedEffect: {
                type: '[FOREGROUND_EFFECT_TYPE]',
                distance: { value: [FOREGROUND_DISTANCE], type: '[DISTANCE_UNIT]' },
                power: '[FOREGROUND_POWER]'
            },
            centeredToTarget: [CENTERED_TO_TARGET]
        }
    ]
}
```

**Variables**:
- `[CONTAINER_KEY]`: Unique identifier for container element tracking mouse
- `[*_LAYER_KEY]`: Unique identifier for different layer elements
- `[*_EFFECT_TYPE]`: Named effects for each layer (typically movement effects)
- `[*_DISTANCE]`: Movement distance for each layer (creating depth)
- `[*_POWER]`: Power level for each layer response
- Other variables same as previous rules

**Example - Parallax Card Layers**:
```typescript
{
    key: 'parallax-card',
    trigger: 'pointerMove',
    params: {
        hitArea: 'self'
    },
    effects: [
        {
            key: 'bg-layer',
            namedEffect: {
                type: 'AiryMouse',
                distance: { value: 15, type: 'px' },
                axis: 'both',
                power: 'soft'
            },
            centeredToTarget: true
        },
        {
            key: 'mid-layer',
            namedEffect: {
                type: 'TrackMouse',
                distance: { value: 25, type: 'px' },
                axis: 'both',
                power: 'medium'
            },
            centeredToTarget: true
        },
        {
            key: 'fg-layer',
            namedEffect: {
                type: 'BounceMouse',
                distance: { value: 35, type: 'px' },
                axis: 'both',
                power: 'medium'
            },
            centeredToTarget: true
        }
    ]
}
```

**Example - Multi-Layer Hero Section**:
```typescript
{
    key: 'hero-container',
    trigger: 'pointerMove',
    params: {
        hitArea: 'self'
    },
    effects: [
        {
            key: 'hero-bg',
            namedEffect: {
                type: 'AiryMouse',
                distance: { value: 20, type: 'px' },
                axis: 'both',
                power: 'soft'
            },
            centeredToTarget: true
        },
        {
            key: 'hero-content',
            namedEffect: {
                type: 'TrackMouse',
                distance: { value: 40, type: 'px' },
                axis: 'horizontal',
                power: 'medium'
            },
            centeredToTarget: true
        },
        {
            key: 'hero-decorations',
            namedEffect: {
                type: 'ScaleMouse',
                scale: 1.05,
                distance: { value: 60, type: 'px' },
                power: 'medium'
            },
            centeredToTarget: true
        }
    ]
}
```

---

## Rule 6: Coordinated Group Pointer Effects with Named Effects

**Use Case**: Synchronized pointer-driven animations across related elements with different responses (e.g., card grids, navigation menus, interactive galleries)

**When to Apply**:
- For interactive card grids
- When building responsive navigation systems
- For gallery hover effects
- When creating coordinated interface responses

**Pattern**:
```typescript
{
    key: '[CONTAINER_KEY]',
    trigger: 'pointerMove',
    params: {
        hitArea: '[HIT_AREA]'
    },
    effects: [
        {
            key: '[PRIMARY_ELEMENTS_KEY]',
            namedEffect: {
                type: '[PRIMARY_EFFECT_TYPE]',
                [PRIMARY_EFFECT_PROPERTIES]
            },
            centeredToTarget: [PRIMARY_CENTERED]
        },
        {
            key: '[SECONDARY_ELEMENTS_KEY]',
            namedEffect: {
                type: '[SECONDARY_EFFECT_TYPE]',
                [SECONDARY_EFFECT_PROPERTIES]
            },
            centeredToTarget: [SECONDARY_CENTERED]
        }
    ]
}
```

**Variables**:
- `[PRIMARY_ELEMENTS_KEY]`: Unique identifier for primary responsive elements
- `[SECONDARY_ELEMENTS_KEY]`: Unique identifier for secondary responsive elements
- `[PRIMARY_EFFECT_TYPE]`: Named effect for primary elements
- `[SECONDARY_EFFECT_TYPE]`: Named effect for secondary elements
- `[*_EFFECT_PROPERTIES]`: Properties specific to each effect type
- `[*_CENTERED]`: Centering configuration for each element group
- Other variables same as previous rules

**Example - Interactive Card Grid**:
```typescript
{
    key: 'card-grid',
    trigger: 'pointerMove',
    params: {
        hitArea: 'self'
    },
    effects: [
        {
            key: 'grid-card',
            namedEffect: {
                type: 'Tilt3DMouse',
                angle: 12,
                perspective: 1000,
                power: 'soft'
            },
            centeredToTarget: true
        },
        {
            key: 'card-shadow',
            namedEffect: {
                type: 'AiryMouse',
                distance: { value: 20, type: 'px' },
                axis: 'both',
                power: 'soft'
            },
            centeredToTarget: true
        }
    ]
}
```

**Example - Navigation Menu Response**:
```typescript
{
    key: 'nav-container',
    trigger: 'pointerMove',
    params: {
        hitArea: 'self'
    },
    effects: [
        {
            key: 'nav-item',
            namedEffect: {
                type: 'ScaleMouse',
                scale: 1.05,
                distance: { value: 80, type: 'px' },
                power: 'medium'
            },
            centeredToTarget: true
        },
        {
            key: 'nav-indicator',
            namedEffect: {
                type: 'TrackMouse',
                distance: { value: 15, type: 'px' },
                axis: 'horizontal',
                power: 'hard'
            },
            centeredToTarget: false
        }
    ]
}
```

---

## Rule 7: Global Cursor Follower Effects with Named Effects

**Use Case**: Page-wide cursor following elements that respond to mouse movement anywhere (e.g., custom cursors, global decorative followers, interactive overlays)

**When to Apply**:
- For custom cursor implementations
- When creating global interactive overlays
- For page-wide decorative followers
- When building immersive cursor experiences

**Pattern**:
```typescript
{
    key: '[FOLLOWER_KEY]',
    trigger: 'pointerMove',
    params: {
        hitArea: 'root'
    },
    effects: [
        {
            namedEffect: {
                type: '[FOLLOWER_EFFECT_TYPE]',
                distance: { value: [FOLLOWER_DISTANCE], type: '[DISTANCE_UNIT]' },
                [FOLLOWER_PROPERTIES]
            },
            centeredToTarget: false,
            effectId: '[FOLLOWER_EFFECT_ID]'
        }
    ]
}
```

**Variables**:
- `[FOLLOWER_KEY]`: Unique identifier for cursor follower element
- `[FOLLOWER_EFFECT_TYPE]`: 'TrackMouse', 'AiryMouse', 'BounceMouse'
- `[FOLLOWER_DISTANCE]`: Distance/lag for follower (0 for perfect following)
- `[FOLLOWER_PROPERTIES]`: Additional effect properties
- `[FOLLOWER_EFFECT_ID]`: Unique identifier for the follower effect
- Other variables same as previous rules

**Example - Custom Cursor Follower**:
```typescript
{
    key: 'custom-cursor',
    trigger: 'pointerMove',
    params: {
        hitArea: 'root'
    },
    effects: [
        {
            namedEffect: {
                type: 'TrackMouse',
                distance: { value: 0, type: 'px' },
                axis: 'both',
                power: 'hard'
            },
            centeredToTarget: false,
            effectId: 'global-cursor'
        }
    ]
}
```

**Example - Floating Decoration Follower**:
```typescript
{
    key: 'floating-decoration',
    trigger: 'pointerMove',
    params: {
        hitArea: 'root'
    },
    effects: [
        {
            namedEffect: {
                type: 'AiryMouse',
                distance: { value: 50, type: 'px' },
                axis: 'both',
                power: 'soft'
            },
            centeredToTarget: false,
            effectId: 'decoration-follower'
        }
    ]
}
```

---

## Advanced Patterns and Combinations

### Responsive Pointer Effects
Adjusting pointer sensitivity based on device capabilities:

```typescript
{
    key: 'responsive-element',
    trigger: 'pointerMove',
    conditions: ['supports-hover', 'desktop-only'],
    params: {
        hitArea: 'self'
    },
    effects: [
        {
            key: 'responsive-element',
            namedEffect: {
                type: 'Tilt3DMouse',
                angle: 20,
                perspective: 800,
                power: 'medium'
            },
            centeredToTarget: true
        }
    ]
},
// Simplified version for touch devices
{
    key: 'responsive-element',
    trigger: 'pointerMove',
    conditions: ['touch-device'],
    params: {
        hitArea: 'self'
    },
    effects: [
        {
            key: 'responsive-element',
            namedEffect: {
                type: 'ScaleMouse',
                scale: 1.02,
                power: 'soft'
            },
            centeredToTarget: true
        }
    ]
}
```

### Contextual Hit Areas
Different hit areas for different interaction contexts:

```typescript
// Local interaction - mouse must be over element
{
    key: 'local-card',
    trigger: 'pointerMove',
    params: {
        hitArea: 'self'
    },
    effects: [
        {
            key: 'local-card',
            namedEffect: {
                type: 'Tilt3DMouse',
                angle: 15,
                power: 'medium'
            },
            centeredToTarget: true
        }
    ]
},
// Global interaction - responds to mouse anywhere
{
    key: 'global-background',
    trigger: 'pointerMove',
    params: {
        hitArea: 'root'
    },
    effects: [
        {
            key: 'ambient-element',
            namedEffect: {
                type: 'AiryMouse',
                distance: { value: 30, type: 'px' },
                power: 'soft'
            },
            centeredToTarget: false
        }
    ]
}
```

### Axis-Constrained Effects
Controlling movement direction for specific design needs:

```typescript
{
    key: 'constrained-container',
    trigger: 'pointerMove',
    params: {
        hitArea: 'self'
    },
    effects: [
        {
            key: 'horizontal-slider',
            namedEffect: {
                type: 'TrackMouse',
                distance: { value: 100, type: 'px' },
                axis: 'horizontal',
                power: 'medium'
            },
            centeredToTarget: true
        },
        {
            key: 'vertical-indicator',
            namedEffect: {
                type: 'ScaleMouse',
                scale: 1.2,
                distance: { value: 150, type: 'px' },
                axis: 'vertical',
                power: 'medium'
            },
            centeredToTarget: true
        }
    ]
}
```

---

## Best Practices for PointerMove Interactions

### Performance Guidelines
1. **Use hardware-accelerated properties** - prefer transforms over position changes
2. **Limit simultaneous pointer effects** - too many can cause performance issues
3. **Test on various devices** - pointer sensitivity varies across hardware

### Hit Area Guidelines
1. **Use `hitArea: 'self'`** for local element interactions
2. **Use `hitArea: 'root'`** for global cursor followers
3. **Consider container boundaries** when choosing hit areas
4. **Test hit area responsiveness** across different screen sizes

### Centering Guidelines  
1. **Set `centeredToTarget: true`** when target differs from source
2. **Use `centeredToTarget: false`** for cursor followers
3. **Test centering behavior** with different element sizes
4. **Consider responsive design** when setting centering

### User Experience Guidelines
1. **Keep pointer effects subtle** to avoid overwhelming users
2. **Ensure effects enhance rather than distract** from content
3. **Provide visual feedback** that feels natural and responsive
4. **Test with actual users** to validate interaction quality

### Accessibility Considerations
1. **Respect `prefers-reduced-motion`** for all pointer animations
2. **Ensure touch device compatibility** with appropriate alternatives
3. **Don't rely solely on pointer effects** for important interactions
4. **Provide keyboard alternatives** for interactive elements

### Common Use Cases by Pattern

**Single Element 3D Effects (Rule 1)**:
- Interactive product cards
- 3D showcase elements
- Immersive button interactions
- Portfolio item presentations

**Movement Followers (Rule 2)**:
- Cursor follower elements
- Floating decorative elements
- Responsive UI indicators
- Interactive overlays

**Scale & Deformation (Rule 3)**:
- Organic interface elements
- Interactive morphing shapes
- Creative scaling buttons
- Blob-like interactions

**Visual Effects (Rule 4)**:
- Creative interface elements
- Motion blur interactions
- Spinning decorative elements
- Dynamic visual feedback

**Multi-Element Parallax (Rule 5)**:
- Layered background effects
- Depth-based interactions
- Immersive hero sections
- Complex scene responses

**Group Coordination (Rule 6)**:
- Interactive card grids
- Navigation menu systems
- Gallery hover effects
- Coordinated UI responses

**Global Followers (Rule 7)**:
- Custom cursor implementations
- Page-wide decorative elements
- Global interactive overlays
- Immersive cursor experiences

### Troubleshooting Common Issues

**Poor pointer responsiveness**:
- Check `power` settings (soft/medium/hard)
- Verify `hitArea` configuration
- Test `centeredToTarget` settings
- Ensure target elements are properly positioned

**Performance issues**:
- Reduce number of simultaneous effects
- Use simpler named effects
- Check for CSS conflicts
- Test on lower-end devices

**Unexpected behavior on touch devices**:
- Implement appropriate conditions for touch vs. mouse
- Provide touch-friendly alternatives
- Test pointer events on mobile devices
- Consider disabling complex effects on touch

**Effects not triggering**:
- Verify source element exists and is visible
- Check `data-wix-path` matches CSS selector
- Ensure proper hit area configuration
- Test mouse event propagation

---

These rules provide comprehensive coverage for PointerMove trigger interactions in `@wix/interact`, supporting all hit area configurations, centering options, and named effect types as outlined in the development plan Stage 1.5.
