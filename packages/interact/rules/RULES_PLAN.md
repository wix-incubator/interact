## Phase 1: Context Summary

**Tools Utilized & Key Discoveries:**
- Used `read_file` on core files (`interact.ts`, `types.ts`, `InteractElement.ts`, `utils.ts`) to understand the main API structure and configuration patterns
- Used `list_dir` to explore package structure and handlers organization, discovering modular trigger system
- Used `file_search` to find examples documentation with common usage patterns
- Used `read_file` on motion types and handler implementations to understand effect integration patterns

**Key Files, Functions, Types & Structures Involved:**
1. **Core API**: `Interact` class with static `create()` method, `InteractConfig` as main configuration object
2. **Core Types**: 
   - `InteractConfig` structure: `{effects, conditions?, interactions}`
   - `Interaction`: `{key, selector? listContainer?, trigger, params?, conditions?, effects}`
   - Effect types: `TimeEffect`, `ScrubEffect`, `TransitionEffect` with union `Effect`
   - `TriggerType`: 7 types (`hover`, `click`, `viewEnter`, `pageVisible`, `animationEnd`, `viewProgress`, `pointerMove`)
3. **Custom Element**: `<interact-element>` with required `data-interact-key` attribute
4. **Handler System**: Modular trigger handlers in `/src/handlers/` with consistent `add/remove` pattern
5. **Motion Integration**: Named effects from `@wix/motion` (FadeIn, SlideIn, etc.) and custom keyframe effects

**Current Data Flow & Observed Patterns:**
- Configuration flows through: `InteractConfig` → `parseConfig()` → `InteractCache` → Element registration → Handler binding
- Two effect definition patterns: inline effects vs reusable effects with `effectId` references
- Conditions system enables responsive/conditional interactions using media queries
- Custom element wrapper manages DOM lifecycle and state via CSS custom states
- Template patterns evident in documentation for common use cases

**Reference Implementations/Utilities Found:**
- Rich examples in `/docs/examples/README.md` showing entrance animations, hover effects, scroll animations
- Template structures demonstrating configuration patterns
- Modular handler architecture with shared utilities (`generateId`, `createTransitionCSS`)
- Type-safe configuration patterns with comprehensive TypeScript definitions

**Potential Challenges, Risks & Considerations:**
- Complex discriminated union types require careful rule generation to maintain type safety
- Multiple effect types (Time/Scrub/Transition) need different generation strategies
- Handler registration lifecycle and cleanup patterns must be preserved
- Integration with motion library's NamedEffect types needs consideration for effect selection
- Custom element key matching requirements between configuration and DOM
- **List-based interactions**: `listContainer` with dynamic mutation observer behavior needs specialized rules
- **Element targeting complexity**: Priority order (listContainer → selector → firstElementChild) and inheritance patterns
- **Selector non-inheritance**: Unlike `key`, `selector` and `listContainer` are NOT inherited from Interaction to Effect level
- **Pointer-driven animations**: hitArea, centeredToTarget, symmetric/anti-symmetric patterns need careful handling

---

## Phase 2: Formulate a Plan

Based on the comprehensive exploration, here's a detailed plan for creating rules to generate Interact library code:

### Stage 1: Core Configuration Generation Rules
**What**: Rules for generating basic `InteractConfig` objects and `Interaction` structures per trigger type
**Where**: Focus on all 7 trigger types with their most common patterns and use cases
**Why**: Each trigger type has distinct patterns, parameters, and typical effects that warrant specialized rules
**How**: Create templates for interactions of specific types with placeholders, without actual effect content

**Sub-stages (each in separate files):**

#### Stage 1.1: Hover Trigger Rules (`hover-rules.md`)
- Rule for hover effect configuration with state management pattern
- Rule for hover enter/leave animations pattern
- Rule for pointer-based hover interactions with alternate pattern
- Rule for pointer-based hover interactions with repeat pattern
- RUle for pointer-based hover interactions with play/pause pattern

#### Stage 1.2: Click Trigger Rules (`click-rules.md`)
- Rule for click effect configuration with TimeEffects and alternate pattern
- Rule for click effect configuration with TimeEffects and state pattern
- Rule for click effect configuration with TimeEffects and repeat pattern
- Rule for click effect configuration with state toggles and TransitionEffects pattern

#### Stage 1.3: ViewEnter Trigger Rules (`viewenter-rules.md`)
- Rule for entrance animation configuration with once type pattern
- Rule for entrance animation configuration with repeat type and separate source and target pattern
- Rule for entrance animation configuration with alternate type and separate source and target pattern
- Rule for loop animation configuration with state type pattern
- Rule for threshold and viewport intersection parameters pattern
- Rule for staggered entrance animations pattern

#### Stage 1.4: ViewProgress Trigger Rules (`viewprogress-rules.md`)
- Rule for range-based parallax/continuous animation control with namedEffects pattern
- Rule for range-based entry animation control with namedEffects pattern
- Rule for range-based exit animation control with namedEffects pattern
- Rule for range-based parallax/continuous animation control with keyframeEffects pattern
- Rule for range-based entry animation control with keyframeEffects pattern
- Rule for range-based exit animation control with keyframeEffects pattern
- Rule for range-based parallax/continuous animation control with customEffects pattern
- Rule for range-based entry animation control with customEffects pattern
- Rule for range-based exit animation control with customEffects pattern

#### Stage 1.5: PointerMove Trigger Rules (`pointermove-rules.md`)
- Rule for hit area configuration (`root` vs `self`) with appropriate use cases
- Rule for centering range to animation target using `centeredToTarget` configuration
- Rule for symmetric pointer effects (same animation in both directions)
- Rule for anti-symmetric pointer effects (inverted animation based on direction)
- Rules for pointer-based effects of single elements with namedEffect
- Rules for pointer-based parallax effects of a group of elements with namedEffect

#### Stage 1.6: AnimationEnd Trigger Rules (`animationend-rules.md`)
- Rule for configuration of entrance and loop animations chaining pattern
- Rule for configuration of entrance animations chaining of different elements pattern

#### Stage 1.7: PageVisible Trigger Rules (`pagevisible-rules.md`)
- Rule for page load animations
- Rule for global state management
- Rule for one-time initialization effects

#### Stage 1.8: List-Based Interaction Rules (`scroll-list-rules.md`)
- Rule for `listContainer` with automatic child detection (targets all immediate children)
- Rule for `listContainer` + `selector` for targeting specific elements within list items
- Rule for gallery/grid interaction patterns
- Rule for performance optimization with large lists

**Common Deliverables:**
- Template for base `InteractConfig` structure validation
- Shared utilities for key generation and validation
- Common effect pattern templates

### Stage 2: Element Targeting and Selector Rules
**What**: Rules for element targeting using `key`, `selector`, and `listContainer`
**Where**: Both Interaction and Effect levels with proper inheritance/non-inheritance patterns
**Why**: Element targeting is complex with priority order and non-obvious inheritance behavior

**Deliverables:**
- Rule for element targeting priority: listContainer → selector → firstElementChild
- Rule for when `key` defaults from Interaction to Effect (when Effect.key is omitted)
- Rule for selector non-inheritance: Effect.selector must be explicit (not inherited from Interaction.selector)
- Rule for listContainer non-inheritance: Effect.listContainer must be explicit
- Rule for cross-element targeting (source ≠ target) patterns
- Rule for self-targeting patterns (source = target or Effect.key omitted)
- Rule for nested selector patterns within custom elements
- Rule for combining listContainer + selector for list item children

### Stage 3: Effect Generation Rules
**What**: Rules for generating the three effect types with appropriate defaults
**Where**: Time effects (most common), transition effects, scrub effects
**Why**: Effects are the core value-add and have clear patterns from documentation

**Deliverables:**
- Rule for TimeEffect with named effects (FadeIn, SlideIn, etc.)
- Rule for TimeEffect with custom keyframes
- Rule for TransitionEffect with CSS properties
- Rule for ScrubEffect with scroll/pointer triggers
- Effect selection helper based on trigger type
- Rule for inline effects vs reusable effects with `effectId` references

### Stage 4: Custom Element and DOM Integration Rules
**What**: Rules for generating proper `<interact-element>` markup and key management
**Where**: HTML/JSX generation with proper `data-interact-key` attributes
**Why**: Required for library function and common source of integration errors

**Deliverables:**
- Rule for custom element wrapper generation
- Rule for element key generation and validation (matching data-interact-key to config key)
- Rule for React/JSX integration patterns
- Rule for Vue/Angular custom element usage
- Rule for ensuring at least one child element exists

### Stage 5: Advanced Configuration Rules  
**What**: Rules for conditions, effect references, and complex patterns
**Where**: Responsive interactions, reusable effects, multistep animations
**Why**: Enables scaling beyond basic use cases

**Deliverables:**
- Rule for media query conditions (device size, orientation, reduced motion, dark mode)
- Rule for container query conditions
- Rule for reusable effect patterns with `effectId`
- Rule for animation sequences and chaining (using animationEnd trigger)
- Rule for responsive/conditional interactions with cascading effects
- Rule for combining multiple conditions with AND logic

### Stage 6: Type Safety and Validation Rules
**What**: Rules ensuring generated code maintains TypeScript safety
**Where**: Configuration validation, effect property validation, trigger parameter validation
**Why**: Critical for developer experience and catching errors early

**Deliverables:**
- Type validation rules for each configuration pattern
- Runtime validation helpers
- Error message generation for common mistakes
- IDE integration patterns
- Discriminated union handling for Effect types
- Parameter validation based on trigger type

### Stage 7: Integration and Testing Rules
**What**: Rules for testing generated interactions and integration patterns
**Where**: Unit test generation, E2E test patterns, performance validation
**Why**: Ensures generated code works correctly and performs well

**Deliverables:**
- Test case generation for interactions
- Performance validation rules
- Integration pattern validation
- Documentation generation for generated code
- Browser compatibility testing patterns
- Accessibility testing for animations (reduced motion)

---

**Check-in Points:**
- After Stage 1: Validate all 7 trigger types generate correct configuration patterns
- After Stage 2: Verify element targeting rules handle all selector/listContainer combinations
- After Stage 3: Ensure effect generation covers all three types (Time/Scrub/Transition)
- After Stage 4: Verify DOM integration works correctly with proper key matching
- After Stage 5: Test condition cascading and responsive patterns
- After Stage 6: Ensure type safety is maintained throughout all generated code
- Final: Comprehensive testing of all rule combinations and edge cases

**Success Criteria:**
- ✅ Generated code passes TypeScript compilation with no errors
- ✅ Generated interactions work as expected in browser
- ✅ Rules cover 100% of documented example patterns
- ✅ All 7 trigger types have comprehensive rule coverage
- ✅ Element targeting rules correctly handle priority order (listContainer → selector → firstElementChild)
- ✅ Selector and listContainer non-inheritance is properly enforced
- ✅ List-based interactions with mutation observers work correctly
- ✅ Pointer-driven animations support both symmetric and anti-symmetric patterns
- ✅ Conditions system supports media queries, container queries, and cascading
- ✅ AnimationEnd trigger enables proper animation chaining
- ✅ Integration with existing tooling (IDE, linting, testing)
- ✅ Generated code respects accessibility (reduced motion) preferences
- ✅ Performance patterns for large lists and frequent updates are included

---

## Priority Implementation Order

Based on current progress and critical gaps identified:

### **Phase 1: Foundation (Completed ✅)**
- Stage 1.1-1.3: Basic triggers (hover, click, viewEnter) ✅
- Stage 1.4: ViewProgress rules ✅
- Stage 1.5: PointerMove rules ✅

### **Phase 2: Critical Gaps (HIGH PRIORITY)**
- **Stage 1.8**: List-Based Interaction Rules - Essential for galleries and grids
- **Stage 2**: Element Targeting Rules - Critical for understanding selector behavior
- **Stage 1.6-1.7**: AnimationEnd and PageVisible triggers

### **Phase 3: Effect Completeness (MEDIUM PRIORITY)**
- **Stage 3**: Complete effect generation rules with all three types
- Inline vs reusable effect patterns
- Effect cascading with conditions

### **Phase 4: Integration & Advanced (LOWER PRIORITY)**
- **Stage 4**: Custom element and DOM integration
- **Stage 5**: Advanced configuration with conditions
- **Stage 6-7**: Type safety, validation, and testing

### **Next Immediate Actions:**
1. Create `scroll-list-rules.md` with listContainer patterns
2. Create element targeting guide explaining selector inheritance/non-inheritance
3. Enhance pointer-move rules with symmetric/anti-symmetric patterns
4. Add animationEnd chaining patterns
5. Document performance optimization for large lists
