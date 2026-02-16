# `Event Triggers` Support

## Change current trigger handlers implementation to a generic event trigger implementation of stateless and stateful triggers, according to [the CSS specification](https://drafts.csswg.org/css-animations-2/#event-triggers).

# Context

Currently we support 6 triggers with 4 matching handlers implementing them.  
The following triggers:

* `viewEnter`  
* `animationEnd`  
* `click`  
* `hover`  
* `activate` (alias of `click`)  
* `interest` (alias of `hover`)

With handlers matching the first 4 above.

Since `viewEnter` actually implements a [`Timeline Trigger`](https://drafts.csswg.org/css-animations-2/#timeline-triggers), we don’t need to touch it for now.

We deviate from the spec of stateful/stateless because the behavior types we use are different from the trigger actions that the spec defines:

* The behavior in the Config (in params’ `type`) contain 2 actions: playing and pausing/stopping/reversing  
* The actions in the spec are singular.

# Implementation

We can generally say that currently we only have ***stateful*** triggers since all the behaviors we have (the `type` param) require triggers to be stateful.

So that:

* `click` implements a ***stateful*** trigger \- currently in CSS it would be written as `click click` with a matching action for each.  
* `hover` implements a ***stateful*** trigger (also) \- since it’s actually an alias of `mouseenter` and `mouseleave`, with an action for each.  
* `activate` is alias of `click` and also binds specific `keypress` (with Enter and Space)  
* `interest` is alias of `hover` and also binds `focusin` and `focusout`

The difference between `activate` and `interest` is that they would be specified as:

* `activate` \=\> `click click` and `keypress keypress`  
* `interest` \=\> `mouseenter mouseleave` and `focusin focusout`

## Design

* We need to see if we can change `click` and `hover` into a generic `eventTrigger` implementation  
* `click` and `activate` need to work like handler doesn’t care about the `event.type`   
* `hover` and `interest` need to mapped to `mouseenter mouseleave` and `focusin focusout`  
* Implementation needs to check for the `event.type` in the handler in order to understand which action to apply  
* In this way we can later allow specifying any event type with this `eventTrigger` handler  
* And later we could also allow granular actions, so that we could also have ***stateless*** triggers  
* Not sure yet what we do with `animationEnd`. Leaving it for next phase.