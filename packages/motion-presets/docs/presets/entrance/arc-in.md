# ArcIn

Sophisticated 3D entrance animation featuring curved motion paths combined with perspective rotation. Creates dramatic, cinematic reveals perfect for hero content and featured elements.

## Overview

**Category**: Entrance  
**Complexity**: Complex  
**Performance**: Moderate (3D transforms)  
**Mobile Friendly**: With optimization

### Best Use Cases

- Hero sections and featured content
- Premium product showcases
- Dramatic page introductions
- High-impact call-to-action elements
- Portfolio pieces and creative presentations

### Target Elements

- Large content blocks and hero sections
- Images and media with significant visual weight
- Primary navigation and key interface elements
- Cards and panels requiring dramatic entrance

## Configuration

### TypeScript Interface

```typescript
export type ArcIn = BaseDataItemLike<'ArcIn'> & {
  direction: EffectFourDirections;
  power?: EffectPower;
};
```

### Parameters

| Parameter   | Type     | Default    | Description                               | Examples                                 |
| ----------- | -------- | ---------- | ----------------------------------------- | ---------------------------------------- |
| `direction` | `string` | `'bottom'` | Direction of arc motion and rotation axis | `'top'`, `'right'`, `'bottom'`, `'left'` |
| `power`     | `string` | `'medium'` | Intensity of rotation and movement        | `'soft'`, `'medium'`, `'hard'`           |

### Power Levels

- **`soft`** - Gentle 15° rotation with subtle arc movement (30% intensity)
- **`medium`** - Balanced 30° rotation with noticeable curved path (60% intensity)
- **`hard`** - Dramatic 45° rotation with pronounced arc motion (100% intensity)

### Directional Support

- **Four directions**: `top`, `right`, `bottom`, `left`
- **Arc behavior**: Each direction creates a unique curved entry path with corresponding rotation
- **3D rotation**: Direction determines the rotation axis and perspective angle

### Motion Characteristics

| Direction | Arc Path                    | Rotation Axis | Visual Effect          |
| --------- | --------------------------- | ------------- | ---------------------- |
| `top`     | Curves down from above      | X-axis        | Forward tilt revealing |
| `right`   | Curves left from right side | Y-axis        | Side rotation entrance |
| `bottom`  | Curves up from below        | X-axis        | Upward tilt reveal     |
| `left`    | Curves right from left side | Y-axis        | Side rotation entrance |

## Usage Examples

### Basic Usage

```typescript
import { getWebAnimation } from '@wix/motion';

const animation = getWebAnimation(element, {
  type: 'TimeAnimationOptions',
  namedEffect: {
    type: 'ArcIn',
    direction: 'bottom',
    power: 'medium',
  },
  duration: 1000,
  easing: 'quintOut',
});

await animation.play();
```

### Power Level Variations

```typescript
// Subtle arc for professional interfaces
const subtleArc = getWebAnimation(element, {
  type: 'TimeAnimationOptions',
  namedEffect: {
    type: 'ArcIn',
    direction: 'right',
    power: 'soft',
  },
  duration: 800,
  easing: 'cubicOut',
});

// Dramatic arc for creative showcases
const dramaticArc = getWebAnimation(element, {
  type: 'TimeAnimationOptions',
  namedEffect: {
    type: 'ArcIn',
    direction: 'bottom',
    power: 'hard',
  },
  duration: 1200,
  easing: 'quartOut',
});
```

### Directional Examples

```typescript
// Hero content from bottom with upward arc
const heroArc = getWebAnimation(heroSection, {
  type: 'TimeAnimationOptions',
  namedEffect: {
    type: 'ArcIn',
    direction: 'bottom',
    power: 'hard',
  },
  duration: 1400,
  easing: 'quintOut',
});

// Side panel from left with rotation
const panelArc = getWebAnimation(sidePanel, {
  type: 'TimeAnimationOptions',
  namedEffect: {
    type: 'ArcIn',
    direction: 'left',
    power: 'medium',
  },
  duration: 900,
  easing: 'cubicOut',
});

// Featured card from top with forward tilt
const cardArc = getWebAnimation(featuredCard, {
  type: 'TimeAnimationOptions',
  namedEffect: {
    type: 'ArcIn',
    direction: 'top',
    power: 'medium',
  },
  duration: 1000,
  easing: 'backOut',
});
```

### Advanced Timing

```typescript
// Cinematic entrance with custom easing
const cinematicArc = getWebAnimation(element, {
  type: 'TimeAnimationOptions',
  namedEffect: {
    type: 'ArcIn',
    direction: 'bottom',
    power: 'hard',
  },
  duration: 1600,
  delay: 300,
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)', // Custom dramatic curve
});
```

## Common Patterns

### Hero Section Sequence

```typescript
// Orchestrated hero entrance
async function revealHero() {
  // Background arc in first
  const bgAnimation = getWebAnimation(heroBackground, {
    type: 'TimeAnimationOptions',
    namedEffect: {
      type: 'ArcIn',
      direction: 'bottom',
      power: 'soft',
    },
    duration: 1200,
  });

  // Title arcs in with more power
  const titleAnimation = getWebAnimation(heroTitle, {
    type: 'TimeAnimationOptions',
    namedEffect: {
      type: 'ArcIn',
      direction: 'bottom',
      power: 'hard',
    },
    duration: 1000,
    delay: 200,
  });

  // Subtitle follows with medium power
  const subtitleAnimation = getWebAnimation(heroSubtitle, {
    type: 'TimeAnimationOptions',
    namedEffect: {
      type: 'ArcIn',
      direction: 'bottom',
      power: 'medium',
    },
    duration: 800,
    delay: 400,
  });

  await Promise.all([bgAnimation.play(), titleAnimation.play(), subtitleAnimation.play()]);
}
```

### Portfolio Grid Reveal

```typescript
// Staggered portfolio items with alternating directions
const portfolioItems = document.querySelectorAll('.portfolio-item');
portfolioItems.forEach((item, index) => {
  const isEven = index % 2 === 0;

  getWebAnimation(item, {
    type: 'TimeAnimationOptions',
    namedEffect: {
      type: 'ArcIn',
      direction: isEven ? 'left' : 'right',
      power: 'medium',
    },
    duration: 1000,
    delay: index * 200,
    easing: 'quintOut',
  }).play();
});
```

### Modal with Arc Entrance

```typescript
// Premium modal with sophisticated entrance
function showPremiumModal() {
  // Backdrop fades in
  const backdropAnimation = getWebAnimation(backdrop, {
    type: 'TimeAnimationOptions',
    namedEffect: { type: 'FadeIn' },
    duration: 400,
  });

  // Modal content arcs in dramatically
  const modalAnimation = getWebAnimation(modalContent, {
    type: 'TimeAnimationOptions',
    namedEffect: {
      type: 'ArcIn',
      direction: 'top',
      power: 'hard',
    },
    duration: 800,
    delay: 200,
    easing: 'backOut',
  });

  return Promise.all([backdropAnimation.play(), modalAnimation.play()]);
}
```

### Product Showcase

```typescript
// Feature product with rotating arc entrance
const productShowcase = getWebAnimation(productContainer, {
  type: 'TimeAnimationOptions',
  namedEffect: {
    type: 'ArcIn',
    direction: 'right',
    power: 'hard',
  },
  duration: 1400,
  easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Elastic feel
});
```

## Performance Tips

- **Monitor 3D performance** - ArcIn uses transform3d which can be intensive
- **Limit concurrent arcs** - Multiple 3D animations can impact frame rate
- **Consider simplified versions** on lower-end devices

### Vestibular Considerations

ArcIn involves rotational motion which may trigger vestibular disorders. Always provide reduced motion alternatives.

## Related Animations

### Same Category

- **[CurveIn](curve-in.md)** - Alternative 3D curved entrance
- **[TurnIn](turn-in.md)** - Complex corner-based 3D rotation
- **[FlipIn](flip-in.md)** - Simpler 3D flip without arc motion

### Other Categories

- **[ArcScroll](../scroll/arc-scroll.md)** - Scroll-driven arc effects
- **[TiltScroll](../scroll/tilt-scroll.md)** - Scroll-based 3D tilting

### Complementary Effects

- **Before**: Loading states, content preparation
- **After**: Hover animations, interaction states
- **Alongside**: Background parallax, subtle scale effects

## Troubleshooting

### Common Issues

- **Choppy animation**: Check for other 3D transforms or reduce power level
- **Element disappears**: Verify parent has perspective and overflow settings
- **Performance issues**: Use performance monitoring and device detection

### Debug Tips

- Use Chrome DevTools "Rendering" tab to monitor frame rate
- Check "Layout Shift" metrics for animation smoothness
- Test on actual mobile devices for performance validation

---

## Interactive Example

▶️ **[Try it in Storybook](../../playground/)** - Experiment with ArcIn directions and power levels

---

**[Back to Entrance Animations](../) | [Back to All Presets](../../)**
