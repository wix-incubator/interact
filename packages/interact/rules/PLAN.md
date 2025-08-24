## Phase 1: Context Summary

**Tools Utilized & Key Discoveries:**
- Used `read_file` on core files (`interact.ts`, `types.ts`, `WixInteractElement.ts`, `utils.ts`) to understand the main API structure and configuration patterns
- Used `list_dir` to explore package structure and handlers organization, discovering modular trigger system
- Used `file_search` to find examples documentation with common usage patterns
- Used `read_file` on motion types and handler implementations to understand effect integration patterns

**Key Files, Functions, Types & Structures Involved:**
1. **Core API**: `Interact` class with static `create()` method, `InteractConfig` as main configuration object
2. **Core Types**: 
   - `InteractConfig` structure: `{effects, conditions?, interactions}`
   - `Interaction`: `{source, trigger, params?, conditions?, effects}`
   - Effect types: `TimeEffect`, `ScrubEffect`, `TransitionEffect` with union `Effect`
   - `TriggerType`: 7 types (`hover`, `click`, `viewEnter`, `pageVisible`, `animationEnd`, `viewProgress`, `pointerMove`)
3. **Custom Element**: `<wix-interact-element>` with required `data-wix-path` attribute
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
- Custom element path matching requirements between configuration and DOM

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
- Rule for mouse tracking interactions
- Rule for hit area configuration (root/self)
- Rule for pointer-based scrub effects

#### Stage 1.6: AnimationEnd Trigger Rules (`animationend-rules.md`)
- Rule for configuration of entrance and loop animations chaining pattern
- Rule for configuration of entrance animations chaining of different elements pattern

#### Stage 1.7: PageVisible Trigger Rules (`pagevisible-rules.md`)
- Rule for page load animations
- Rule for global state management
- Rule for one-time initialization effects

**Common Deliverables:**
- Template for base `InteractConfig` structure validation
- Shared utilities for path generation and validation
- Common effect pattern templates

### Stage 2: Effect Generation Rules
**What**: Rules for generating the three effect types with appropriate defaults
**Where**: Time effects (most common), transition effects, scrub effects
**Why**: Effects are the core value-add and have clear patterns from documentation

**Deliverables:**
- Rule for TimeEffect with named effects (FadeIn, SlideIn, etc.)
- Rule for TimeEffect with custom keyframes
- Rule for TransitionEffect with CSS properties
- Rule for ScrubEffect with scroll/pointer triggers
- Effect selection helper based on trigger type

### Stage 3: Custom Element and DOM Integration Rules
**What**: Rules for generating proper `<wix-interact-element>` markup and path management
**Where**: HTML/JSX generation with proper `data-wix-path` attributes
**Why**: Required for library function and common source of integration errors

**Deliverables:**
- Rule for custom element wrapper generation
- Rule for path selector generation and validation
- Rule for React/JSX integration patterns

### Stage 4: Advanced Configuration Rules  
**What**: Rules for conditions, effect references, and complex patterns
**Where**: Responsive interactions, reusable effects, multi-step animations
**Why**: Enables scaling beyond basic use cases

**Deliverables:**
- Rule for media query conditions
- Rule for reusable effect patterns with `effectId`
- Rule for animation sequences and chaining
- Rule for responsive/conditional interactions

### Stage 5: Type Safety and Validation Rules
**What**: Rules ensuring generated code maintains TypeScript safety
**Where**: Configuration validation, effect property validation, trigger parameter validation
**Why**: Critical for developer experience and catching errors early

**Deliverables:**
- Type validation rules for each configuration pattern
- Runtime validation helpers
- Error message generation for common mistakes
- IDE integration patterns

### Stage 6: Integration and Testing Rules
**What**: Rules for testing generated interactions and integration patterns
**Where**: Unit test generation, E2E test patterns, performance validation
**Why**: Ensures generated code works correctly and performs well

**Deliverables:**
- Test case generation for interactions
- Performance validation rules
- Integration pattern validation
- Documentation generation for generated code

---

**Check-in Points:**
- After Stage 1: Validate basic configuration generation with common patterns
- After Stage 3: Verify DOM integration works correctly
- After Stage 5: Ensure type safety is maintained throughout
- Final: Comprehensive testing of all rule combinations

**Success Criteria:**
- Generated code passes TypeScript compilation
- Generated interactions work as expected in browser
- Rules cover 100% of documented example patterns
- Integration with existing tooling (IDE, linting, testing)
