# BounceIn

Spring-based entrance animation with elastic movement and bouncing effects. Creates engaging, playful reveals perfect for call-to-action elements and interactive content.

## Overview

**Category**: Entrance  
**Complexity**: Medium  
**Performance**: GPU Optimized  
**Mobile Friendly**: Yes (with power adjustment)

### Best Use Cases

- Call-to-action buttons and interactive elements
- Notification badges and alerts
- Playful UI elements in games or creative interfaces
- Success states and achievement celebrations

### Target Elements

- Buttons, badges, and small interactive elements
- Icons and symbolic content
- Cards and panels requiring attention
- Modal dialogs and popups

## Configuration

### TypeScript Interface

```typescript
export type BounceIn = BaseDataItemLike<'BounceIn'> & {
  direction: EffectFourDirections | 'center';
  power?: EffectPower;
  distanceFactor?: number;
};
```

### Parameters

| Parameter        | Type     | Default    | Description                          | Examples                                             |
| ---------------- | -------- | ---------- | ------------------------------------ | ---------------------------------------------------- |
| `direction`      | `string` | `'bottom'` | Origin direction for bounce movement | `'top'`, `'right'`, `'bottom'`, `'left'`, `'center'` |
| `power`          | `string` | `'medium'` | Bounce intensity level               | `'soft'`, `'medium'`, `'hard'`                       |
| `distanceFactor` | `number` | `1`        | Movement distance multiplier         | `0.5`, `1`, `2`                                      |

### Power Levels

- **`soft`** - Gentle bounce with minimal movement (10-30% intensity)
- **`medium`** - Balanced bounce effect noticeable but not overwhelming (50-70% intensity)
- **`hard`** - Strong, dramatic bounce with maximum movement (80-100% intensity)

### Directional Support

- **Four directions**: `top`, `right`, `bottom`, `left` - Element bounces in from specified edge
- **Center**: `center` - Element scales and bounces from center point
- **Movement**: Direction determines both initial position and bounce trajectory

## Usage Examples

### Basic Usage

```typescript
import { getWebAnimation } from '@wix/motion';

const animation = getWebAnimation(element, {
  type: 'TimeAnimationOptions',
  namedEffect: {
    type: 'BounceIn',
    direction: 'bottom',
    power: 'medium',
  },
  duration: 800,
  easing: 'easeOut',
});

await animation.play();
```

### Power Level Variations

```typescript
// Subtle bounce for professional interfaces
const subtleBounce = getWebAnimation(element, {
  type: 'TimeAnimationOptions',
  namedEffect: {
    type: 'BounceIn',
    direction: 'bottom',
    power: 'soft',
  },
  duration: 600,
});

// Dramatic bounce for playful elements
const dramaticBounce = getWebAnimation(element, {
  type: 'TimeAnimationOptions',
  namedEffect: {
    type: 'BounceIn',
    direction: 'center',
    power: 'hard',
  },
  duration: 1000,
});
```

### Custom Distance Control

```typescript
// Reduced movement distance
const shortBounce = getWebAnimation(element, {
  type: 'TimeAnimationOptions',
  namedEffect: {
    type: 'BounceIn',
    direction: 'left',
    power: 'medium',
    distanceFactor: 0.5, // Half normal distance
  },
  duration: 700,
});

// Extended movement distance
const longBounce = getWebAnimation(element, {
  type: 'TimeAnimationOptions',
  namedEffect: {
    type: 'BounceIn',
    direction: 'top',
    power: 'hard',
    distanceFactor: 1.5, // 50% more distance
  },
  duration: 900,
});
```

### Directional Examples

```typescript
// Button appearing from right
const buttonBounce = getWebAnimation(button, {
  type: 'TimeAnimationOptions',
  namedEffect: {
    type: 'BounceIn',
    direction: 'right',
    power: 'medium',
  },
  duration: 600,
});

// Modal bouncing from center
const modalBounce = getWebAnimation(modal, {
  type: 'TimeAnimationOptions',
  namedEffect: {
    type: 'BounceIn',
    direction: 'center',
    power: 'soft',
  },
  duration: 500,
});
```

## Common Patterns

### Success State Animation

```typescript
// Bounce in success message
function showSuccessMessage(element) {
  return getWebAnimation(element, {
    type: 'TimeAnimationOptions',
    namedEffect: {
      type: 'BounceIn',
      direction: 'center',
      power: 'hard',
    },
    duration: 800,
    easing: 'backOut',
  });
}
```

### Notification Badge

```typescript
// Attention-grabbing badge entrance
const badgeBounce = getWebAnimation(badge, {
  type: 'TimeAnimationOptions',
  namedEffect: {
    type: 'BounceIn',
    direction: 'top',
    power: 'hard',
  },
  duration: 600,
  easing: 'elasticOut',
});
```

### Sequential Button Reveals

```typescript
// Bounce in action buttons one by one
const actionButtons = document.querySelectorAll('.action-btn');
actionButtons.forEach((btn, index) => {
  getWebAnimation(btn, {
    type: 'TimeAnimationOptions',
    namedEffect: {
      type: 'BounceIn',
      direction: 'bottom',
      power: 'medium',
    },
    duration: 600,
    delay: index * 150, // 150ms stagger
    easing: 'backOut',
  }).play();
});
```

### Modal Dialog with Backdrop

```typescript
// Backdrop fade + modal bounce
async function showModal() {
  // Fade in backdrop first
  const backdropAnimation = getWebAnimation(backdrop, {
    type: 'TimeAnimationOptions',
    namedEffect: { type: 'FadeIn' },
    duration: 300,
  });

  // Bounce in modal content
  const modalAnimation = getWebAnimation(modalContent, {
    type: 'TimeAnimationOptions',
    namedEffect: {
      type: 'BounceIn',
      direction: 'center',
      power: 'medium',
    },
    duration: 500,
    delay: 100,
  });

  await Promise.all([backdropAnimation.play(), modalAnimation.play()]);
}
```

## Related Animations

### Same Category

- **[DropIn](drop-in.md)** - Simpler scale-based alternative
- **[PunchIn](punch-in.md)** - More complex multi-stage bouncing
- **[ExpandIn](expand-in.md)** - Scale-focused without bounce physics

### Other Categories

- **[Bounce](../ongoing/bounce.md)** - Ongoing bouncing animation
- **[Pulse](../ongoing/pulse.md)** - Gentler ongoing attention effect

### Complementary Effects

- **Before**: Loading states, preparation animations
- **After**: Hover effects, interaction feedback
- **Alongside**: Background color changes, shadow effects

## Troubleshooting

### Common Issues

- **Bounce feels too aggressive**: Reduce power level or distanceFactor
- **Animation cuts off**: Ensure parent container has sufficient space
- **Timing feels wrong**: Adjust duration based on element size and context

### Debug Tips

- Use browser timeline tools to analyze bounce curve
- Test with different power levels to find the right feel
- Verify initial element positioning for directional bounces

---

## Interactive Example

▶️ **[Try it in Storybook](../../playground/)** - Experiment with BounceIn directions and power levels

---

**[Back to Entrance Animations](../) | [Back to All Presets](../../)**
