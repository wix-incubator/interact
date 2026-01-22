---
name: Motion E2E Testing
overview: "Set up Playwright-based E2E test infrastructure for the @wix/motion package with dedicated test fixture pages. The plan is divided into phases: infrastructure setup, test fixtures creation, test scaffolding with titles, and incremental test implementation per suite."
todos:
  - id: install-playwright
    content: Install Playwright dependencies and add scripts to packages/motion/package.json
    status: pending
  - id: playwright-config
    content: Create playwright.config.ts in packages/motion with projects, webServer, and reporter settings
    status: pending
  - id: test-fixtures-vite
    content: Create Vite config for test fixtures server in packages/motion/e2e/fixtures/
    status: pending
  - id: test-fixtures-time-based
    content: Create test fixture page for time-based animations (hover, click, timing)
    status: pending
  - id: test-fixtures-scroll
    content: Create test fixture page for scroll-driven animations (view-enter, view-progress, scrub)
    status: pending
  - id: test-fixtures-pointer
    content: Create test fixture page for pointer-driven animations (axis, composite)
    status: pending
  - id: test-fixtures-animation-group
    content: Create test fixture page for AnimationGroup API (lifecycle, progress, callbacks)
    status: pending
  - id: test-fixtures-css
    content: Create test fixture page for CSS animations (generation, retrieval, fallback)
    status: pending
  - id: test-fixtures-responsive
    content: Create test fixture page for responsive conditions (breakpoints)
    status: pending
  - id: test-fixtures-selector
    content: Create test fixture page for selector conditions (nth-child, list container)
    status: pending
  - id: test-utils
    content: Create e2e/utils/ with animation, scroll, and pointer helper functions
    status: pending
  - id: page-objects
    content: Create e2e/pages/ with page objects for each test fixture
    status: pending
  - id: scaffold-time-based
    content: Create time-based-animations.spec.ts with test titles
    status: pending
  - id: scaffold-scroll
    content: Create scroll-animations.spec.ts with test titles
    status: pending
  - id: scaffold-pointer
    content: Create pointer-animations.spec.ts with test titles
    status: pending
  - id: scaffold-animation-group
    content: Create animation-group.spec.ts with test titles
    status: pending
  - id: scaffold-css
    content: Create css-animations.spec.ts with test titles
    status: pending
  - id: scaffold-responsive
    content: Create responsive-conditions.spec.ts with test titles
    status: pending
  - id: scaffold-selector
    content: Create selector-conditions.spec.ts with test titles
    status: pending
  - id: impl-time-based
    content: Implement time-based animations tests (hover, click, timing)
    status: pending
  - id: impl-scroll
    content: Implement scroll-driven animations tests (view-enter, view-progress, scrub)
    status: pending
  - id: impl-pointer
    content: Implement pointer-driven animations tests (axis, composite)
    status: pending
  - id: impl-animation-group
    content: Implement AnimationGroup API tests (lifecycle, progress, callbacks)
    status: pending
  - id: impl-css
    content: Implement CSS animations tests (generation, retrieval, fallback)
    status: pending
  - id: impl-responsive
    content: Implement responsive conditions tests (breakpoints, resize)
    status: pending
  - id: impl-selector
    content: Implement selector conditions tests (nth-child, list container)
    status: pending
  - id: ci-integration
    content: Update CI workflow to run E2E tests with Playwright
    status: pending
isProject: false
---

# E2E Test Infrastructure for @wix/motion

## Context

The `@wix/motion` package provides animation APIs for web applications:

- **Core APIs**: `getWebAnimation()`, `getCSSAnimation()`, `getScrubScene()`, `getAnimation()`
- **AnimationGroup**: Class for managing animation groups with play/pause/reverse/cancel
- **Triggers**: time-based, scroll-driven (`viewProgress`), and pointer-driven (`pointerMove`)
- **Conditions**: Media queries and CSS selectors

Dedicated test fixture pages will be created within the motion package to serve as stable, focused test harnesses.

---

## Phase 1: Infrastructure Setup

### 1.1 Install Playwright Dependencies

Add to [`packages/motion/package.json`](packages/motion/package.json):

```json
"devDependencies": {
  "@playwright/test": "^1.52.0"
}
```

Add scripts:

```json
"scripts": {
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "test:e2e:fixtures": "vite --config e2e/fixtures/vite.config.ts"
}
```

### 1.2 Create Playwright Configuration

Create [`packages/motion/playwright.config.ts`](packages/motion/playwright.config.ts):

- Base URL: `http://localhost:5173` (test fixtures dev server)
- Test directory: `e2e/tests/`
- Web server command: `yarn test:e2e:fixtures`
- Projects: Chromium, Firefox, WebKit
- Reporter: HTML + list
- Retries: 2 on CI

### 1.3 Create Test Fixtures Server

Create [`packages/motion/e2e/fixtures/vite.config.ts`](packages/motion/e2e/fixtures/vite.config.ts):

- Multi-page app with each fixture as an entry point
- Alias `@wix/motion` to local `src/` for testing against source
- Dev server on port 5173

### 1.4 Create Test Utilities

Create [`packages/motion/e2e/utils/`](packages/motion/e2e/utils/) directory with:

| File | Purpose |

|------|---------|

| `animation-helpers.ts` | Functions to wait for animations, check play states, measure progress, get computed styles |

| `scroll-helpers.ts` | Functions to scroll elements into view, simulate scroll gestures, calculate scroll positions |

| `pointer-helpers.ts` | Functions to simulate mouse movements, track pointer position within bounded areas |

### 1.5 Create Page Objects

Create [`packages/motion/e2e/pages/`](packages/motion/e2e/pages/) directory with:

| File | Purpose |

|------|---------|

| `base-fixture-page.ts` | Base page object with common fixture utilities, navigation, window access |

| `time-based-page.ts` | Page object for time-based animation fixture |

| `scroll-page.ts` | Page object for scroll animation fixture |

| `pointer-page.ts` | Page object for pointer animation fixture |

| `animation-group-page.ts` | Page object for AnimationGroup fixture |

| `css-animations-page.ts` | Page object for CSS animations fixture |

| `responsive-page.ts` | Page object for responsive conditions fixture |

| `selector-page.ts` | Page object for selector conditions fixture |

---

## Phase 2: Test Fixtures Creation

Create dedicated HTML/TypeScript pages for each test scenario. Each fixture:

- Imports directly from `@wix/motion` source
- Exposes animation instances to `window` for test assertions
- Has data-testid attributes for reliable element selection
- Includes minimal styling focused on testability

### 2.1 Time-Based Animations Fixture

File: [`packages/motion/e2e/fixtures/time-based.html`](packages/motion/e2e/fixtures/time-based.html) + [`time-based.ts`](packages/motion/e2e/fixtures/time-based.ts)

Elements:

- Hover target element with configurable effect
- Click target element with repeat behavior
- Timing test element with known duration/delay/easing
- Custom keyframe test element

Exposed globals:

- `window.animationGroup`: Current AnimationGroup instance
- `window.lastAnimationState`: Track animation events

### 2.2 Scroll-Driven Animations Fixture

File: [`packages/motion/e2e/fixtures/scroll.html`](packages/motion/e2e/fixtures/scroll.html) + [`scroll.ts`](packages/motion/e2e/fixtures/scroll.ts)

Elements:

- Tall scrollable container (2000px+)
- View-enter target in middle of scroll area
- View-progress target with rangeStart/rangeEnd
- Multiple scroll cards for staggered testing

Exposed globals:

- `window.scrubScene`: Current ScrubScrollScene instance
- `window.getScrollProgress()`: Function to get current progress

### 2.3 Pointer-Driven Animations Fixture

File: [`packages/motion/e2e/fixtures/pointer.html`](packages/motion/e2e/fixtures/pointer.html) + [`pointer.ts`](packages/motion/e2e/fixtures/pointer.ts)

Elements:

- X-axis tracking element
- Y-axis tracking element
- Composite transform element (scaleX + scaleY)
- Bounded pointer area with known dimensions

Exposed globals:

- `window.pointerScene`: Current ScrubPointerScene instance
- `window.getPointerProgress()`: Function to get x/y progress

### 2.4 AnimationGroup API Fixture

File: [`packages/motion/e2e/fixtures/animation-group.html`](packages/motion/e2e/fixtures/animation-group.html) + [`animation-group.ts`](packages/motion/e2e/fixtures/animation-group.ts)

Elements:

- Multiple animated elements in a group
- Progress indicator element
- Play state display

Exposed globals:

- `window.animationGroup`: AnimationGroup instance
- `window.lifecycleEvents`: Array of recorded events
- Control functions: `window.play()`, `window.pause()`, `window.reverse()`, `window.cancel()`

### 2.5 CSS Animations Fixture

File: [`packages/motion/e2e/fixtures/css-animations.html`](packages/motion/e2e/fixtures/css-animations.html) + [`css-animations.ts`](packages/motion/e2e/fixtures/css-animations.ts)

Elements:

- Element for CSS animation generation
- Element with pre-existing CSS animation
- Fallback test element

Exposed globals:

- `window.cssAnimationData`: Generated CSS animation data
- `window.applyCSSAnimation()`: Function to apply CSS animation

### 2.6 Responsive Conditions Fixture

File: [`packages/motion/e2e/fixtures/responsive.html`](packages/motion/e2e/fixtures/responsive.html) + [`responsive.ts`](packages/motion/e2e/fixtures/responsive.ts)

Elements:

- Desktop-only animation target (>1024px)
- Tablet animation target (768-1024px)
- Mobile animation target (<768px)
- Current breakpoint indicator

Exposed globals:

- `window.activeCondition`: Currently active media query condition
- `window.triggerAnimation()`: Function to trigger animations

### 2.7 Selector Conditions Fixture

File: [`packages/motion/e2e/fixtures/selector.html`](packages/motion/e2e/fixtures/selector.html) + [`selector.ts`](packages/motion/e2e/fixtures/selector.ts)

Elements:

- Grid of 10 elements for nth-child testing
- List container with child elements
- Selector indicator showing which condition matched

Exposed globals:

- `window.getMatchedSelectors()`: Function returning which elements matched

---

## Phase 3: Test Scaffolding (Titles Only)

Create test files with `describe` blocks and empty `test()` stubs.

### 3.1 Time-Based Animations Suite

File: [`packages/motion/e2e/tests/time-based-animations.spec.ts`](packages/motion/e2e/tests/time-based-animations.spec.ts)

```
describe('Time-Based Animations')
  describe('Hover Trigger')
    - should start animation on mouse enter
    - should reverse animation on mouse leave
    - should handle rapid hover in/out
  describe('Click Trigger')
    - should start animation on click
    - should repeat animation on subsequent clicks
    - should apply configured delay before animation starts
  describe('Duration and Timing')
    - should respect configured duration
    - should apply easing function correctly
    - should handle custom keyframe effects
```

### 3.2 Scroll-Driven Animations Suite

File: [`packages/motion/e2e/tests/scroll-animations.spec.ts`](packages/motion/e2e/tests/scroll-animations.spec.ts)

```
describe('Scroll-Driven Animations')
  describe('View Enter Trigger')
    - should trigger animation when element enters viewport
    - should handle repeat type for re-entering viewport
  describe('View Progress Trigger')
    - should animate based on scroll progress
    - should respect rangeStart and rangeEnd boundaries
    - should update progress on scroll direction change
  describe('Scrub Scene')
    - should create scrub scene with correct range offsets
    - should report accurate progress percentage
    - should handle destroy cleanup properly
```

### 3.3 Pointer-Driven Animations Suite

File: [`packages/motion/e2e/tests/pointer-animations.spec.ts`](packages/motion/e2e/tests/pointer-animations.spec.ts)

```
describe('Pointer-Driven Animations')
  describe('Pointer Move Trigger')
    - should animate on x-axis based on horizontal mouse position
    - should animate on y-axis based on vertical mouse position
    - should handle axis switching dynamically
  describe('Composite Operations')
    - should apply composite add for independent transforms
    - should handle scaleX/scaleY independently
  describe('Mouse Animation Instance')
    - should return correct progress values
    - should handle destroy and cleanup
```

### 3.4 AnimationGroup API Suite

File: [`packages/motion/e2e/tests/animation-group.spec.ts`](packages/motion/e2e/tests/animation-group.spec.ts)

```
describe('AnimationGroup API')
  describe('Lifecycle Methods')
    - should play animation and resolve ready promise
    - should pause animation immediately
    - should reverse animation direction
    - should cancel animation and reset
  describe('Progress Control')
    - should set progress manually
    - should report accurate progress percentage
    - should handle setPlaybackRate
  describe('Callbacks')
    - should fire onFinish callback when animation completes
    - should handle multiple onFinish subscribers
```

### 3.5 CSS Animations Suite

File: [`packages/motion/e2e/tests/css-animations.spec.ts`](packages/motion/e2e/tests/css-animations.spec.ts)

```
describe('CSS Animations')
  describe('getCSSAnimation')
    - should generate valid CSS animation data
    - should apply correct keyframes to element
  describe('getElementCSSAnimation')
    - should retrieve existing CSS animation from element
    - should return AnimationGroup for CSS animation
  describe('Fallback Behavior')
    - should fallback to CSS when Web Animations unavailable
```

### 3.6 Responsive Conditions Suite

File: [`packages/motion/e2e/tests/responsive-conditions.spec.ts`](packages/motion/e2e/tests/responsive-conditions.spec.ts)

```
describe('Responsive Conditions')
  describe('Desktop Breakpoint')
    - should apply desktop effect above 1024px
    - should not apply tablet/mobile effects
  describe('Tablet Breakpoint')
    - should apply tablet effect between 768px and 1024px
  describe('Mobile Breakpoint')
    - should apply mobile effect below 768px
  describe('Dynamic Resize')
    - should switch effects when viewport resizes
```

### 3.7 Selector Conditions Suite

File: [`packages/motion/e2e/tests/selector-conditions.spec.ts`](packages/motion/e2e/tests/selector-conditions.spec.ts)

```
describe('Selector Conditions')
  describe('nth-child Selectors')
    - should apply pulse effect to even children
    - should apply spin effect to odd children
  describe('List Container')
    - should animate all matching elements in container
    - should respect viewEnter trigger for each element
```

---

## Phase 4: Test Implementation

### 4.1 Implement Time-Based Animations Tests

- Navigate to time-based fixture page
- Implement hover trigger tests using `page.hover()` and `page.locator().hover()`
- Implement click trigger tests with assertions on `window.animationGroup.playState`
- Implement timing tests by measuring animation duration with timestamps
- Assert on `window.lastAnimationState` for event tracking

### 4.2 Implement Scroll-Driven Animations Tests

- Navigate to scroll fixture page
- Implement view-enter tests using `scrollIntoViewIfNeeded()`
- Implement view-progress tests with `page.mouse.wheel()` for scroll simulation
- Call `window.getScrollProgress()` to verify progress values
- Assert on element transform/opacity changes during scroll

### 4.3 Implement Pointer-Driven Animations Tests

- Navigate to pointer fixture page
- Implement axis tests using `page.mouse.move()` with coordinates
- Call `window.getPointerProgress()` to verify x/y progress
- Test composite operations by verifying independent transform values
- Use `getComputedStyle` to verify transform matrix

### 4.4 Implement AnimationGroup API Tests

- Navigate to animation-group fixture page
- Implement lifecycle tests calling `window.play()`, `window.pause()`, `window.reverse()`, `window.cancel()`
- Implement progress tests using `window.animationGroup.getProgress()`
- Assert on `window.lifecycleEvents` array for callback verification
- Test `window.animationGroup.finished` promise resolution

### 4.5 Implement CSS Animations Tests

- Navigate to css-animations fixture page
- Verify `window.cssAnimationData` contains valid keyframes
- Call `window.applyCSSAnimation()` and verify styles applied
- Test fallback behavior by checking animation method used

### 4.6 Implement Responsive Conditions Tests

- Navigate to responsive fixture page
- Use `page.setViewportSize()` to test breakpoints
- Assert on `window.activeCondition` for correct media query
- Call `window.triggerAnimation()` and verify correct effect applies
- Test dynamic resize behavior by changing viewport size

### 4.7 Implement Selector Conditions Tests

- Navigate to selector fixture page
- Scroll grid elements into view
- Call `window.getMatchedSelectors()` to verify selector matching
- Verify different animations apply based on `:nth-child` selector

---

## File Structure

```
packages/motion/
  e2e/
    fixtures/
      vite.config.ts
      index.html              # Entry with links to all fixtures
      time-based.html
      time-based.ts
      scroll.html
      scroll.ts
      pointer.html
      pointer.ts
      animation-group.html
      animation-group.ts
      css-animations.html
      css-animations.ts
      responsive.html
      responsive.ts
      selector.html
      selector.ts
      styles.css              # Shared minimal styles
    pages/
      base-fixture-page.ts
      time-based-page.ts
      scroll-page.ts
      pointer-page.ts
      animation-group-page.ts
      css-animations-page.ts
      responsive-page.ts
      selector-page.ts
    utils/
      animation-helpers.ts
      scroll-helpers.ts
      pointer-helpers.ts
    tests/
      time-based-animations.spec.ts
      scroll-animations.spec.ts
      pointer-animations.spec.ts
      animation-group.spec.ts
      css-animations.spec.ts
      responsive-conditions.spec.ts
      selector-conditions.spec.ts
  playwright.config.ts
```

---

## CI Integration

Update [`.github/workflows/ci.yml`](.github/workflows/ci.yml) to:

- Install Playwright browsers (`npx playwright install --with-deps chromium`)
- Run `yarn workspace @wix/motion test:e2e` after unit tests
- Upload HTML report as artifact on failure
- Cache Playwright browsers for faster CI runs