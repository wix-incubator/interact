---
name: Interact E2E Testing
overview: "Set up Playwright-based E2E test infrastructure for the @wix/interact package, with a dedicated test harness app. The plan is divided into phases: infrastructure setup, test harness creation, test scaffolding with titles only, and incremental test implementation per suite."
todos:
  - id: install-playwright
    content: Install Playwright dependencies and add scripts to root package.json
    status: pending
  - id: playwright-config
    content: Create/update playwright.config.ts with interact project configuration
    status: pending
  - id: test-harness-setup
    content: Create e2e/interact/harness/ app with Vite, React, and package dependencies
    status: pending
  - id: test-harness-pages
    content: Create dedicated test pages for each trigger type and feature
    status: pending
  - id: test-utils
    content: Create e2e/interact/utils/ with animation, scroll, pointer, and interaction helpers
    status: pending
  - id: page-objects
    content: Create e2e/interact/pages/ with page objects for each test harness page
    status: pending
  - id: scaffold-hover
    content: Create hover-trigger.spec.ts with test titles
    status: pending
  - id: scaffold-click
    content: Create click-trigger.spec.ts with test titles
    status: pending
  - id: scaffold-view-enter
    content: Create view-enter-trigger.spec.ts with test titles
    status: pending
  - id: scaffold-view-progress
    content: Create view-progress-trigger.spec.ts with test titles
    status: pending
  - id: scaffold-pointer-move
    content: Create pointer-move-trigger.spec.ts with test titles
    status: pending
  - id: scaffold-conditional
    content: Create conditional-effects.spec.ts with test titles
    status: pending
  - id: scaffold-effect-types
    content: Create effect-types.spec.ts with test titles
    status: pending
  - id: scaffold-list-container
    content: Create list-container.spec.ts with test titles
    status: pending
  - id: scaffold-state-mgmt
    content: Create state-management.spec.ts with test titles
    status: pending
  - id: scaffold-react
    content: Create react-integration.spec.ts with test titles
    status: pending
  - id: scaffold-web
    content: Create web-components-integration.spec.ts with test titles
    status: pending
  - id: impl-hover
    content: Implement hover trigger tests (mouse enter/leave, toggle, a11y)
    status: pending
  - id: impl-click
    content: Implement click trigger tests (basic, toggle, keyboard a11y)
    status: pending
  - id: impl-view-enter
    content: Implement view enter tests (once, repeat, alternate, state)
    status: pending
  - id: impl-view-progress
    content: Implement view progress tests (scroll linking, range config)
    status: pending
  - id: impl-pointer-move
    content: Implement pointer move tests (x/y axis, hit area, composite)
    status: pending
  - id: impl-conditional
    content: Implement conditional effects tests (media queries, selectors, resize)
    status: pending
  - id: impl-effect-types
    content: Implement effect types tests (time, transition, keyframe)
    status: pending
  - id: impl-list-container
    content: Implement list container tests (static, dynamic lists)
    status: pending
  - id: impl-state-mgmt
    content: Implement state management tests (toggleEffect, getActiveEffects)
    status: pending
  - id: impl-react
    content: Implement React integration tests (Interaction component, createInteractRef)
    status: pending
  - id: impl-web
    content: Implement Web Components integration tests (interact-element lifecycle)
    status: pending
  - id: ci-integration
    content: Update CI workflow to install Playwright browsers and run E2E tests
    status: pending
isProject: false
---

# E2E Test Infrastructure for @wix/interact

## Context

The `@wix/interact` package is a declarative interaction library providing:

- **9 Triggers**: hover, click, viewEnter, viewProgress, pointerMove, animationEnd, pageVisible, activate, interest
- **3 Effect Types**: TimeEffect (time-based), ScrubEffect (scroll/pointer-linked), TransitionEffect (CSS transitions)
- **Features**: Conditional effects (media/selector), list containers, state management (`toggleEffect`)
- **Integrations**: React (`<Interaction>` component) and Web Components (`<interact-element>`)

A dedicated test harness app will be created at `e2e/interact/harness/` specifically for E2E testing, separate from the demo app which will evolve independently.

---

## Phase 1: Infrastructure Setup

### 1.1 Install Playwright Dependencies

Add to root [`package.json`](package.json):

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
  "test:e2e:interact": "playwright test --project=interact"
}
```

### 1.2 Create Playwright Configuration

Create [`playwright.config.ts`](playwright.config.ts) at workspace root:

- Base URL: `http://localhost:5179` (test harness dev server)
- Test directory: `e2e/interact/tests/`
- Web server command: `yarn workspace @wix/interact-e2e-harness dev`
- Projects: Chromium, Firefox, WebKit
- Reporter: HTML + list
- Retries: 2 on CI

### 1.3 Create Test Harness App

Create [`e2e/interact/harness/`](e2e/interact/harness/) as a minimal Vite + React app dedicated to E2E testing:

**Package Configuration** (`package.json`):

```json
{
  "name": "@wix/interact-e2e-harness",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --port 5179",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@wix/interact": "workspace:*",
    "@wix/motion": "workspace:*",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.5.0",
    "vite": "^6.3.5",
    "typescript": "^5.8.3"
  }
}
```

**Vite Configuration** (`vite.config.ts`):

- React plugin for JSX support
- Dev server on port 5179
- Alias `@wix/interact` to workspace package

### 1.4 Create Test Pages

Create dedicated test pages in `e2e/interact/harness/src/pages/`:

| Page | Route | Purpose | Test IDs |

|------|-------|---------|----------|

| `HoverTestPage.tsx` | `/hover` | Hover trigger scenarios | `hover-target`, `hover-toggle-target` |

| `ClickTestPage.tsx` | `/click` | Click trigger scenarios | `click-target`, `click-toggle-target` |

| `ViewEnterTestPage.tsx` | `/view-enter` | ViewEnter trigger types | `view-once`, `view-repeat`, `view-alternate`, `view-state` |

| `ViewProgressTestPage.tsx` | `/view-progress` | Scroll-linked animations | `scroll-target-{n}`, `scroll-container` |

| `PointerMoveTestPage.tsx` | `/pointer-move` | Pointer-driven animations | `pointer-container`, `pointer-target`, `pointer-composite` |

| `ConditionalTestPage.tsx` | `/conditional` | Media/selector conditions | `desktop-target`, `tablet-target`, `mobile-target` |

| `ListContainerTestPage.tsx` | `/list-container` | List container effects | `list-container`, `list-item-{n}` |

| `StateManagementTestPage.tsx` | `/state` | toggleEffect/getActiveEffects | `state-target`, `toggle-add-btn`, `toggle-remove-btn` |

| `ReactIntegrationTestPage.tsx` | `/react` | React `<Interaction>` component | `interaction-component`, `ref-target` |

| `WebComponentsTestPage.tsx` | `/web` | `<interact-element>` custom element | `interact-element-target` |

Each page should:

- Use `data-testid` attributes for reliable element selection
- Expose interaction controllers to `window` for direct API testing
- Include minimal styling for visual debugging
- Be self-contained with its own `InteractConfig`

### 1.5 Create Test Utilities

Create [`e2e/interact/utils/`](e2e/interact/utils/) directory with:

- `animation-helpers.ts`: Functions to wait for animations, check computed styles, measure transform values
- `scroll-helpers.ts`: Functions to scroll elements into view, simulate scroll gestures with `page.mouse.wheel()`
- `pointer-helpers.ts`: Functions to simulate mouse movements, track pointer position across hit areas
- `interaction-helpers.ts`: Functions to verify interaction states, check active effects via `getActiveEffects()`

### 1.6 Create Page Objects

Create [`e2e/interact/pages/`](e2e/interact/pages/) directory with:

- `base-page.ts`: Base page object with common navigation and utility methods
- `hover-page.ts`: Page object for hover test page elements
- `click-page.ts`: Page object for click test page elements
- `view-enter-page.ts`: Page object for view enter test page elements
- `view-progress-page.ts`: Page object for scroll-driven test page elements
- `pointer-move-page.ts`: Page object for pointer test page elements
- `conditional-page.ts`: Page object for conditional effects test page elements
- `list-container-page.ts`: Page object for list container test page elements
- `state-management-page.ts`: Page object for state management test page elements
- `react-integration-page.ts`: Page object for React integration test page elements
- `web-components-page.ts`: Page object for Web Components test page elements

---

## Phase 2: Test Scaffolding (Titles Only)

Create test files with `describe` blocks and empty `test()` stubs.

### 2.1 Hover Trigger Suite

File: [`e2e/interact/tests/hover-trigger.spec.ts`](e2e/interact/tests/hover-trigger.spec.ts)

```
describe('Hover Trigger')
  describe('Basic Hover')
    - should start animation on mouse enter
    - should reverse animation on mouse leave
    - should handle rapid hover in/out
  describe('Toggle Method')
    - should toggle effect state on hover
    - should maintain toggled state after mouse leave
  describe('Interest Trigger (A11y)')
    - should trigger on focus for keyboard users
    - should behave like hover on mouse interaction
```

### 2.2 Click Trigger Suite

File: [`e2e/interact/tests/click-trigger.spec.ts`](e2e/interact/tests/click-trigger.spec.ts)

```
describe('Click Trigger')
  describe('Basic Click')
    - should start animation on click
    - should repeat animation on subsequent clicks
  describe('Toggle Method')
    - should toggle effect state on click
    - should clear effect state with toggle again
  describe('Activate Trigger (A11y)')
    - should trigger on Enter key press
    - should trigger on Space key press
    - should behave like click on mouse interaction
```

### 2.3 ViewEnter Trigger Suite

File: [`e2e/interact/tests/view-enter-trigger.spec.ts`](e2e/interact/tests/view-enter-trigger.spec.ts)

```
describe('ViewEnter Trigger')
  describe('Once Type')
    - should trigger animation when element enters viewport
    - should not re-trigger when element exits and re-enters
  describe('Repeat Type')
    - should trigger animation on each viewport entry
    - should respect threshold parameter
  describe('Alternate Type')
    - should reverse animation when element exits viewport
    - should play forward when element re-enters
  describe('State Type')
    - should add effect state on viewport enter
    - should remove effect state on viewport exit
```

### 2.4 ViewProgress Trigger Suite

File: [`e2e/interact/tests/view-progress-trigger.spec.ts`](e2e/interact/tests/view-progress-trigger.spec.ts)

```
describe('ViewProgress Trigger')
  describe('Basic Scroll Linking')
    - should animate based on scroll progress
    - should update progress on scroll direction change
  describe('Range Configuration')
    - should respect rangeStart and rangeEnd boundaries
    - should handle percentage offsets correctly
  describe('Multiple Elements')
    - should animate elements independently based on their scroll position
```

### 2.5 PointerMove Trigger Suite

File: [`e2e/interact/tests/pointer-move-trigger.spec.ts`](e2e/interact/tests/pointer-move-trigger.spec.ts)

```
describe('PointerMove Trigger')
  describe('X-Axis')
    - should animate based on horizontal mouse position
    - should update progress as mouse moves left to right
  describe('Y-Axis')
    - should animate based on vertical mouse position
    - should update progress as mouse moves top to bottom
  describe('Hit Area')
    - should track pointer within self bounds
    - should track pointer within root bounds
  describe('Composite Operations')
    - should apply composite add for independent transforms
    - should handle scaleX/scaleY independently
```

### 2.6 Conditional Effects Suite

File: [`e2e/interact/tests/conditional-effects.spec.ts`](e2e/interact/tests/conditional-effects.spec.ts)

```
describe('Conditional Effects')
  describe('Media Query Conditions')
    - should apply desktop effect above 1024px
    - should apply tablet effect between 768px and 1024px
    - should apply mobile effect below 768px
  describe('Dynamic Resize')
    - should switch effects when viewport resizes across breakpoints
  describe('Selector Conditions')
    - should apply pulse effect to :nth-child(even) elements
    - should apply spin effect to :nth-child(odd) elements
```

### 2.7 Effect Types Suite

File: [`e2e/interact/tests/effect-types.spec.ts`](e2e/interact/tests/effect-types.spec.ts)

```
describe('Effect Types')
  describe('Time Effects')
    - should respect configured duration
    - should apply easing function correctly
    - should handle iterations and alternate
  describe('Transition Effects')
    - should apply CSS transition on trigger
    - should handle multiple transitionProperties
  describe('Keyframe Effects')
    - should execute custom keyframe sequences
    - should apply fill mode correctly
```

### 2.8 List Container Suite

File: [`e2e/interact/tests/list-container.spec.ts`](e2e/interact/tests/list-container.spec.ts)

```
describe('List Container')
  describe('Static Lists')
    - should apply effects to all matching list items
    - should respect listItemSelector
  describe('Dynamic Lists')
    - should handle dynamically added list items
    - should clean up removed list items
```

### 2.9 State Management Suite

File: [`e2e/interact/tests/state-management.spec.ts`](e2e/interact/tests/state-management.spec.ts)

```
describe('State Management')
  describe('toggleEffect API')
    - should add effect state with add method
    - should remove effect state with remove method
    - should toggle effect state with toggle method
    - should clear all effects with clear method
  describe('getActiveEffects API')
    - should return currently active effects
    - should update after state changes
```

### 2.10 React Integration Suite

File: [`e2e/interact/tests/react-integration.spec.ts`](e2e/interact/tests/react-integration.spec.ts)

```
describe('React Integration')
  describe('Interaction Component')
    - should render with correct tagName
    - should connect element on mount
    - should disconnect element on unmount
  describe('createInteractRef Hook')
    - should return working ref callback
    - should handle ref reassignment
```

### 2.11 Web Components Integration Suite

File: [`e2e/interact/tests/web-components-integration.spec.ts`](e2e/interact/tests/web-components-integration.spec.ts)

```
describe('Web Components Integration')
  describe('interact-element Custom Element')
    - should register custom element
    - should connect on connectedCallback
    - should disconnect on disconnectedCallback
  describe('Attribute Handling')
    - should read data-interact-key attribute
    - should update when attribute changes
```

---

## Phase 3: Test Implementation

### 3.1 Implement Hover Trigger Tests

- Navigate to `/hover` test page
- Use `page.getByTestId('hover-target').hover()` to trigger animations
- Assert on transform/opacity changes using `getComputedStyle`
- Test rapid hover with programmatic mouse events
- Test toggle method with `hover-toggle-target`
- Test interest trigger (a11y) with focus events

### 3.2 Implement Click Trigger Tests

- Navigate to `/click` test page
- Use `page.getByTestId('click-target').click()` to trigger
- Assert animation plays via style changes
- Test keyboard accessibility with `page.keyboard.press('Enter')` and `Space`
- Test toggle method with `click-toggle-target`

### 3.3 Implement ViewEnter Trigger Tests

- Navigate to `/view-enter` test page
- Use `page.getByTestId('view-once').scrollIntoViewIfNeeded()` for viewport entry
- Use scroll helpers to scroll elements out of viewport
- Test all four types: `once`, `repeat`, `alternate`, `state`
- Assert on animation state changes for each type

### 3.4 Implement ViewProgress Trigger Tests

- Navigate to `/view-progress` test page
- Use `page.mouse.wheel()` to simulate scroll gestures on `scroll-container`
- Assert on transform values at different scroll positions for `scroll-target-{n}` elements
- Verify progress-based opacity changes
- Test range configuration with different rangeStart/rangeEnd values

### 3.5 Implement PointerMove Trigger Tests

- Navigate to `/pointer-move` test page
- Use `page.mouse.move(x, y)` within `pointer-container` bounds
- Assert `pointer-target` position matches mouse position
- Test X-axis and Y-axis configurations
- Verify composite transforms with `pointer-composite` element

### 3.6 Implement Conditional Effects Tests

- Navigate to `/conditional` test page
- Use `page.setViewportSize()` to test breakpoints: `{width: 1200, height: 800}`, `{width: 900, height: 800}`, `{width: 600, height: 800}`
- Trigger interaction and verify correct target (`desktop-target`, `tablet-target`, `mobile-target`) animates
- Test selector conditions with nth-child patterns

### 3.7 Implement Effect Types Tests

- Create dedicated sections in test pages for each effect type
- Test TimeEffect with duration, easing, iterations
- Test TransitionEffect with transitionProperties
- Test KeyframeEffect with custom keyframe sequences
- Assert on specific style property changes

### 3.8 Implement List Container Tests

- Navigate to `/list-container` test page
- Scroll `list-container` into view
- Verify all `list-item-{n}` elements receive effects
- Test selector conditions (even/odd patterns)
- Test dynamic list item addition/removal

### 3.9 Implement State Management Tests

- Navigate to `/state` test page
- Use `page.getByTestId('toggle-add-btn').click()` to add effect
- Use `page.evaluate()` to call `getActiveEffects()` on exposed controller
- Verify state changes with add, remove, toggle, clear methods
- Assert on `state-target` visual state changes

### 3.10 Implement React Integration Tests

- Navigate to `/react` test page
- Verify `<Interaction>` component renders with correct tagName
- Use `page.evaluate()` to verify element is connected via `Interact.getController()`
- Test mount/unmount behavior with React state changes
- Test `createInteractRef` hook behavior with `ref-target`

### 3.11 Implement Web Components Integration Tests

- Navigate to `/web` test page
- Verify `<interact-element>` custom element is defined
- Test `data-interact-key` attribute reading
- Test connectedCallback/disconnectedCallback lifecycle
- Verify element methods (connect, disconnect, toggleEffect)

---

## Phase 4: CI Integration

Update [`.github/workflows/ci.yml`](.github/workflows/ci.yml):

- Install Playwright browsers: `npx playwright install --with-deps`
- Run `yarn test:e2e:interact` after unit tests
- Upload HTML report and screenshots as artifacts on failure

---

## File Structure

```
e2e/
  interact/
    harness/
      src/
        pages/
          HoverTestPage.tsx
          ClickTestPage.tsx
          ViewEnterTestPage.tsx
          ViewProgressTestPage.tsx
          PointerMoveTestPage.tsx
          ConditionalTestPage.tsx
          ListContainerTestPage.tsx
          StateManagementTestPage.tsx
          ReactIntegrationTestPage.tsx
          WebComponentsTestPage.tsx
        App.tsx
        main.tsx
        styles.css
      index.html
      package.json
      vite.config.ts
      tsconfig.json
    pages/
      base-page.ts
      hover-page.ts
      click-page.ts
      view-enter-page.ts
      view-progress-page.ts
      pointer-move-page.ts
      conditional-page.ts
      list-container-page.ts
      state-management-page.ts
      react-integration-page.ts
      web-components-page.ts
    utils/
      animation-helpers.ts
      scroll-helpers.ts
      pointer-helpers.ts
      interaction-helpers.ts
    tests/
      hover-trigger.spec.ts
      click-trigger.spec.ts
      view-enter-trigger.spec.ts
      view-progress-trigger.spec.ts
      pointer-move-trigger.spec.ts
      conditional-effects.spec.ts
      effect-types.spec.ts
      list-container.spec.ts
      state-management.spec.ts
      react-integration.spec.ts
      web-components-integration.spec.ts
playwright.config.ts
```

---

## Key Considerations

- **Dedicated Test Harness**: The test harness at `e2e/interact/harness/` is separate from `apps/demo/` to ensure stable, test-focused pages that won't change independently
- **Test IDs**: All interactive elements use `data-testid` attributes for reliable selection (e.g., `hover-target`, `click-toggle-target`)
- **Exposed Controllers**: Test pages expose interaction controllers to `window` for direct API testing via `page.evaluate()`
- **Shared Infrastructure**: The `playwright.config.ts` at root can define multiple projects for both `@wix/motion` and `@wix/interact` E2E tests
- **Animation Timing**: Use Playwright's `waitForFunction` or animation helpers to wait for animations to complete before asserting
- **Scroll Simulation**: Use `page.mouse.wheel()` for realistic scroll behavior with ViewProgress tests
- **Reduced Motion**: Consider adding tests that verify `prefers-reduced-motion` behavior
- **Workspace Integration**: The harness package uses `workspace:*` dependencies to reference local `@wix/interact` and `@wix/motion` packages