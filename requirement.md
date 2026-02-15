# Event Triggers Support

Change current trigger handlers implementation to a generic event trigger implementation of stateless and stateful triggers, according to the CSS specification.

## Context

Currently we support 6 triggers with 4 matching handlers implementing them.

**Triggers:**

- `viewEnter`
- `animationEnd`
- `click`
- `hover`
- `activate` (alias of click)
- `interest` (alias of hover)

Handlers match the first 4 above.

Since `viewEnter` actually implements a **Timeline Trigger**, we don't need to touch it for now.

We deviate from the spec of stateful/stateless because the behavior types we use are different from the trigger actions that the spec defines:

- The **behavior** in the Config (in params' type) contains 2 actions: **playing** and **pausing/stopping/reversing**
- The **actions** in the spec are singular.

## Implementation

We can generally say that currently we only have **stateful triggers**, since all the behaviors we have (the type param) require triggers to be stateful.

- **click** implements a stateful trigger — in CSS it would be written as `click click` with a matching action for each.
- **hover** implements a stateful trigger — it's an alias of `mouseenter` and `mouseleave`, with an action for each.
- **activate** is an alias of click and also binds specific keypress (Enter and Space).
- **interest** is an alias of hover and also binds `focusin` and `focusout`.

The difference between activate and interest:

- **activate** ⇒ `click click` and `keypress keypress`
- **interest** ⇒ `mouseenter mouseleave` and `focusin focusout`

## Design

1. Change **click** and **hover** into a generic **eventTrigger** implementation.
2. **click** and **activate** need to work so the handler doesn't care about `event.type`.
3. **hover** and **interest** need to be mapped to:
   - `mouseenter` / `mouseleave`
   - `focusin` / `focusout`
4. Implementation must check `event.type` in the handler to determine which action to apply.
5. This allows later:
   - Specifying any event type with this eventTrigger handler.
   - Granular actions and **stateless triggers**.

**Note:** What to do with `animationEnd` is not yet decided; leaving it for the next phase.
