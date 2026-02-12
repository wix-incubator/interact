# Scroll List Animation Rules for @wix/interact

These rules help generate scroll-driven list animations using the `@wix/interact` library. List animations encompass sticky containers, sticky items, and their content animations, providing comprehensive patterns for modern scroll-driven list interactions including parallax effects, staggered reveals, and progressive content disclosure.

## Rule 1: Sticky Container List Animations with Named Effects

**Use Case**: Animations applied to list containers that are sticky-positioned within their wrapper, using pre-built named effects for smooth scroll-driven transformations (e.g., horizontal sliding galleries, parallax backgrounds, container reveals)

**When to Apply**:

- For sticky container horizontal sliding during scroll
- When creating parallax container effects
- For container-level background transformations
- When using pre-built motion effects for container animations

**Pattern**:

```typescript
{
    key: '[CONTAINER_KEY]',
    trigger: 'viewProgress',
    effects: [
        {
            key: '[CONTAINER_KEY]',
            namedEffect: {
                type: '[CONTAINER_NAMED_EFFECT]'
            },
            rangeStart: { name: 'contain', offset: { type: 'percentage', value: [START_PERCENTAGE] } },
            rangeEnd: { name: 'contain', offset: { type: 'percentage', value: [END_PERCENTAGE] } },
            easing: 'linear',
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:

- `[CONTAINER_KEY]`: Unique identifier for sticky list container
- `[CONTAINER_NAMED_EFFECT]`: Container-level scroll effects ('BgParallax', 'PanScroll', 'MoveScroll', 'ParallaxScroll') or background effects ('BgPan', 'BgZoom', 'BgFade', 'BgReveal')
- `[START_PERCENTAGE]`: Start point in contain range (typically 0)
- `[END_PERCENTAGE]`: End point in contain range (typically 100)
- `[UNIQUE_EFFECT_ID]`: Optional unique identifier

**Example - Horizontal Sliding Gallery Container**:

```typescript
{
    key: 'gallery-container',
    trigger: 'viewProgress',
    effects: [
        {
            key: 'gallery-container',
            namedEffect: {
                type: 'PanScroll'
            },
            rangeStart: { name: 'contain', offset: { type: 'percentage', value: 0 } },
            rangeEnd: { name: 'contain', offset: { type: 'percentage', value: 100 } },
            easing: 'linear',
            effectId: 'gallery-slide'
        }
    ]
}
```

**Example - Parallax Container Background**:

```typescript
{
    key: 'sticky-list-wrapper',
    trigger: 'viewProgress',
    effects: [
        {
            key: 'list-background',
            namedEffect: {
                type: 'BgParallax'
            },
            rangeStart: { name: 'contain', offset: { type: 'percentage', value: 0 } },
            rangeEnd: { name: 'contain', offset: { type: 'percentage', value: 100 } },
            easing: 'linear',
            effectId: 'bg-parallax'
        }
    ]
}
```

---

## Rule 2: Sticky Item List Animations with Named Effects

**Use Case**: Animations on individual list items that are sticky-positioned within the container, using named effects for entrance/exit animations as items enter sticky positioning (e.g., progressive item reveals, item transformation sequences)

**When to Apply**:

- For item entrance/exit animations during sticky phases
- When creating progressive item reveals
- For individual item transformations
- When using pre-built item-level effects

**Pattern**:

```typescript
{
    key: '[ITEM_KEY]',
    trigger: 'viewProgress',
    effects: [
        {
            key: '[ITEM_KEY]',
            namedEffect: {
                type: '[ITEM_NAMED_EFFECT]'
            },
            rangeStart: { name: '[RANGE_TYPE]', offset: { type: 'percentage', value: [START_PERCENTAGE] } },
            rangeEnd: { name: '[RANGE_TYPE]', offset: { type: 'percentage', value: [END_PERCENTAGE] } },
            easing: '[EASING_FUNCTION]',
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:

- `[ITEM_KEY]`: Unique identifier for individual list items
- `[ITEM_NAMED_EFFECT]`: Item-level scroll effects from @wix/motion-presets scroll animations:
  - **Reveal/Fade**: 'FadeScroll', 'BlurScroll', 'RevealScroll', 'ShapeScroll', 'ShuttersScroll'
  - **Movement**: 'MoveScroll', 'SlideScroll', 'PanScroll', 'SkewPanScroll'
  - **Scale**: 'GrowScroll', 'ShrinkScroll', 'StretchScroll'
  - **Rotation**: 'SpinScroll', 'FlipScroll', 'TiltScroll', 'TurnScroll'
  - **3D**: 'ArcScroll', 'Spin3dScroll'
- `[RANGE_TYPE]`: 'entry' for entrance, 'exit' for exit, 'contain' for during sticky, 'cover' for full scroll range
- `[START_PERCENTAGE]`: Range start percentage (0-100)
- `[END_PERCENTAGE]`: Range end percentage (0-100)
- `[EASING_FUNCTION]`: Timing function

**Example - Item Entrance Reveal**:

```typescript
{
    key: 'list-item',
    trigger: 'viewProgress',
    effects: [
        {
            key: 'list-item',
            namedEffect: {
                type: 'RevealScroll',
                direction: 'bottom'
            },
            rangeStart: { name: 'entry', offset: { type: 'percentage', value: 0 } },
            rangeEnd: { name: 'entry', offset: { type: 'percentage', value: 60 } },
            easing: 'ease-out',
            effectId: 'item-reveal'
        }
    ]
}
```

**Example - Item Scale During Sticky**:

```typescript
{
    key: 'sticky-list-item',
    trigger: 'viewProgress',
    effects: [
        {
            key: 'sticky-list-item',
            namedEffect: {
                type: 'GrowScroll'
            },
            rangeStart: { name: 'contain', offset: { type: 'percentage', value: 0 } },
            rangeEnd: { name: 'contain', offset: { type: 'percentage', value: 50 } },
            easing: 'ease-in-out',
            effectId: 'item-grow'
        }
    ]
}
```

---

## Rule 3: Sticky Item List Content Animations with Named Effects

**Use Case**: Animations on content within sticky list items, using named effects with each individual item being the viewProgress trigger (e.g., text reveals within cards, image animations within items, progressive content disclosure)

**When to Apply**:

- For content animations within sticky items
- When creating staggered content reveals
- For text/image animations inside list items
- When coordinating multiple content elements

**Pattern**:

```typescript
{
    key: '[ITEM_CONTAINER_KEY]',
    trigger: 'viewProgress',
    effects: [
        {
            key: '[CONTENT_KEY]',
            namedEffect: {
                type: '[CONTENT_NAMED_EFFECT]'
            },
            rangeStart: { name: '[RANGE_TYPE]', offset: { type: 'percentage', value: [START_PERCENTAGE] } },
            rangeEnd: { name: '[RANGE_TYPE]', offset: { type: 'percentage', value: [END_PERCENTAGE] } },
            easing: '[EASING_FUNCTION]',
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:

- `[ITEM_CONTAINER_KEY]`: Unique identifier for the containing list item
- `[CONTENT_KEY]`: Unique identifier for content within the item (or use `selector` for CSS selector)
- `[CONTENT_NAMED_EFFECT]`: Content-level scroll effects from @wix/motion-presets:
  - **Opacity/Visibility**: 'FadeScroll', 'BlurScroll'
  - **Reveal**: 'RevealScroll', 'ShapeScroll', 'ShuttersScroll'
  - **3D Transforms**: 'TiltScroll', 'FlipScroll', 'ArcScroll', 'TurnScroll', 'Spin3dScroll'
  - **Movement**: 'MoveScroll', 'SlideScroll'
  - **Scale**: 'GrowScroll', 'ShrinkScroll'
- Other variables same as Rule 2

**Example - Staggered Text Content Reveal**:

```typescript
{
    key: 'list-item-1',
    trigger: 'viewProgress',
    effects: [
        {
            key: 'list-item-1',
            selector: '.content-text',
            namedEffect: {
                type: 'FadeScroll'
            },
            rangeStart: { name: 'entry', offset: { type: 'percentage', value: 20 } },
            rangeEnd: { name: 'entry', offset: { type: 'percentage', value: 80 } },
            easing: 'ease-out',
            effectId: 'text-reveal-1'
        }
    ]
},
{
    key: 'list-item-2',
    trigger: 'viewProgress',
    effects: [
        {
            key: 'list-item-2',
            selector: '.content-text',
            namedEffect: {
                type: 'FadeScroll'
            },
            rangeStart: { name: 'entry', offset: { type: 'percentage', value: 20 } },
            rangeEnd: { name: 'entry', offset: { type: 'percentage', value: 80 } },
            easing: 'ease-out',
            effectId: 'text-reveal-2'
        }
    ]
}
```

**Example - Image Animation Within List Item**:

```typescript
{
    key: 'product-card',
    trigger: 'viewProgress',
    effects: [
        {
            key: 'product-card',
            selector: ' .hero-image',
            namedEffect: {
                type: 'RevealScroll'
            },
            rangeStart: { name: 'entry', offset: { type: 'percentage', value: 0 } },
            rangeEnd: { name: 'entry', offset: { type: 'percentage', value: 50 } },
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            effectId: 'product-image-reveal'
        }
    ]
}
```

---

## Rule 4: List Container Keyframe Animations

**Use Case**: Custom scroll-driven container animations using keyframe effects for precise control over sticky container behaviors (e.g., multi-property container transformations, responsive container animations, complex background effects)

**When to Apply**:

- For custom container effects not available in named effects
- When combining multiple CSS properties in container animations
- For responsive container behaviors
- When creating unique container visual effects

**Pattern**:

```typescript
{
    key: '[CONTAINER_KEY]',
    trigger: 'viewProgress',
    effects: [
        {
            key: '[CONTAINER_KEY]',
            keyframeEffect: {
                name: '[UNIQUE_KEYFRAME_EFFECT_NAME]',
                keyframes: [
                    { [CSS_PROPERTY_1]: '[START_VALUE_1]', [CSS_PROPERTY_2]: '[START_VALUE_2]', [CSS_PROPERTY_3]: '[START_VALUE_3]' },
                    { [CSS_PROPERTY_1]: '[MID_VALUE_1]' },
                    { [CSS_PROPERTY_1]: '[END_VALUE_1]', [CSS_PROPERTY_2]: '[END_VALUE_2]', [CSS_PROPERTY_3]: '[END_VALUE_3]' }
                ]
            },
            rangeStart: { name: 'contain', offset: { type: 'percentage', value: [START_PERCENTAGE] } },
            rangeEnd: { name: 'contain', offset: { type: 'percentage', value: [END_PERCENTAGE] } },
            easing: 'linear',
            fill: 'both',
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:

- `[CONTAINER_KEY]`: Unique identifier for list container
- `[UNIQUE_KEYFRAME_EFFECT_NAME]`: unique name for the CSS keyframe effect (can equal `[UNIQUE_EFFECT_ID]` if provided)
- `[CSS_PROPERTY_N]`: CSS property names ('transform', 'filter', 'opacity', 'backgroundColor')
- `[START/MID/END_VALUE_N]`: Keyframe values for each property
- Other variables same as Rule 1

**Example - Multi-Property Container Animation**:

```typescript
{
    key: 'feature-list-container',
    trigger: 'viewProgress',
    effects: [
        {
            key: 'feature-list-container',
            keyframeEffect: {
                name: 'container-slide',
                keyframes: [
                    { transform: 'translateX(0)', filter: 'brightness(1)', backgroundColor: 'rgb(255 255 255 / 0)' },
                    { transform: 'translateX(-50%)', filter: 'brightness(1.2)', backgroundColor: 'rgb(255 255 255 / 0.1)' },
                    { transform: 'translateX(-100%)', filter: 'brightness(1)', backgroundColor: 'rgb(255 255 255 / 0)' }
                ]
            },
            rangeStart: { name: 'contain', offset: { type: 'percentage', value: 0 } },
            rangeEnd: { name: 'contain', offset: { type: 'percentage', value: 100 } },
            easing: 'linear',
            fill: 'both',
            effectId: 'container-slide'
        }
    ]
}
```

**Example - Container Background Transformation**:

```typescript
{
    key: 'gallery-wrapper',
    trigger: 'viewProgress',
    effects: [
        {
            key: 'gallery-background',
            keyframeEffect: {
                name: 'bg-transform',
                keyframes: [
                    { transform: 'scale(1.1) rotate(6deg)', opacity: '0.8', filter: 'hue-rotate(30deg)' },
                    { transform: 'scale(1) rotate(0deg)', opacity: '1', filter: 'hue-rotate(0deg)' }
                ]
            },
            rangeStart: { name: 'contain', offset: { type: 'percentage', value: 0 } },
            rangeEnd: { name: 'contain', offset: { type: 'percentage', value: 100 } },
            easing: 'linear',
            fill: 'both',
            effectId: 'bg-transform'
        }
    ]
}
```

---

## Rule 5: List Item Keyframe Entrance/Exit Animations

**Use Case**: Custom entrance and exit animations for list items using keyframe effects for precise control over item reveals and dismissals (e.g., complex item entrances, item position flow, responsive item animations)

**When to Apply**:

- For complex item entrance effects beyond named effects
- When creating unique item position flows
- For multi-stage item animations
- When coordinating item wrapper with content animations

**Pattern**:

```typescript
{
    key: '[ITEM_KEY]',
    trigger: 'viewProgress',
    effects: [
        {
            key: '[ITEM_KEY]',
            keyframeEffect: {
                name: '[UNIQUE_KEYFRAME_EFFECT_NAME]',
                keyframes: [
                    { [CSS_PROPERTY_1]: '[START_VALUE_1]', [CSS_PROPERTY_2]: '[START_VALUE_2]' },
                    { [CSS_PROPERTY_1]: '[MID_VALUE_1]' },
                    { [CSS_PROPERTY_1]: '[END_VALUE_1]', [CSS_PROPERTY_2]: '[END_VALUE_2]' }
                ]
            },
            rangeStart: { name: '[RANGE_TYPE]', offset: { type: 'percentage', value: [START_PERCENTAGE] } },
            rangeEnd: { name: '[RANGE_TYPE]', offset: { type: 'percentage', value: [END_PERCENTAGE] } },
            easing: '[EASING_FUNCTION]',
            fill: 'both',
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:

- `[ITEM_KEY]`: Unique identifier for individual list items
- `[RANGE_TYPE]`: 'entry', 'exit', or 'contain' depending on animation phase
- `[EASING_FUNCTION]`: Easing function to use
- Other variables same as Rule 4

**Example - Complex Item Entrance**:

```typescript
{
    key: 'timeline-item',
    trigger: 'viewProgress',
    effects: [
        {
            key: 'timeline-item',
            keyframeEffect: {
                name: 'timeline-entrance',
                keyframes: [
                    { opacity: '0', transform: 'translateY(100px) scale(0.8) rotate(5deg)', filter: 'blur(10px)', boxShadow: '0 0 0 rgb(0 0 0 / 0)' },
                    { opacity: '0.5', transform: 'translateY(20px) scale(0.95) rotate(1deg)', filter: 'blur(2px)', boxShadow: '0 10px 20px rgb(0 0 0 / 0.1)' },
                    { opacity: '1', transform: 'translateY(0) scale(1) rotate(0deg)', filter: 'blur(0)', boxShadow: '0 20px 40px rgb(0 0 0 / 0.15)' }
                ]
            },
            rangeStart: { name: 'entry', offset: { type: 'percentage', value: 0 } },
            rangeEnd: { name: 'entry', offset: { type: 'percentage', value: 80 } },
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'both',
            effectId: 'timeline-entrance'
        }
    ]
}
```

**Example - Item Exit Sequence**:

```typescript
{
    key: 'card-item',
    trigger: 'viewProgress',
    effects: [
        {
            key: 'card-item',
            keyframeEffect: {
                name: 'card-exit-6',
                keyframes: [
                    { opacity: '1', transform: 'scale(1) rotate(0deg)', filter: 'brightness(1)' },
                    { opacity: '0.7', transform: 'scale(0.9) rotate(-2deg)', filter: 'brightness(0.8)' },
                    { opacity: '0', transform: 'scale(0.8) rotate(-5deg)', filter: 'brightness(0.6)' }
                ]
            },
            rangeStart: { name: 'exit', offset: { type: 'percentage', value: 20 } },
            rangeEnd: { name: 'exit', offset: { type: 'percentage', value: 100 } },
            easing: 'ease-in',
            fill: 'both',
            effectId: 'card-exit'
        }
    ]
}
```

---

## Rule 6: Staggered List Animations with Custom Timing

**Use Case**: Coordinated animations across multiple list items with each individual item used as the viewProgress trigger and custom timing patterns (e.g., wave animations, linear stagger, exponential stagger, reverse stagger)

**When to Apply**:

- For creating wave-like animation propagation
- When implementing linear or exponential stagger patterns
- For reverse-order animations (exit effects)

**Pattern**:

```typescript
{
    effects: {
        [EFFECT_ID]: {
            [EFFECT_TYPE]: [EFFECT_DEFINITION],
            rangeStart: { name: '[RANGE_TYPE]', offset: { type: 'percentage', value: [START_PERCENTAGE] } },
            rangeEnd: { name: '[RANGE_TYPE]', offset: { type: 'percentage', value: [END_PERCENTAGE] } },
            easing: '[EASING_FUNCTION]'
        }
    },
    interactions: [
        {
            key: '[ITEM_KEY_N]',
            trigger: 'viewProgress',
            effects: [
                {
                    effectId: '[EFFECT_ID]'
                }
            ]
        },
        // ... repeat for each item
    ]
}
```

**Example - Linear Staggered Card Entrance**:

```typescript
{
    effects: {
        'card-entrance': {
            namedEffect: {
                type: 'SlideScroll'
            },
            rangeStart: { name: 'entry', offset: { type: 'percentage', value: 0 } },
            rangeEnd: { name: 'entry', offset: { type: 'percentage', value: 60 } },
            easing: 'linear'
        }
    },
    interactions: [
        {
            key: 'card-1',
            trigger: 'viewProgress',
            effects: [
                {
                    effectId: 'card-entrance'
                }
            ]
        },
        {
            key: 'card-2',
            trigger: 'viewProgress',
            effects: [
                {
                    effectId: 'card-entrance'
                }
            ]
        },
        {
            key: 'card-3',
            trigger: 'viewProgress',
            effects: [
                {
                    effectId: 'card-entrance'
                }
            ]
        },
    ]
}
```

**Example - Exponential Stagger for Dramatic Effect**:

```typescript
{
    effects: {
        'feature-entrance': {
            keyframeEffect: {
                name: 'feature-entrance',
                keyframes: [
                    { opacity: '0', transform: 'translateY(50px) scale(0.9)' },
                    { opacity: '1', transform: 'translateY(0) scale(1)' }
                ]
            },
            rangeStart: { name: 'entry', offset: { type: 'percentage', value: 0 } },
            rangeEnd: { name: 'entry', offset: { type: 'percentage', value: 100 } },
            easing: 'expoOut',
            fill: 'both'
        }
    },
    interactions: [
        {
            key: 'feature-1',
            trigger: 'viewProgress',
            effects: [
                {
                    effectId: 'feature-entrance'
                }
            ]
        },
        {
            key: 'feature-2',
            trigger: 'viewProgress',
            effects: [
                {
                    effectId: 'feature-entrance'
                }
            ]
        },
        {
            key: 'feature-3',
            trigger: 'viewProgress',
            effects: [
                {
                    effectId: 'feature-entrance'
                }
            ]
        },
    ]
}
```

---

## Rule 7: Dynamic Content Animations with Custom Effects

**Use Case**: JavaScript-powered list animations with custom effects for complex interactions that require calculations or dynamic content updates (e.g., scroll counters, progress tracking, data visualization, dynamic text updates)

**When to Apply**:

- For animations requiring complex calculations
- When integrating with data visualization
- For dynamic content updates based on scroll
- When creating interactive scroll-driven counters

**Pattern**:

```typescript
{
    key: '[LIST_CONTAINER_KEY]',
    trigger: 'viewProgress',
    effects: [
        {
            key: '[DYNAMIC_CONTENT_KEY]',
            customEffect: (element, progress) => {
                // progress is 0-1 representing scroll position within range
                [CUSTOM_CALCULATION_LOGIC]
                [DYNAMIC_CONTENT_UPDATE]
                [VISUAL_PROPERTY_UPDATES]
            },
            rangeStart: { name: '[RANGE_TYPE]', offset: { type: 'percentage', value: [START_PERCENTAGE] } },
            rangeEnd: { name: '[RANGE_TYPE]', offset: { type: 'percentage', value: [END_PERCENTAGE] } },
            fill: 'both',
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:

- `[LIST_CONTAINER_KEY]`: Unique identifier for list or section containing dynamic content
- `[DYNAMIC_CONTENT_KEY]`: Unique identifier for elements that will be dynamically updated
- `[CUSTOM_CALCULATION_LOGIC]`: JavaScript calculations based on progress
- `[DYNAMIC_CONTENT_UPDATE]`: Code to update element content
- `[VISUAL_PROPERTY_UPDATES]`: Code to update visual properties

**Example - Scroll-Driven Counter in List**:

```typescript
{
    key: 'stats-list-container',
    trigger: 'viewProgress',
    effects: [
        {
            key: 'stat-counter',
            customEffect: (element, progress) => {
                const targetValue = parseInt(element.dataset.targetValue) || 100;
                const currentValue = Math.floor(targetValue * progress);
                const percentage = Math.floor(progress * 100);

                // Update counter text
                element.textContent = currentValue.toLocaleString();

                // Update visual properties based on progress
                element.style.color = `hsl(${progress * 120}, 70%, 50%)`; // Green to red progression
                element.style.transform = `scale(${0.8 + progress * 0.2})`; // Subtle scale effect

                // Update progress bar if exists
                const progressBar = element.querySelector('.progress-bar');
                if (progressBar) {
                    progressBar.style.width = `${percentage}%`;
                }
            },
            rangeStart: { name: 'entry', offset: { type: 'percentage', value: 0 } },
            rangeEnd: { name: 'exit', offset: { type: 'percentage', value: 100 } },
            fill: 'both',
            effectId: 'stats-counter'
        }
    ]
}
```

**Example - Interactive List Progress Tracking**:

```typescript
{
    key: 'task-list',
    trigger: 'viewProgress',
    effects: [
        {
            key: 'task-item',
            customEffect: (element, progress) => {
                const items = element.closest('interact-element')?.querySelectorAll('.task-item') || [];
                const totalItems = items.length;
                const elementIndex = Array.from(items).indexOf(element);

                // Calculate staggered progress for each item
                const itemStartProgress = elementIndex / totalItems;
                const itemEndProgress = (elementIndex + 1) / totalItems;

                // Calculate individual item progress
                let itemProgress = 0;
                if (progress > itemStartProgress) {
                    itemProgress = Math.min(1, (progress - itemStartProgress) / (itemEndProgress - itemStartProgress));
                }

                // Update visual state
                const checkbox = element.querySelector('.task-checkbox');
                const taskText = element.querySelector('.task-text');

                if (itemProgress > 0.5) {
                    element.classList.add('active');
                    checkbox.style.transform = `scale(${0.8 + itemProgress * 0.4})`;
                    checkbox.style.opacity = itemProgress;
                }

                if (itemProgress > 0.8) {
                    element.classList.add('completed');
                    taskText.style.textDecoration = 'line-through';
                    taskText.style.opacity = '0.7';
                }

                // Update overall progress indicator
                const progressIndicator = document.querySelector('#overall-progress');
                if (progressIndicator && elementIndex === 0) {
                    progressIndicator.style.width = `${progress * 100}%`;
                    progressIndicator.textContent = `${Math.floor(progress * 100)}% Complete`;
                }
            },
            rangeStart: { name: 'cover', offset: { type: 'percentage', value: 0 } },
            rangeEnd: { name: 'cover', offset: { type: 'percentage', value: 100 } },
            fill: 'both',
            effectId: 'task-progress'
        }
    ]
}
```

---

## Advanced Patterns and Combinations

### Multi-Layer List Coordination

Coordinating container, items, and content simultaneously:

```typescript
{
    key: 'complex-list-section',
    trigger: 'viewProgress',
    effects: [
        // Background layer
        {
            key: 'list-background',
            keyframeEffect: {
                name: 'background-parallax',
                keyframes: [
                    { transform: 'scale(1.1) translateY(0)', filter: 'blur(0)' },
                    { transform: 'scale(1) translateY(-50px)', filter: 'blur(2px)' }
                ]
            },
            rangeStart: { name: 'cover', offset: { type: 'percentage', value: 0 } },
            rangeEnd: { name: 'cover', offset: { type: 'percentage', value: 100 } },
            easing: 'linear',
            fill: 'both'
        },
        // Container layer
        {
            key: 'list-container',
            keyframeEffect: {
                name: 'container-slide',
                keyframes: [
                    { transform: 'translateX(0)' },
                    { transform: 'translateX(-50%)' }
                ]
            },
            rangeStart: { name: 'contain', offset: { type: 'percentage', value: 0 } },
            rangeEnd: { name: 'contain', offset: { type: 'percentage', value: 100 } },
            easing: 'linear',
            fill: 'both'
        },
        // Foreground decorations
        {
            key: 'list-decorations',
            keyframeEffect: {
                name: 'decorations-parallax',
                keyframes: [
                    { transform: 'translateY(0)', opacity: '0.8' },
                    { transform: 'translateY(-100px)', opacity: '1' }
                ]
            },
            rangeStart: { name: 'cover', offset: { type: 'percentage', value: 0 } },
            rangeEnd: { name: 'cover', offset: { type: 'percentage', value: 100 } },
            easing: 'linear',
            fill: 'both'
        }
    ]
}
```

### Responsive List Animations

Adaptive patterns based on screen size and device capabilities:

```typescript
// Desktop version with complex effects
{
    key: 'responsive-list',
    trigger: 'viewProgress',
    conditions: ['desktop-only', 'prefers-motion'],
    effects: [
        {
            key: 'list-item',
            keyframeEffect: {
                name: 'list-item-complex',
                keyframes: [
                    { transform: 'translateY(-20px) rotateY(5deg)', boxShadow: '0 20px 40px rgb(0 0 0 / 0.15)' },
                    { transform: 'translateY(0) rotateY(0deg)', boxShadow: '0 0 0 rgb(0 0 0 / 0)' }
                ]
            },
            rangeStart: { name: 'entry', offset: { type: 'percentage', value: 0 } },
            rangeEnd: { name: 'entry', offset: { type: 'percentage', value: 80 } },
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'both'
        }
    ]
},
// Mobile version with simplified effects
{
    key: 'responsive-list',
    trigger: 'viewProgress',
    conditions: ['mobile-only'],
    effects: [
        {
            key: 'list-item',
            keyframeEffect: {
                name: 'list-item-simple',
                keyframes: [
                    { opacity: '0', transform: 'translateY(30px)' },
                    { opacity: '1', transform: 'translateY(0)' }
                ]
            },
            rangeStart: { name: 'entry', offset: { type: 'percentage', value: 0 } },
            rangeEnd: { name: 'entry', offset: { type: 'percentage', value: 60 } },
            easing: 'ease-out',
            fill: 'both'
        }
    ]
}
```

---

## Best Practices for List Scroll Animations

### Performance Guidelines

1. **Use hardware-accelerated properties**: `transform`, `opacity`, `filter` for smooth animations
2. **Limit concurrent animations**: Avoid animating too many items simultaneously
3. **Use position:sticky for scrolling effects**: Animate elements while they're stuck in position and not scrolling with the page
4. **Consider `will-change` property**: When doing complex style animations inside custom effects that the browser can not predict automatically

### Range Selection Guidelines

1. **Container animations**: Use `contain` range for sticky container effects
2. **Item entrance**: Use `entry` range (0-60%) for natural reveals
3. **Item exit**: Use `exit` range (20-100%) for smooth dismissals
4. **Content coordination**: Use same timeline with `cover`/`contain` range and staggered offsets, or use a different timeline per item with same range and offsets

### User Experience Guidelines

1. **Keep animations subtle**: Avoid overwhelming users with excessive motion
2. **Maintain content readability**: Ensure text remains legible during animations
3. **Provide reduced motion alternatives**: Respect `prefers-reduced-motion` setting

### Accessibility Considerations

1. **Respect motion preferences**: Include `prefers-motion` conditions
2. **Provide keyboard navigation**: Ensure list remains navigable during animations
3. **Maintain focus management**: Don't break focus states with animations
4. **Ensure content accessibility**: Keep content accessible throughout animation states

### Common Use Cases by Pattern

**Sticky Container (Rule 1)**:

- Horizontal scrolling galleries
- Timeline navigation
- Product showcase carousels
- Feature comparison tables

**Sticky Items (Rule 2)**:

- Progressive story reveals
- Step-by-step processes
- Card-based layouts
- Interactive portfolios

**Content Animations (Rule 3)**:

- Text reveals within cards
- Image animations in galleries
- Icon animations in feature lists
- Progressive data visualization

**Keyframe Effects (Rules 4-5)**:

- Complex brand animations
- Multi-property transformations
- Responsive design adaptations
- Advanced visual effects

**Staggered Animations (Rule 6)**:

- Team member introductions
- Product grid reveals
- Feature list presentations
- Testimonial carousels

**Dynamic Content (Rule 7)**:

- Statistics counters
- Progress tracking
- Data visualization
- Interactive dashboards
