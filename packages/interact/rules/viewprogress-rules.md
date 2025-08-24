# ViewProgress Trigger Rules for @wix/interact

These rules help generate scroll-driven interactions using the `@wix/interact` library. ViewProgress triggers create scroll-based animations that update continuously as elements move through the viewport, perfect for parallax effects, progress indicators, and scroll-responsive content.

## Rule 1: Range-Based Parallax/Continuous Animation Control with Named Effects

**Use Case**: Continuous scroll-driven animations using pre-built named effects that respond to scroll position (e.g., parallax backgrounds, floating elements, scroll-responsive decorations)

**When to Apply**: 
- For smooth parallax background movements
- When creating scroll-responsive floating elements
- For continuous scroll-driven decorative animations
- When using pre-built motion effects for scroll interactions

**Pattern**:
```typescript
{
    source: '[SOURCE_SELECTOR]',
    trigger: 'viewProgress',
    effects: [
        {
            target: '[TARGET_SELECTOR]',
            namedEffect: {
              type: '[NAMED_EFFECT]',
            },
            rangeStart: { name: '[RANGE_NAME]', offset: { value: [START_PERCENTAGE] } },
            rangeEnd: { name: '[RANGE_NAME]', offset: { value: [END_PERCENTAGE] } },
            easing: '[EASING_FUNCTION]',
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:
- `[SOURCE_SELECTOR]`: CSS selector for element that tracks scroll progress
- `[TARGET_SELECTOR]`: CSS selector for element to animate (can be same as source or different)
- `[NAMED_EFFECT]`: Pre-built effect name (e.g., 'ParallaxScroll', 'PanScroll', 'FlipScroll')
- `[RANGE_NAME]`: 'cover', 'contain', 'entry', 'exit', 'entry-crossing', or 'exit-crossing'
- `[START_PERCENTAGE]`: Start point as percentage (0-100)
- `[END_PERCENTAGE]`: End point as percentage (0-100)
- `[EASING_FUNCTION]`: Timing function (typically 'linear' for smooth scroll effects)
- `[UNIQUE_EFFECT_ID]`: Optional unique identifier

**Example - Background Parallax**:
```typescript
{
    source: '#hero-section',
    trigger: 'viewProgress',
    effects: [
        {
            target: '#hero-background',
            namedEffect: {
                type: 'BgParallax'
            },
            rangeStart: { name: 'cover', offset: { value: 0 } },
            rangeEnd: { name: 'cover', offset: { value: 100 } },
            easing: 'linear'
        }
    ]
}
```

**Example - Floating Element Scroll Response**:
```typescript
{
    source: '#content-section',
    trigger: 'viewProgress',
    effects: [
        {
            target: '.floating-decoration',
            namedEffect: {
                type: 'MoveScroll'
            },
            rangeStart: { name: 'entry', offset: { value: 0 } },
            rangeEnd: { name: 'exit', offset: { value: 100 } },
            easing: 'linear',
            effectId: 'decoration-float'
        }
    ]
}
```

---

## Rule 2: Range-Based Entry Animation Control with Named Effects

**Use Case**: Scroll-driven entrance animations using named effects that start when elements enter the viewport (e.g., content reveals, scroll-driven introductions)

**When to Apply**:
- For scroll-controlled entrance animations
- When elements should reveal gradually as they come into view
- For progressive content disclosure based on scroll
- When using pre-built entrance effects with scroll control

**Pattern**:
```typescript
{
    source: '[SOURCE_SELECTOR]',
    trigger: 'viewProgress',
    effects: [
        {
            target: '[TARGET_SELECTOR]',
            namedEffect: {
                type: '[ENTRANCE_EFFECT]'
            },
            rangeStart: { name: 'entry', offset: { value: [ENTRY_START] } },
            rangeEnd: { name: 'entry', offset: { value: [ENTRY_END] } },
            easing: '[EASING_FUNCTION]',
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:
- `[ENTRANCE_EFFECT]`: Named entrance effect (e.g., 'FadeScroll', 'SlideScroll', 'RevealScroll', 'ShapeScroll')
- `[ENTRY_START]`: Entry animation start percentage (typically 0-30)
- `[ENTRY_END]`: Entry animation end percentage (typically 70-100)
- Other variables same as Rule 1

**Example - Content Reveal on Entry**:
```typescript
{
    source: '#content-block',
    trigger: 'viewProgress',
    effects: [
        {
            target: '#content-block',
            namedEffect: {
                type: 'RevealScroll'
            },
            rangeStart: { name: 'entry', offset: { value: 0 } },
            rangeEnd: { name: 'entry', offset: { value: 60 } },
            easing: 'ease-out'
        }
    ]
}
```

**Example - Progressive Image Reveal**:
```typescript
{
    source: '#image-container',
    trigger: 'viewProgress',
    effects: [
        {
            target: '#feature-image',
            namedEffect: {
                type: 'FadeScroll'
            },
            rangeStart: { name: 'entry', offset: { value: 20 } },
            rangeEnd: { name: 'entry', offset: { value: 80 } },
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            effectId: 'image-reveal'
        }
    ]
}
```

---

## Rule 3: Range-Based Exit Animation Control with Named Effects

**Use Case**: Scroll-driven exit animations using named effects that trigger when elements leave the viewport (e.g., content hiding, scroll-out effects, element dismissals)

**When to Apply**:
- For scroll-controlled exit animations
- When elements should hide gradually as they leave view
- For creating scroll-responsive content dismissals
- When using pre-built exit effects with scroll control

**Pattern**:
```typescript
{
    source: '[SOURCE_SELECTOR]',
    trigger: 'viewProgress',
    effects: [
        {
            target: '[TARGET_SELECTOR]',
            namedEffect: {
                type: '[EXIT_EFFECT]'
            },
            rangeStart: { name: 'exit', offset: { value: [EXIT_START] } },
            rangeEnd: { name: 'exit', offset: { value: [EXIT_END] } },
            easing: '[EASING_FUNCTION]',
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:
- `[EXIT_EFFECT]`: Named exit effect (e.g., 'FadeScroll', 'SlideScroll', 'GrowScroll', 'ShrinkScroll')
- `[EXIT_START]`: Exit animation start percentage (typically 0-30)
- `[EXIT_END]`: Exit animation end percentage (typically 70-100)
- Other variables same as Rule 1

**Example - Content Fade Out on Exit**:
```typescript
{
    source: '#hero-content',
    trigger: 'viewProgress',
    effects: [
        {
            target: '#hero-text',
            namedEffect: {
                type: 'FadeScroll'
            },
            rangeStart: { name: 'exit', offset: { value: 0 } },
            rangeEnd: { name: 'exit', offset: { value: 50 } },
            easing: 'ease-in'
        }
    ]
}
```

**Example - Navigation Hide on Scroll Out**:
```typescript
{
    source: '#main-content',
    trigger: 'viewProgress',
    effects: [
        {
            target: '#floating-nav',
            namedEffect: {
                type: 'SlideScroll'
            },
            rangeStart: { name: 'exit', offset: { value: 20 } },
            rangeEnd: { name: 'exit', offset: { value: 80 } },
            easing: 'ease-in-out',
            effectId: 'nav-hide'
        }
    ]
}
```

---

## Rule 4: Range-Based Parallax/Continuous Animation Control with Keyframe Effects

**Use Case**: Custom scroll-driven animations using keyframe effects for precise control over continuous scroll-responsive animations (e.g., custom parallax movements, complex scroll transformations, multi-property scroll effects)

**When to Apply**:
- For custom parallax effects not available in named effects
- When combining multiple CSS properties in scroll animations
- For precise control over scroll-driven transformations
- When creating unique scroll-responsive visual effects

**Pattern**:
```typescript
{
    source: '[SOURCE_SELECTOR]',
    trigger: 'viewProgress',
    effects: [
        {
            target: '[TARGET_SELECTOR]',
            keyframeEffect: {
                [CSS_PROPERTY_1]: ['[START_VALUE_1]', '[END_VALUE_1]'],
                [CSS_PROPERTY_2]: ['[START_VALUE_2]', '[END_VALUE_2]'],
                [CSS_PROPERTY_3]: ['[START_VALUE_3]', '[END_VALUE_3]']
            },
            rangeStart: { name: '[RANGE_NAME]', offset: { value: [START_PERCENTAGE] } },
            rangeEnd: { name: '[RANGE_NAME]', offset: { value: [END_PERCENTAGE] } },
            easing: '[EASING_FUNCTION]',
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:
- `[CSS_PROPERTY_N]`: CSS property names (e.g., 'transform', 'opacity', 'filter')
- `[START_VALUE_N]`: Starting value for the property
- `[END_VALUE_N]`: Ending value for the property
- Other variables same as Rule 1

**Example - Custom Background Parallax**:
```typescript
{
    source: '#parallax-section',
    trigger: 'viewProgress',
    effects: [
        {
            target: '#parallax-bg',
            keyframeEffect: {
                transform: ['translateY(0)', 'translateY(-200px)'],
                filter: ['brightness(1)', 'brightness(0.8)'],
                opacity: ['0.9', '1', '0.9']
            },
            rangeStart: { name: 'cover', offset: { value: 0 } },
            rangeEnd: { name: 'cover', offset: { value: 100 } },
            easing: 'linear'
        }
    ]
}
```

**Example - Multi-Layer Scroll Effect**:
```typescript
{
    source: '#complex-section',
    trigger: 'viewProgress',
    effects: [
        {
            target: '#background-layer',
            keyframeEffect: {
                transform: ['scale(1.1) translateY(0)', 'scale(1) translateY(-100px)'],
                filter: ['blur(0)', 'blur(2px)']
            },
            rangeStart: { name: 'enter', offset: { value: 0 } },
            rangeEnd: { name: 'exit', offset: { value: 100 } },
            easing: 'linear',
            effectId: 'bg-scroll'
        }
    ]
}
```

---

## Rule 5: Range-Based Entry Animation Control with Keyframe Effects

**Use Case**: Custom scroll-driven entrance animations using keyframe effects for precise control over how elements appear as they enter the viewport (e.g., custom reveal effects, multi-property entrances, unique scroll-in animations)

**When to Apply**:
- For custom entrance effects not available in named effects
- When combining multiple properties in entrance animations
- For brand-specific or unique entry animations
- When creating complex reveal sequences

**Pattern**:
```typescript
{
    source: '[SOURCE_SELECTOR]',
    trigger: 'viewProgress',
    effects: [
        {
            target: '[TARGET_SELECTOR]',
            keyframeEffect: {
                [CSS_PROPERTY_1]: ['[START_VALUE_1]', '[END_VALUE_1]'],
                [CSS_PROPERTY_2]: ['[START_VALUE_2]', '[END_VALUE_2]']
            },
            rangeStart: { name: 'entry', offset: { value: [ENTRY_START] } },
            rangeEnd: { name: 'entry', offset: { value: [ENTRY_END] } },
            easing: '[EASING_FUNCTION]',
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:
Same as Rule 4, with focus on entry range

**Example - Custom Card Entrance**:
```typescript
{
    source: '#card-section',
    trigger: 'viewProgress',
    effects: [
        {
            target: '.product-card',
            keyframeEffect: {
                opacity: ['0', '1'],
                transform: ['translateY(80px) scale(0.9)', 'translateY(0) scale(1)'],
                filter: ['blur(5px)', 'blur(0)']
            },
            rangeStart: { name: 'entry', offset: { value: 0 } },
            rangeEnd: { name: 'entry', offset: { value: 70 } },
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
        }
    ]
}
```

**Example - Text Progressive Reveal**:
```typescript
{
    source: '#text-container',
    trigger: 'viewProgress',
    effects: [
        {
            target: '#main-heading',
            keyframeEffect: {
                opacity: ['0', '1'],
                transform: ['translateX(-50px)', 'translateX(0)'],
                color: ['rgba(0,0,0,0.3)', 'rgba(0,0,0,1)']
            },
            rangeStart: { name: 'entry', offset: { value: 10 } },
            rangeEnd: { name: 'entry', offset: { value: 60 } },
            easing: 'ease-out',
            effectId: 'heading-reveal'
        }
    ]
}
```

---

## Rule 6: Range-Based Exit Animation Control with Keyframe Effects

**Use Case**: Custom scroll-driven exit animations using keyframe effects for precise control over how elements disappear as they leave the viewport (e.g., custom hide effects, multi-property exits, unique scroll-out animations)

**When to Apply**:
- For custom exit effects not available in named effects
- When combining multiple properties in exit animations
- For creating smooth content transitions on scroll out
- When elements need complex hiding sequences

**Pattern**:
```typescript
{
    source: '[SOURCE_SELECTOR]',
    trigger: 'viewProgress',
    effects: [
        {
            target: '[TARGET_SELECTOR]',
            keyframeEffect: {
                [CSS_PROPERTY_1]: ['[START_VALUE_1]', '[END_VALUE_1]'],
                [CSS_PROPERTY_2]: ['[START_VALUE_2]', '[END_VALUE_2]']
            },
            rangeStart: { name: 'exit', offset: { value: [EXIT_START] } },
            rangeEnd: { name: 'exit', offset: { value: [EXIT_END] } },
            easing: '[EASING_FUNCTION]',
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:
Same as Rule 4, with focus on exit range

**Example - Hero Content Exit**:
```typescript
{
    source: '#hero-section',
    trigger: 'viewProgress',
    effects: [
        {
            target: '#hero-content',
            keyframeEffect: {
                opacity: ['1', '0'],
                transform: ['translateY(0) scale(1)', 'translateY(-50px) scale(0.95)'],
                filter: ['blur(0)', 'blur(3px)']
            },
            rangeStart: { name: 'exit', offset: { value: 0 } },
            rangeEnd: { name: 'exit', offset: { value: 60 } },
            easing: 'ease-in'
        }
    ]
}
```

**Example - Navigation Scroll Hide**:
```typescript
{
    source: '#main-header',
    trigger: 'viewProgress',
    effects: [
        {
            target: '#sticky-nav',
            keyframeEffect: {
                transform: ['translateY(0)', 'translateY(-100%)'],
                opacity: ['1', '0.7'],
                backdropFilter: ['blur(10px)', 'blur(0)']
            },
            rangeStart: { name: 'exit', offset: { value: 20 } },
            rangeEnd: { name: 'exit', offset: { value: 80 } },
            easing: 'ease-in-out',
            effectId: 'nav-hide'
        }
    ]
}
```

---

## Rule 7: Range-Based Parallax/Continuous Animation Control with Custom Effects

**Use Case**: JavaScript-powered scroll-driven animations with full programmatic control for complex interactions (e.g., canvas animations, complex calculations, dynamic content updates, interactive scroll effects)

**When to Apply**:
- For animations requiring complex calculations
- When integrating with canvas or WebGL
- For dynamic content updates based on scroll
- When CSS keyframes are insufficient

**Pattern**:
```typescript
{
    source: '[SOURCE_SELECTOR]',
    trigger: 'viewProgress',
    effects: [
        {
            target: '[TARGET_SELECTOR]',
            customEffect: (element, progress, params) => {
                // progress is 0-1 representing scroll position within range
                [CUSTOM_ANIMATION_LOGIC]
            },
            rangeStart: { name: '[RANGE_NAME]', offset: { value: [START_PERCENTAGE] } },
            rangeEnd: { name: '[RANGE_NAME]', offset: { value: [END_PERCENTAGE] } },
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:
- `[CUSTOM_ANIMATION_LOGIC]`: JavaScript code for custom animation
- Other variables same as Rule 1

**Example - Scroll Counter Update**:
```typescript
{
    source: '#stats-section',
    trigger: 'viewProgress',
    effects: [
        {
            target: '#progress-counter',
            customEffect: (element, progress) => {
                const currentValue = Math.floor(progress * 100);
                element.textContent = `${currentValue}%`;
                element.style.color = `hsl(${progress * 120}, 70%, 50%)`;
            },
            rangeStart: { name: 'cover', offset: { value: 0 } },
            rangeEnd: { name: 'cover', offset: { value: 100 } },
            effectId: 'progress-counter'
        }
    ]
}
```

**Example - Complex Particle Animation**:
```typescript
{
    source: '#particle-container',
    trigger: 'viewProgress',
    effects: [
        {
            target: '#particle-canvas',
            customEffect: (element, progress) => {
                const particles = element.querySelectorAll('.particle');
                particles.forEach((particle, index) => {
                    const delay = index * 0.1;
                    const adjustedProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
                    const rotation = adjustedProgress * 360;
                    const scale = 0.5 + (adjustedProgress * 0.5);
                    const translateY = (1 - adjustedProgress) * 200;
                    
                    particle.style.transform = `
                        translateY(${translateY}px) 
                        rotate(${rotation}deg) 
                        scale(${scale})
                    `;
                    particle.style.opacity = adjustedProgress;
                });
            },
            rangeStart: { name: 'entry', offset: { value: 0 } },
            rangeEnd: { name: 'exit', offset: { value: 100 } },
            effectId: 'particle-scroll'
        }
    ]
}
```

---

## Rule 8: Range-Based Entry Animation Control with Custom Effects

**Use Case**: JavaScript-powered entrance animations with programmatic control for complex entry sequences (e.g., dynamic counters, interactive reveals, calculated animations, progressive loading effects)

**When to Apply**:
- For entrance animations requiring calculations
- When creating dynamic content reveals
- For interactive entrance sequences
- When standard keyframes cannot achieve the desired effect

**Pattern**:
```typescript
{
    source: '[SOURCE_SELECTOR]',
    trigger: 'viewProgress',
    effects: [
        {
            target: '[TARGET_SELECTOR]',
            customEffect: (element, progress, params) => {
                // progress is 0-1 representing entry progress
                [ENTRY_ANIMATION_LOGIC]
            },
            rangeStart: { name: 'entry', offset: { value: [ENTRY_START] } },
            rangeEnd: { name: 'entry', offset: { value: [ENTRY_END] } },
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:
- `[ENTRY_ANIMATION_LOGIC]`: JavaScript code for custom entry animation
- Other variables same as previous rules

**Example - Dynamic Text Reveal**:
```typescript
{
    source: '#text-section',
    trigger: 'viewProgress',
    effects: [
        {
            target: '#animated-text',
            customEffect: (element, progress) => {
                const text = element.dataset.fullText || element.textContent;
                const visibleLength = Math.floor(text.length * progress);
                const visibleText = text.substring(0, visibleLength);
                element.textContent = visibleText + (progress < 1 ? '|' : '');
                
                element.style.opacity = Math.min(1, progress * 2);
                element.style.transform = `translateY(${(1 - progress) * 30}px)`;
            },
            rangeStart: { name: 'entry', offset: { value: 0 } },
            rangeEnd: { name: 'entry', offset: { value: 80 } },
            effectId: 'text-reveal'
        }
    ]
}
```

**Example - Progressive Chart Fill**:
```typescript
{
    source: '#chart-container',
    trigger: 'viewProgress',
    effects: [
        {
            target: '.chart-bar',
            customEffect: (element, progress) => {
                const targetHeight = element.dataset.targetHeight || 100;
                const currentHeight = targetHeight * progress;
                const colorIntensity = Math.floor(255 * progress);
                
                element.style.height = `${currentHeight}px`;
                element.style.backgroundColor = `rgb(${255 - colorIntensity}, ${colorIntensity}, 100)`;
                element.style.boxShadow = `0 0 ${progress * 20}px rgba(0, ${colorIntensity}, 255, 0.5)`;
            },
            rangeStart: { name: 'entry', offset: { value: 20 } },
            rangeEnd: { name: 'entry', offset: { value: 90 } },
            effectId: 'chart-fill'
        }
    ]
}
```

---

## Rule 9: Range-Based Exit Animation Control with Custom Effects

**Use Case**: JavaScript-powered exit animations with programmatic control for complex exit sequences (e.g., dynamic hiding effects, calculated dismissals, interactive fade-outs, progressive unloading effects)

**When to Apply**:
- For exit animations requiring calculations
- When creating dynamic content hiding
- For interactive exit sequences
- When standard keyframes cannot achieve the desired exit effect

**Pattern**:
```typescript
{
    source: '[SOURCE_SELECTOR]',
    trigger: 'viewProgress',
    effects: [
        {
            target: '[TARGET_SELECTOR]',
            customEffect: (element, progress, params) => {
                // progress is 0-1 representing exit progress
                [EXIT_ANIMATION_LOGIC]
            },
            rangeStart: { name: 'exit', offset: { value: [EXIT_START] } },
            rangeEnd: { name: 'exit', offset: { value: [EXIT_END] } },
            effectId: '[UNIQUE_EFFECT_ID]'
        }
    ]
}
```

**Variables**:
- `[EXIT_ANIMATION_LOGIC]`: JavaScript code for custom exit animation
- Other variables same as previous rules

**Example - Dissolve Effect Exit**:
```typescript
{
    source: '#content-section',
    trigger: 'viewProgress',
    effects: [
        {
            target: '#dissolving-content',
            customEffect: (element, progress) => {
                const particles = element.querySelectorAll('.content-particle');
                const dissolveProgress = progress;
                
                particles.forEach((particle, index) => {
                    const delay = (index / particles.length) * 0.5;
                    const particleProgress = Math.max(0, (dissolveProgress - delay) / (1 - delay));
                    
                    particle.style.opacity = 1 - particleProgress;
                    particle.style.transform = `
                        translateY(${particleProgress * -100}px) 
                        rotate(${particleProgress * 180}deg)
                        scale(${1 - particleProgress * 0.5})
                    `;
                });
            },
            rangeStart: { name: 'exit', offset: { value: 10 } },
            rangeEnd: { name: 'exit', offset: { value: 90 } },
            effectId: 'dissolve-exit'
        }
    ]
}
```

**Example - Data Visualization Exit**:
```typescript
{
    source: '#data-visualization',
    trigger: 'viewProgress',
    effects: [
        {
            target: '.data-point',
            customEffect: (element, progress) => {
                const dataPoints = element.parentElement.querySelectorAll('.data-point');
                const totalPoints = dataPoints.length;
                const elementIndex = Array.from(dataPoints).indexOf(element);
                
                // Staggered exit based on data point position
                const staggerDelay = (elementIndex / totalPoints) * 0.3;
                const adjustedProgress = Math.max(0, (progress - staggerDelay) / (1 - staggerDelay));
                
                const scale = 1 - (adjustedProgress * 0.8);
                const rotation = adjustedProgress * 720; // Two full rotations
                const opacity = 1 - adjustedProgress;
                
                element.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
                element.style.opacity = opacity;
                element.style.filter = `blur(${adjustedProgress * 10}px)`;
            },
            rangeStart: { name: 'exit', offset: { value: 0 } },
            rangeEnd: { name: 'exit', offset: { value: 80 } },
            effectId: 'data-exit'
        }
    ]
}
```

---

## Advanced Patterns and Combinations

### Multi-Range ViewProgress Effects
Combining different ranges for complex scroll animations:

```typescript
{
    source: '#complex-section',
    trigger: 'viewProgress',
    effects: [
        // Entry phase
        {
            target: '#section-content',
            keyframeEffect: {
                opacity: ['0', '1'],
                transform: ['translateY(50px)', 'translateY(0)']
            },
            rangeStart: { name: 'entry', offset: { value: 0 } },
            rangeEnd: { name: 'entry', offset: { value: 50 } },
            easing: 'ease-out'
        },
        // Cover phase
        {
            target: '#background-element',
            keyframeEffect: {
                transform: ['translateY(0)', 'translateY(-100px)'],
                filter: ['hue-rotate(0deg)', 'hue-rotate(180deg)']
            },
            rangeStart: { name: 'cover', offset: { value: 0 } },
            rangeEnd: { name: 'cover', offset: { value: 100 } },
            easing: 'linear'
        },
        // Exit phase
        {
            target: '#section-content',
            keyframeEffect: {
                opacity: ['1', '0'],
                transform: ['scale(1)', 'scale(0.8)']
            },
            rangeStart: { name: 'exit', offset: { value: 50 } },
            rangeEnd: { name: 'exit', offset: { value: 100 } },
            easing: 'ease-in'
        }
    ]
}
```

### ViewProgress with Conditional Behavior
Responsive scroll animations:

```typescript
{
    source: '#responsive-parallax',
    trigger: 'viewProgress',
    conditions: ['desktop-only', 'prefers-motion'],
    effects: [
        {
            target: '#parallax-bg',
            keyframeEffect: {
                transform: ['translateY(0)', 'translateY(-300px)']
            },
            rangeStart: { name: 'cover', offset: { value: 0 } },
            rangeEnd: { name: 'cover', offset: { value: 100 } },
            easing: 'linear'
        }
    ]
},
// Simplified version for mobile
{
    source: '#responsive-parallax',
    trigger: 'viewProgress',
    conditions: ['mobile-only'],
    effects: [
        {
            target: '#parallax-bg',
            keyframeEffect: {
                opacity: ['1', '0.7']
            },
            rangeStart: { name: 'exit', offset: { value: 0 } },
            rangeEnd: { name: 'exit', offset: { value: 100 } },
            easing: 'linear'
        }
    ]
}
```

### Multiple Element Coordination
Orchestrating multiple elements with viewProgress:

```typescript
{
    source: '#orchestrated-section',
    trigger: 'viewProgress',
    effects: [
        {
            target: '#bg-layer-1',
            keyframeEffect: {
                transform: ['translateY(0)', 'translateY(-50px)']
            },
            rangeStart: { name: 'cover', offset: { value: 0 } },
            rangeEnd: { name: 'cover', offset: { value: 100 } },
            easing: 'linear'
        },
        {
            target: '#bg-layer-2',
            keyframeEffect: {
                transform: ['translateY(0)', 'translateY(-100px)']
            },
            rangeStart: { name: 'cover', offset: { value: 0 } },
            rangeEnd: { name: 'cover', offset: { value: 100 } },
            easing: 'linear'
        },
        {
            target: '#fg-content',
            keyframeEffect: {
                transform: ['translateY(0)', 'translateY(-150px)']
            },
            rangeStart: { name: 'cover', offset: { value: 0 } },
            rangeEnd: { name: 'cover', offset: { value: 100 } },
            easing: 'linear'
        }
    ]
}
```

---

## Best Practices for ViewProgress Interactions

### Performance Guidelines
1. **Use `linear` easing** for most scroll effects to avoid jarring transitions
2. **Prefer `transform`, `filter`, and `opacity`** properties for hardware acceleration

### Range Configuration Guidelines
1. **Use appropriate range names**:
   - `entry`: For animations that happen as element enters viewport
   - `cover`: For animations while element is crossing viewport  
   - `exit`: For animations as element leaves viewport
   - `contain`: For animations while element contains viewport

2. **Offset Guidelines**:
   - **0-100 values**: Represent percentage of the range
   - **Start with broad ranges** (0-100) then refine
   - **Use smaller ranges** (20-80) for more controlled animations
   - **Avoid overlapping ranges** to prevent conflicting animations
   - **Use 0-50% cover range or 0-100% entry range** for entry animations
   - **Use 50-100% cover range or 0-100% exit range** for exit animations

### User Experience Guidelines
1. **Keep scroll animations subtle** to avoid motion sickness
2. **Ensure content remains readable** during animations
3. **Use progressive enhancement** - ensure content works without animations
4. **Test on various devices** for performance and smoothness

### Accessibility Considerations
1. **Respect `prefers-reduced-motion`** for all scroll animations
2. **Provide alternatives** for motion-sensitive users
3. **Don't rely solely on scroll animations** for important content
4. **Ensure keyboard navigation** still works with scroll effects

### Common Use Cases by Pattern

**Parallax/Continuous (Rules 1, 4, 7)**:
- Background image parallax
- Floating decorative elements
- Continuous progress indicators
- Multi-layer depth effects
- Scroll-responsive backgrounds

**Entry Animation (Rules 2, 5, 8)**:
- Content reveals on scroll
- Progressive image loading
- Element introductions
- Staggered content appearance

**Exit Animation (Rules 3, 6, 9)**:
- Hero content fade-out
- Navigation hiding
- Content dismissals
- Scroll-out transitions
- Element cleanup effects

### Troubleshooting Common Issues

**Janky scroll performance**:
- Use hardware-accelerated properties only
- Simplify custom effect calculations
- Test on lower-end devices

**Unexpected animation behavior**:
- Check range configurations match intended behavior
- Verify source element visibility throughout scroll
- Ensure target elements exist and are selectable
- Test range offset values

**Poor visual results**:
- Adjust easing functions for scroll context
- Fine-tune range start/end percentages
- Consider element positioning and layering
- Test across different content heights

---

These rules provide comprehensive coverage for ViewProgress trigger interactions in `@wix/interact`, supporting all range types (entry, cover, contain, exit) and effect types (named, keyframe, custom) as outlined in the development plan Stage 1.4.
