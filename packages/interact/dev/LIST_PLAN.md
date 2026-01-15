# General Context

## Available Named Effects for List Animations

**Entrance Effects (Time-based):**

- `FadeIn`, `SlideIn`, `BounceIn`, `ExpandIn`, `RevealIn`, `BlurIn` - basic entrance animations
- `ShuttersIn` - specifically supports `staggered: boolean` property for built-in staggering
- `FlipIn`, `SpinIn`, `GlideIn`, `TurnIn` - dynamic entrance effects
- `ShapeIn` - shape-based reveals with direction control

**Scroll Effects (Progress-based):**

- `FadeScroll`, `BlurScroll`, `SlideScroll`, `RevealScroll`, `ShuttersScroll`, `ShapeScroll` - revealing scroll-driven animations
- `ParallaxScroll`, `MoveScroll`, `GrowScroll`, `ShrinkScroll`, `PanScroll`, `TurnScroll` - movement-based scroll effects
- `SpinScroll`, `TiltScroll`, `ArcScroll`, `Spin3dScroll`, `TiltScroll` - visual transformation effects

**Background Effects:**

- `BgParallax`, `BgFade`, `BgPan`, `BgZoom` - container-level background animations

## Current Architecture Patterns

**ViewProgress ranges**: `entry`, `cover`, `exit`, `contain` for different scroll phases
**Effect types**: `namedEffect`, `keyframeEffect`, `customEffect` for different complexity levels

## Common List-based Scroll Animation Patters

**Sticky Container List Animations** where the container is sticky inside a longer wrapper element, and animated using translation transforms while it's sticky inside the `contain` range
**Sticky Container List Item Animations** where the container is sticky inside a longer wrapper element, and its individual items, or their content, are animated while it's sticky inside the `contain` range using different offsets per item
**Sticky Item List Animations** where the items are sticky inside the container, and are animated into view, or in and out of view, using various effects like transforms, clip-path, or opacity, while using either the container as the timeline with different ranges, or each item uses itself as the timeline with any range, depending on the effect
**Sticky Item List Items' Contents Animations** where either the container or the items are sticky, and content inside the items use their containing item as the timeline for animations applied to them
**Animating while content is stuck in view** uses the `contain` range
**Animating while content enters view** uses the `entry` range
**Animating while content exits view** uses the `exit` range

---

# **LIST SCROLL ANIMATION RULES GENERATION PLAN**

## **Stage 1: Core List Animation Rule Categories (Foundation)**

### **1.1 Sticky Container List Animations**

- **Objective**: Create rules for animations applied to list containers that are sticky-positioned within their wrapper
- **Scope**: Container-level effects during sticky scroll phases
- **Key Patterns**:
  - Container horizontal sliding during sticky phase
  - Container parallax effects during sticky phase
  - Container reveal transitions
  - Background transformations synchronized with scroll

### **1.2 Sticky Item List Animations**

- **Objective**: Generate rules for animations on individual list items that are sticky-positioned within the container
- **Scope**: Item-level effects as items enter/exit sticky positioning
- **Key Patterns**:
  - Item entrance/exit animations
  - Progressive item reveals
  - Item transformation during sticky phases

### **1.3 Sticky Item List Content Animations**

- **Objective**: Generate rules for animations on content of individual list items that are sticky-positioned within the container
- **Scope**: Coordinated animations with calculated delays
- **Key Patterns**:
  - Entry staggering (sequential reveals)
  - Exit staggering (sequential dismissals)
  - Wave-like animation propagation

## **Stage 2: Named Effect Rule Patterns (20 Rules)**

### **2.1 Container-Level Named Effects (5 Rules)**

- **Container Parallax Rule**: `BgParallax`, `BgReveal` for sticky container backgrounds
- **Container Transform Rule**: `PanScroll` for container-level horizontal transformation
- **Container Background Rule**: `BgPan`, `BgSkew` for dynamic backgrounds

### **2.2 List Item Named Effects (10 Rules)**

- **Item Entrance/Exit Rules**: `FadeScroll`, `SlideScroll`, `ShapeScroll`, `RevealScroll`, `MoveScroll`, `ShuttersScroll` for item reveals
- **Item Transformation Rules**: `GrowScroll`, `ShrinkScroll`, `SpinScroll`, `ArcScroll` for item scaling/rotation

### **2.3 Content-Level Named Effects (5 Rules)**

- **Content Reveal Rules**: `RevealScroll`, `FadeScroll` for text/image reveals within items
- **Content Motion Rules**: `TiltScroll`, `FlipScroll` for content dynamics
- **Content Progressive Rules**: Using entrance effects (`GrowScroll`, `FadeScroll`) triggered by scroll progress
- **Content Interactive Rules**: Combined hover + scroll effects for rich interactions

## **Stage 3: Keyframe Effect Rule Patterns (15 Rules)**

### **3.1 Custom Container Keyframes (5 Rules)**

- **Multi-Property Container**: Combined transform, opacity, filter effects
- **Responsive Container**: Different keyframes for mobile vs. desktop
- **Timed Container**: Sequential keyframe phases during sticky periods
- **Background Container**: Complex background position/filter combinations
- **Layout Container**: Subtle spacing/padding adjustments during scroll

### **3.2 Custom Item Keyframes (7 Rules)**

- **Complex Item Entrance**: Multi-property entrance with unique timing
- **Item Position Flow**: Advanced positioning with perspective effects
- **Item Content Coordination**: Synchronizing item wrapper with content animations
- **Item Responsive**: Adaptive keyframes based on screen size
- **Item Interaction**: Hover-enhanced scroll effects
- **Item Exit Sequence**: Complex multi-stage exit animations
- **Item State Transition**: Animations between different list states

### **3.3 Custom Content Keyframes (3 Rules)**

- **Text Progressive**: Letter-by-letter or word-by-word reveals
- **Image Complex**: Multi-layer image animations with masks/filters
- **Media Synchronized**: Video/audio content synchronized with scroll

## **Stage 4: Custom Effect Rule Patterns (12 Rules)**

### **4.1 Stagger Calculation Rules (4 Rules)**

- **Linear Stagger**: Even delays across all items `(index / total) * maxDelay`
- **Exponential Stagger**: Accelerating delays `Math.pow(index / total, 2) * maxDelay`
- **Wave Stagger**: Sine wave-based delays for organic feeling
- **Reverse Stagger**: Reverse-order animations for exit effects

### **4.2 Dynamic Content Rules (4 Rules)**

- **Counter Animation**: Scroll-driven number counting within items
- **Progress Tracking**: Visual progress indicators within list context
- **Interactive Data**: Data visualization updates during scroll
- **Dynamic Text**: Text content that changes based on scroll position

### **4.3 Complex Coordination Rules (4 Rules)**

- **Multi-Layer Lists**: Coordinating background, item, and content layers
- **Cross-Item Effects**: Items affecting neighboring items during animation
- **Conditional Staggering**: Different stagger patterns based on conditions
- **Adaptive Performance**: Reducing complexity based on list length/performance

## **Stage 5: Configuration Factory Patterns (8 Factories)**

### **5.1 List Type Factories (4 Factories)**

- **`createStickyListConfig`**: For sticky-positioned list containers
- **`createStickyItemConfig`**: For lists with sticky-positioned items
- **`createScrollListConfig`**: For standard scroll-through lists
- **`createInfiniteListConfig`**: For infinite scroll list patterns

### **5.2 Animation Style Factories (4 Factories)**

- **`createStaggeredListConfig`**: Parameterized stagger generation
- **`createParallaxListConfig`**: Multi-layer parallax list effects
- **`createProgressiveListConfig`**: Progressive reveal/hide patterns
- **`createInteractiveListConfig`**: Combined hover/scroll list interactions

## **Stage 6: Integration & Responsive Patterns (5 Rules)**

### **6.1 Responsive Adaptation (3 Rules)**

- **Mobile-First Lists**: Simplified animations for touch devices
- **Desktop Enhancement**: Complex effects for desktop hover/scroll
- **Performance Scaling**: Adaptive complexity based on device capabilities

### **6.2 Accessibility & Performance (2 Rules)**

- **Reduced Motion Support**: Alternative patterns for `prefers-reduced-motion`
- **Performance Optimization**: Hardware acceleration and efficient property usage

## **Stage 7: Documentation & Examples (Final)**

### **7.1 Comprehensive Documentation**

- Complete rule documentation with examples
- Use case guides for different list scenarios
- Performance and accessibility guidelines

### **7.2 Real-World Example Configurations**

- E-commerce product lists
- Content feed animations
- Navigation menu dynamics
- Dashboard widget lists

---

# **Success Criteria**

1. **Comprehensive Coverage**: Rules address all major list animation scenarios (container, items, content)
2. **Performance Optimized**: All rules use hardware-accelerated properties and efficient patterns
3. **Responsive Ready**: Rules include mobile/desktop variations and adaptive complexity
4. **Developer Friendly**: Configuration factories reduce boilerplate and enable quick implementation
5. **Accessibility Compliant**: All rules respect motion preferences and performance constraints

---

# **Implementation Approach**

The plan follows a layered approach:

- **Foundation** (Stage 1): Core categories and architectural patterns
- **Named Effects** (Stage 2): Leveraging existing @wix/motion effects with list-specific patterns
- **Custom Keyframes** (Stage 3): Precise control for unique list behaviors
- **Advanced Custom** (Stage 4): JavaScript-powered complex interactions
- **Factories** (Stage 5): Reusable configuration generators
- **Integration** (Stage 6): Responsive and accessibility considerations
- **Documentation** (Stage 7): Complete implementation guidance

Each stage builds upon previous stages, ensuring comprehensive coverage while maintaining practical usability for developers implementing list scroll animations.

---

**Switch to agent mode and type execute (or execute stage 1) to begin.**
