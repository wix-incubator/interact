# Animation Presets Reference

Complete documentation for all 82+ animation presets in Wix Motion, organized by category with detailed configuration options, usage examples, and best practices.

## 📁 Directory Structure

### 🎭 [Entrance Animations](entrance/) (24 presets)

Perfect for element reveals and page transitions.

**Featured Presets**: [FadeIn](entrance/fade-in.md) • [ArcIn](entrance/arc-in.md) • [BounceIn](entrance/bounce-in.md) • [SlideIn](entrance/slide-in.md) • [FlipIn](entrance/flip-in.md)

### 🔄 [Ongoing Animations](ongoing/) (16 presets)

Continuous looping animations for attention and delight.

**Featured Presets**: [Pulse](ongoing/pulse.md) • [Breathe](ongoing/breathe.md) • [Spin](ongoing/spin.md) • [Wiggle](ongoing/wiggle.md) • [Bounce](ongoing/bounce.md)

### 📜 [Scroll Animations](scroll/) (19 presets)

Scroll-driven effects for immersive storytelling.

**Featured Presets**: [ParallaxScroll](scroll/parallax-scroll.md) • [FadeScroll](scroll/fade-scroll.md) • [GrowScroll](scroll/grow-scroll.md) • [RevealScroll](scroll/reveal-scroll.md) • [TiltScroll](scroll/tilt-scroll.md)

### 🖱️ [Mouse Animations](mouse/) (12 presets)

Interactive pointer-driven effects.

**Featured Presets**: [TrackMouse](mouse/track-mouse.md) • [Tilt3DMouse](mouse/tilt-3d-mouse.md) • [ScaleMouse](mouse/scale-mouse.md) • [BlurMouse](mouse/blur-mouse.md)

### 🖼️ [Background Scroll Animations](background-scroll/) (12 presets)

Specialized effects for background media elements.

**Featured Presets**: [BgParallax](background-scroll/bg-parallax.md) • [BgZoom](background-scroll/bg-zoom.md) • [BgFade](background-scroll/bg-fade.md) • [BgFake3D](background-scroll/bg-fake-3d.md)

## 🔍 Quick Reference

### By Complexity

- **Simple**: Single-property animations, minimal configuration
- **Medium**: Multi-property effects with directional controls
- **Complex**: Advanced 3D transforms, multi-stage animations

### By Use Case

- **UI Elements**: Buttons, cards, modals, tooltips
- **Content Blocks**: Text, images, sections, articles
- **Navigation**: Menus, tabs, drawers, overlays
- **Media**: Backgrounds, videos, galleries, hero sections
- **Interactive**: Hover effects, cursor followers, 3D showcases

## 📖 Using This Reference

Each preset page includes:

### 📋 **Overview**

- Animation description and visual behavior
- Complexity level and performance characteristics
- Best use cases and target elements

### ⚙️ **Configuration**

- Required and optional parameters
- Default values and ranges
- TypeScript interface definitions

### 💻 **Code Examples**

- Basic usage with `getWebAnimation()`
- CSS mode with `getCSSAnimation()`
- Advanced configurations and combinations

### 🎯 **Use Cases**

- Common implementation patterns
- Framework integration examples
- Real-world scenarios and tips

### 🔗 **Related Animations**

- Similar effects in the same category
- Complementary animations for sequences
- Alternative approaches for different contexts

## 🛠️ Common Patterns

### Basic Animation Creation

```typescript
import { getWebAnimation } from '@wix/motion';

const animation = getWebAnimation(element, {
  type: 'TimeAnimationOptions',
  namedEffect: { type: 'FadeIn' },
  duration: 800,
  easing: 'easeOut',
});

await animation.play();
```

### Scroll-Driven Animation

```typescript
const animation = getWebAnimation(
  element,
  {
    type: 'ScrubAnimationOptions',
    namedEffect: {
      type: 'ParallaxScroll',
      speed: 0.5,
    },
  },
  {
    trigger: 'view-progress',
    element,
  },
);
```

### Mouse Animation

```typescript
const mouseAnimation = getWebAnimation(
  element,
  {
    type: 'ScrubAnimationOptions',
    namedEffect: {
      type: 'Tilt3DMouse',
      angle: 15,
      perspective: 800,
      power: 'medium',
    },
  },
  {
    trigger: 'pointer-move',
    element: containerElement,
  },
);
```

## 🎮 Interactive Examples

Many presets include live examples in our [Storybook playground](../../playground/). Look for the "▶️ Try it" links in individual preset documentation.

## 📱 Mobile Considerations

Preset documentation includes specific guidance for:

- **Touch Device Compatibility**: Which animations work well on mobile
- **Performance Optimization**: Lighter alternatives for resource-constrained devices
- **Reduced Motion Support**: Accessibility-friendly variations

## 🔄 Migration Guide

When upgrading or changing animations:

- **Version Compatibility**: Breaking changes and migration paths
- **Deprecation Notices**: Sunset timelines for older presets
- **Alternative Recommendations**: Modern replacements for legacy effects

---

**Ready to explore?** Click on any category above to browse individual preset documentation, or use the search function to find specific animations by name or use case.
