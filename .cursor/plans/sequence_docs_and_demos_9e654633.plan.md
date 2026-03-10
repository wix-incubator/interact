---
name: Sequence docs and demos
overview: Add documentation for the new Sequence/staggering feature to both the motion and interact docs, and create interactive demo components showcasing sequences with various triggers, easing functions, and configuration patterns.
todos:
  - id: motion-api-sequence
    content: Create packages/motion/docs/api/sequence.md -- Sequence class API reference
    status: pending
  - id: motion-api-get-sequence
    content: Create packages/motion/docs/api/get-sequence.md -- getSequence() function reference
    status: pending
  - id: motion-docs-updates
    content: 'Update motion docs: api/README.md index, api/types.md with new types, core-concepts.md with Sequences section'
    status: pending
  - id: interact-guide-sequences
    content: Create packages/interact/docs/guides/sequences.md -- comprehensive sequences guide
    status: pending
  - id: interact-docs-updates
    content: 'Update interact docs: api/types.md, api/interact-class.md, guides/README.md, examples/README.md, examples/list-patterns.md'
    status: pending
  - id: demo-sequence-playground
    content: Create SequencePlayground.tsx in both web/ and react/ -- interactive stagger controls
    status: completed
  - id: demo-sequence-entrance
    content: Create SequenceEntranceDemo.tsx in both web/ and react/ -- viewEnter staggered list
    status: completed
  - id: demo-sequence-click
    content: Create SequenceClickDemo.tsx in both web/ and react/ -- click-triggered multi-element sequence
    status: completed
  - id: demo-sequence-easing
    content: Create SequenceEasingComparison.tsx in both web/ and react/ -- side-by-side easing comparison
    status: completed
  - id: demo-app-integration
    content: Update App.tsx (web + react) and styles.css to include new sequence demos
    status: completed
isProject: false
---

# Sequence Feature Documentation and Demos

## Part 1: Motion Package Docs (`packages/motion/docs/`)

### 1.1 New file: `api/sequence.md`

API reference for the `Sequence` class, mirroring the style of [animation-group.md](packages/motion/docs/api/animation-group.md). Contents:

- **Overview** -- Sequence extends AnimationGroup to coordinate multiple AnimationGroups with staggered delays
- **Class definition** -- constructor signature, properties (`animationGroups`, `delay`, `offset`, `offsetEasing`), inherited methods (`play`, `pause`, `reverse`, `cancel`, `onFinish`, `setPlaybackRate`, `playState`)
- `**addGroups(entries)` -- inserts new groups at specified indices and recalculates offsets
- **Offset calculation** -- the formula `easing(i / last) * last * offset | 0` with examples for linear, quadIn, sineOut (from the spec)
- `**SequenceOptions` type -- `delay`, `offset`, `offsetEasing`
- **Usage examples** -- creating a Sequence manually, controlling playback, using different easing functions

### 1.2 New file: `api/get-sequence.md`

API reference for the `getSequence()` function (in `packages/motion/src/motion.ts`). Contents:

- **Signature** -- `getSequence(options, animationGroupArgs[], context?) => Sequence`
- `AnimationGroupArgs` type -- `target`, `options`, `context`
- `createAnimationGroups()` helper (also exported)
- **Examples** -- creating a staggered entrance for a list of elements, using different offset easings

### 1.3 Update `api/README.md`

Add entries for `Sequence` and `getSequence` to the API index, with short descriptions and links.

### 1.4 Update `api/types.md`

Add `SequenceOptions`, `AnimationGroupArgs`, and `IndexedGroup` type documentation.

### 1.5 Update `core-concepts.md`

Add a "Sequences & Staggering" section explaining the concept of coordinated multi-group animations with easing-driven delay offsets.

---

## Part 2: Interact Package Docs (`packages/interact/docs/`)

### 2.1 New file: `guides/sequences.md`

Comprehensive guide for using sequences in Interact configs. Contents:

- **What is a Sequence** -- a list of Effects managed as a coordinated timeline with staggered delays
- **Config structure** -- `InteractConfig.sequences` (reusable map), `Interaction.sequences` (per-interaction list)
- **SequenceConfig type** -- `effects`, `delay`, `offset`, `offsetEasing`, `sequenceId`, `conditions`
- **SequenceConfigRef** -- referencing reusable sequences by `sequenceId` with inline overrides
- **Offset and easing** -- how offset distributes delay across effects, easing curves (linear, quadIn, sineOut), visual formula
- **Cross-element sequences** -- effects targeting different keys, resolved at add-time
- **Sequences with listContainer** -- staggering list items, dynamic additions via `addListItems`
- **Conditions on sequences** -- sequence-level and effect-level media conditions
- **Examples** -- staggered card grid entrance, multi-element orchestration, click-triggered sequence

### 2.2 Update `api/types.md`

Add type definitions for `SequenceOptionsConfig`, `SequenceConfig`, `SequenceConfigRef`, and the updated `Interaction` and `InteractConfig` types (showing the new `sequences` fields).

### 2.3 Update `api/interact-class.md`

Document the new `Interact.getSequence()` static method, `Interact.addToSequence()`, and `Interact.sequenceCache`.

### 2.4 Update `guides/README.md`

Add "Sequences & Staggering" entry to the guides index.

### 2.5 Update `examples/README.md` and `examples/list-patterns.md`

Add sequence-based examples alongside existing list/stagger patterns, showing the new `sequences` config syntax as the preferred approach.

---

## Part 3: Demo App (`apps/demo/`)

Create demo components in both `src/web/components/` and `src/react/components/` (following the existing mirror pattern). Each demo uses the `useInteractInstance` hook and the existing panel/control UI patterns.

### 3.1 `SequencePlayground.tsx` -- Interactive Stagger Controls

An interactive demo (like the existing `Playground.tsx`) where the user can tune sequence parameters in real time:

- **Controls**: offset (0-500ms slider), offsetEasing (dropdown: linear, quadIn, quadOut, sineOut, cubic-bezier), delay (0-500ms), duration per effect, trigger type (viewEnter, click)
- **Preview**: a grid of 6-8 cards, each as an effect in a sequence, using `keyframeEffect` (e.g. fade+slide-up)
- **Config display**: shows the live `InteractConfig` JSON being used
- Uses `Interaction.sequences` with inline sequence definition

### 3.2 `SequenceEntranceDemo.tsx` -- ViewEnter Staggered List

A scroll-triggered staggered entrance showcasing the most common use case:

- A list of cards inside a `listContainer`, entering the viewport with staggered `viewEnter` trigger
- Demonstrates `offset` + `offsetEasing: 'quadIn'` for natural-feeling stagger
- Showcases both inline and reusable (`sequenceId`) sequence definitions

### 3.3 `SequenceClickDemo.tsx` -- Click-Triggered Sequence

A click-triggered multi-element orchestration:

- A button triggers a sequence that animates multiple elements (heading, body text, image) in coordinated order
- Demonstrates cross-element targeting (effects with different `key` values in the sequence)
- Uses `click` trigger with `type: 'alternate'` for play/reverse

### 3.4 `SequenceEasingComparison.tsx` -- Side-by-Side Easing Curves

A visual comparison of different `offsetEasing` values:

- 3-4 rows, each showing the same set of items but with different easing (linear, quadIn, sineOut, cubicBezier)
- All triggered simultaneously on a button click or viewEnter
- Labels showing easing name and computed delay values

### 3.5 Update `App.tsx` (both web and react)

Add the new demo components to both App files, with appropriate section titles. Add a "Sequences" section header separating existing demos from the new sequence demos.

### 3.6 Update `src/styles.css`

Add styles for the new sequence demo components (card grids, easing comparison rows, sequence preview areas). Follow the existing design system (Space Grotesk/Inter fonts, dark panels, blue accent).

---

## File Summary

| Action | Path                                                          |
| ------ | ------------------------------------------------------------- |
| Create | `packages/motion/docs/api/sequence.md`                        |
| Create | `packages/motion/docs/api/get-sequence.md`                    |
| Edit   | `packages/motion/docs/api/README.md`                          |
| Edit   | `packages/motion/docs/api/types.md`                           |
| Edit   | `packages/motion/docs/core-concepts.md`                       |
| Create | `packages/interact/docs/guides/sequences.md`                  |
| Edit   | `packages/interact/docs/api/types.md`                         |
| Edit   | `packages/interact/docs/api/interact-class.md`                |
| Edit   | `packages/interact/docs/guides/README.md`                     |
| Edit   | `packages/interact/docs/examples/README.md`                   |
| Edit   | `packages/interact/docs/examples/list-patterns.md`            |
| Create | `apps/demo/src/web/components/SequencePlayground.tsx`         |
| Create | `apps/demo/src/web/components/SequenceEntranceDemo.tsx`       |
| Create | `apps/demo/src/web/components/SequenceClickDemo.tsx`          |
| Create | `apps/demo/src/web/components/SequenceEasingComparison.tsx`   |
| Create | `apps/demo/src/react/components/SequencePlayground.tsx`       |
| Create | `apps/demo/src/react/components/SequenceEntranceDemo.tsx`     |
| Create | `apps/demo/src/react/components/SequenceClickDemo.tsx`        |
| Create | `apps/demo/src/react/components/SequenceEasingComparison.tsx` |
| Edit   | `apps/demo/src/web/App.tsx`                                   |
| Edit   | `apps/demo/src/react/App.tsx`                                 |
| Edit   | `apps/demo/src/styles.css`                                    |
