# Entrance Animations

Time-based animations designed to reveal elements with visual impact. These animations bring elements into view with style and are perfect for page loads, modal openings, and progressive disclosure patterns.

## Complete Preset List (24 presets)

### 🌟 Simple Fades

| Animation                | Complexity | Power Levels | Directions | Description              |
| ------------------------ | ---------- | ------------ | ---------- | ------------------------ |
| **[FadeIn](fade-in.md)** | Simple     | -            | -          | Clean opacity transition |
| **[BlurIn](blur-in.md)** | Simple     | ✓            | -          | Blur-to-focus transition |

### 🎯 Directional Movement

| Animation                  | Complexity | Power Levels | Directions | Description                      |
| -------------------------- | ---------- | ------------ | ---------- | -------------------------------- |
| **[SlideIn](slide-in.md)** | Medium     | ✓            | 4-way      | Slide from edge with clip reveal |
| **[GlideIn](glide-in.md)** | Medium     | ✓            | 360°       | Smooth directional movement      |
| **[FloatIn](float-in.md)** | Simple     | -            | 4-way      | Gentle floating movement         |
| **[GrowIn](grow-in.md)**   | Medium     | ✓            | 360°       | Directional scale growth         |

### 🔄 3D Transforms

| Animation                  | Complexity | Power Levels | Directions | Description                    |
| -------------------------- | ---------- | ------------ | ---------- | ------------------------------ |
| **[ArcIn](arc-in.md)**     | Complex    | ✓            | 4-way      | Curved motion with 3D rotation |
| **[FlipIn](flip-in.md)**   | Medium     | ✓            | 4-way      | 3D flip rotation entrance      |
| **[FoldIn](fold-in.md)**   | Complex    | ✓            | 4-way      | 3D fold with perspective       |
| **[TurnIn](turn-in.md)**   | Complex    | ✓            | 4-corner   | Complex 3D corner rotation     |
| **[CurveIn](curve-in.md)** | Complex    | -            | 4-way      | Curved 3D perspective entrance |
| **[TiltIn](tilt-in.md)**   | Complex    | -            | 2-way      | 3D tilt with clip reveal       |

### ⚡ Dynamic & Bouncy

| Animation                    | Complexity | Power Levels | Directions     | Description                       |
| ---------------------------- | ---------- | ------------ | -------------- | --------------------------------- |
| **[BounceIn](bounce-in.md)** | Medium     | ✓            | 5-way + center | Spring-based entrance with bounce |
| **[DropIn](drop-in.md)**     | Simple     | ✓            | -              | Scale-based drop with easing      |
| **[ExpandIn](expand-in.md)** | Medium     | ✓            | 9-way          | Scale from specific origin points |
| **[SpinIn](spin-in.md)**     | Medium     | ✓            | 2-way          | Rotation with scale entrance      |
| **[PunchIn](punch-in.md)**   | Complex    | ✓            | 5-way          | Multi-stage bouncing animation    |

### 🎨 Shape & Clip

| Animation                        | Complexity | Power Levels | Directions | Description                  |
| -------------------------------- | ---------- | ------------ | ---------- | ---------------------------- |
| **[RevealIn](reveal-in.md)**     | Medium     | -            | 4-way      | Clean clip-path reveal       |
| **[ShapeIn](shape-in.md)**       | Medium     | -            | 5 shapes   | Morphing shape reveals       |
| **[ShuttersIn](shutters-in.md)** | Complex    | ✓            | 4-way      | Multi-segment shutter effect |
| **[WinkIn](wink-in.md)**         | Medium     | -            | 2-way      | Accordion-style reveal       |

### 🎪 Special Effects

| Animation                    | Complexity | Power Levels | Directions | Description                     |
| ---------------------------- | ---------- | ------------ | ---------- | ------------------------------- |
| **[CircleIn](circle-in.md)** | Complex    | -            | 2-way      | Circular arc movement           |
| **[GlitchIn](glitch-in.md)** | Medium     | ✓            | 360°       | Modified glide with glitch feel |

## Quick Reference

### By Use Case

#### Modal & Overlay Entrances

**Best**: DropIn, ExpandIn (center), FadeIn  
**Alternative**: BounceIn (center), ShapeIn (circle)

#### Content Block Reveals

**Best**: SlideIn, RevealIn, FadeIn  
**Alternative**: GlideIn, BlurIn

#### Hero & Featured Content

**Best**: ArcIn, PunchIn, TurnIn  
**Alternative**: CurveIn, FlipIn

#### Button & Interactive Elements

**Best**: BounceIn, DropIn, Pulse  
**Alternative**: SpinIn, ExpandIn

#### Navigation & Menu Items

**Best**: SlideIn, GlideIn, FloatIn  
**Alternative**: RevealIn, FadeIn

### By Complexity

#### Simple (Minimal configuration)

- FadeIn, BlurIn, DropIn, FloatIn

#### Medium (Directional controls)

- SlideIn, GlideIn, BounceIn, FlipIn, ExpandIn, SpinIn, GrowIn

#### Complex (Advanced 3D effects)

- ArcIn, FoldIn, TurnIn, CurveIn, TiltIn, PunchIn, CircleIn

### By Performance

#### GPU Optimized (60fps)

- FadeIn, DropIn, ExpandIn, SpinIn, FlipIn

#### Moderate Performance

- SlideIn, GlideIn, BounceIn, ArcIn, RevealIn

#### Resource Intensive

- TurnIn, FoldIn, PunchIn, ShuttersIn, TiltIn

## Common Patterns

### Sequential Reveals

```typescript
// Stagger multiple elements
elements.forEach((el, index) => {
  getWebAnimation(el, {
    type: 'TimeAnimationOptions',
    namedEffect: { type: 'SlideIn', direction: 'bottom' },
    duration: 600,
    delay: index * 150, // 150ms stagger
  }).play();
});
```

### Hero Section Entrance

```typescript
// Dramatic entrance for main content
const heroAnimation = getWebAnimation(heroElement, {
  type: 'TimeAnimationOptions',
  namedEffect: {
    type: 'ArcIn',
    direction: 'bottom',
    power: 'hard',
  },
  duration: 1200,
  easing: 'quintOut',
});
```

### Modal Appearance

```typescript
// Smooth modal entrance
const modalAnimation = getWebAnimation(modal, {
  type: 'TimeAnimationOptions',
  namedEffect: {
    type: 'DropIn',
    power: 'medium',
  },
  duration: 400,
  easing: 'backOut',
});
```

### Performance Monitoring

```typescript
// Performance-aware ArcIn
function createPerformantArc(element, config) {
  const isLowEnd = navigator.hardwareConcurrency < 4;

  if (isLowEnd) {
    // Fallback to simpler animation
    return getWebAnimation(element, {
      type: 'TimeAnimationOptions',
      namedEffect: { type: 'FadeIn' },
      duration: config.duration * 0.8,
    });
  }

  return getWebAnimation(element, {
    type: 'TimeAnimationOptions',
    namedEffect: { type: 'ArcIn', ...config },
    duration: config.duration,
  });
}
```

### Mobile Optimization

```typescript
const isMobile = window.innerWidth < 768;
const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let arcConfig;
if (isReducedMotion) {
  // No motion - instant reveal
  element.style.opacity = '1';
  element.style.transform = 'none';
} else if (isMobile) {
  // Simplified arc for mobile
  arcConfig = {
    type: 'TimeAnimationOptions',
    namedEffect: {
      type: 'ArcIn',
      direction: 'bottom',
      power: 'soft', // Gentler on mobile
    },
    duration: 700, // Faster completion
  };
} else {
  // Full desktop experience
  arcConfig = {
    type: 'TimeAnimationOptions',
    namedEffect: {
      type: 'ArcIn',
      direction: 'bottom',
      power: 'medium',
    },
    duration: 1000,
  };
}
```

## Accessibility

### Reduced Motion Support

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Replace with simple fade
  getWebAnimation(element, {
    type: 'TimeAnimationOptions',
    namedEffect: { type: 'FadeIn' },
    duration: 400,
  }).play();
} else {
  // Full arc animation
  getWebAnimation(element, arcConfig).play();
}
```

## Framework Integration

### React Component

```typescript
import React, { useEffect, useRef, useState } from 'react';
import { getWebAnimation } from '@wix/motion';

interface ArcInProps {
  children: React.ReactNode;
  direction?: 'top' | 'right' | 'bottom' | 'left';
  power?: 'soft' | 'medium' | 'hard';
  duration?: number;
  delay?: number;
  onComplete?: () => void;
}

function ArcIn({
  children,
  direction = 'bottom',
  power = 'medium',
  duration = 1000,
  delay = 0,
  onComplete
}: ArcInProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!elementRef.current) return;

    const animation = getWebAnimation(elementRef.current, {
      type: 'TimeAnimationOptions',
      namedEffect: {
        type: 'ArcIn',
        direction,
        power
      },
      duration,
      delay,
      easing: 'quintOut'
    });

    animation.play().then(() => {
      setIsAnimating(false);
      onComplete?.();
    });

    return () => animation.cancel();
  }, [direction, power, duration, delay, onComplete]);

  return (
    <div
      ref={elementRef}
      className={isAnimating ? 'arc-animating' : ''}
    >
      {children}
    </div>
  );
}
```

### Vue Component with Intersection Observer

```vue
<template>
  <div ref="element" :class="{ 'arc-ready': isReady }">
    <slot />
  </div>
</template>

<script>
import { getWebAnimation } from '@wix/motion';

export default {
  props: {
    direction: { type: String, default: 'bottom' },
    power: { type: String, default: 'medium' },
    duration: { type: Number, default: 1000 },
    trigger: { type: String, default: 'immediate' }, // 'immediate' or 'scroll'
  },

  data() {
    return {
      isReady: false,
      observer: null,
    };
  },

  mounted() {
    if (this.trigger === 'scroll') {
      this.setupIntersectionObserver();
    } else {
      this.startAnimation();
    }
  },

  beforeUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },

  methods: {
    setupIntersectionObserver() {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.startAnimation();
              this.observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 },
      );

      this.observer.observe(this.$refs.element);
    },

    startAnimation() {
      const animation = getWebAnimation(this.$refs.element, {
        type: 'TimeAnimationOptions',
        namedEffect: {
          type: 'ArcIn',
          direction: this.direction,
          power: this.power,
        },
        duration: this.duration,
        easing: 'quintOut',
      });

      animation.play().then(() => {
        this.isReady = true;
        this.$emit('complete');
      });
    },
  },
};
</script>

<style scoped>
.arc-ready {
  /* Additional styles after animation completes */
}
</style>
```

---

**[Back to All Presets](../) | [Browse Other Categories](../../categories/)**
