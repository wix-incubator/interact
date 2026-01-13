# `viewEnter` Beyond `type: 'once'`

This is specification document for implementing the rest of the values for `type` property of `params` for `trigger: 'viewEnter'`.

- Currently only `type: once` is implemented for the `viewEnter` trigger
- Other types that should also be implemented are: `alternate`, `repeat`, and `state`
- The initial flow for Interactions with these types are the same as for `once`
- These types should also track when the element exits the range \- `isIntersecting: false`
- We’ll start by using a default exit observer for each type \- without providing an API to specify its options
- We need to make sure we [persist](https://developer.mozilla.org/en-US/docs/Web/API/Animation/persist) the animation on these types.

# `alternate`

- When exiting the range the animation should be reversed.
- On subsequent re-entry the animation should be reversed (not play, since it was reversed on last exit)
- By default we can use the same observer as the one for entry.

# `repeat`

- By default we can use a separate observer that watches when the element is completely out of view
- When exiting the range the animation should be paused and set its progress to 0 (like “stop”).
- On subsequent re-entry the animation should be played from 0

# `state`

- By default we can use a separate observer that watches when the element is completely out of view
- When exiting the range the animation should be paused.
- On subsequent re-entry the animation should be resumed (calling `.play()` should resume it)
