import type {
  Effect,
  TriggerType,
  EffectRef,
  InteractionParamsTypes,
  TransitionEffect,
  Interaction,
  InteractionTrigger,
  CreateTransitionCSSParams,
  IInteractionController,
} from '../types';
import { createTransitionCSS, getMediaQuery, getSelectorCondition } from '../utils';
import { getInterpolatedKey } from './utilities';
import { Interact, getSelector } from './Interact';
import TRIGGER_TO_HANDLER_MODULE_MAP from '../handlers';

type InteractionsToApply = Array<[
  string,
  InteractionTrigger,
  Effect,
  HTMLElement | HTMLElement[],
  HTMLElement | HTMLElement[],
  string | undefined
]>;

function _getElementsFromData(
  data: Interaction | Effect,
  root: HTMLElement,
): HTMLElement | HTMLElement[] | null {
  if (data.listContainer) {
    const container = root.querySelector(data.listContainer);

    if (!container) {
      console.warn(`Interact: No container found for list container "${data.listContainer}"`);

      return [];
    }

    if (data.selector) {
      return Array.from(container.querySelectorAll(data.selector)) as HTMLElement[];
    }

    return Array.from(container.children) as HTMLElement[];
  }

  if (data.selector) {
    const element = root.querySelector(data.selector);

    if (element) {
      return element as HTMLElement;
    } else {
      console.warn(`Interact: No element found for selector "${data.selector}"`);
    }
  }

  return root.firstElementChild as HTMLElement | null;
}

function _queryItemElement(data: Interaction | Effect, elements: HTMLElement[]): HTMLElement[] {
  return elements
    .map((element) => {
      return data.selector ? element.querySelector(data.selector) : element;
    })
    .filter(Boolean) as HTMLElement[];
}

function _getInteractionElements(
  interaction: InteractionTrigger,
  effect: Effect,
  source: HTMLElement,
  target: HTMLElement,
  sourceElements?: HTMLElement[],
  targetElements?: HTMLElement[],
): [HTMLElement | HTMLElement[] | null, HTMLElement | HTMLElement[] | null] {
  return [
    sourceElements
      ? _queryItemElement(interaction, sourceElements)
      : _getElementsFromData(interaction, source),
    targetElements
      ? _queryItemElement(effect, targetElements)
      : _getElementsFromData(effect, target),
  ];
}

function _applyInteraction(
  targetKey: string,
  interaction: InteractionTrigger,
  effect: Effect,
  sourceElements: HTMLElement | HTMLElement[],
  targetElements: HTMLElement | HTMLElement[],
  selectorCondition?: string,
) {
  const isSourceArray = Array.isArray(sourceElements);
  const isTargetArray = Array.isArray(targetElements);

  if (isSourceArray) {
    sourceElements.forEach((sourceEl, index) => {
      const targetEl = isTargetArray ? targetElements[index] : targetElements;
      
      if (targetEl) {
        addInteraction(
          targetKey,
          sourceEl,
          interaction.trigger,
          targetEl,
          effect as Effect,
          interaction.params!,
          selectorCondition,
        );
      }
    });
  } else {
    const targets = isTargetArray ? targetElements : [targetElements];
    targets.forEach((targetEl) => {
      addInteraction(
        targetKey,
        sourceElements,
        interaction.trigger,
        targetEl,
        effect as Effect,
        interaction.params!,
        selectorCondition,
      );
    });
  }
}

function _addInteraction(
  sourceKey: string,
  sourceController: IInteractionController,
  instance: Interact,
  interaction: Interaction,
  elements?: HTMLElement[],
) {
  const interactionVariations: Record<string, boolean> = {};

  const interactionsToApply: InteractionsToApply = [];
  
  interaction.effects.forEach((effect) => {
    const effectId = (effect as EffectRef).effectId;

    const effectOptions = {
      ...(instance.dataCache.effects[effectId] || {}),
      ...effect,
      effectId,
    };
    const targetKey_ = effectOptions.key;

    const interactionId = getInterpolatedKey(effect.interactionId!, sourceKey);

    if (interactionVariations[interactionId!]) {
      // Skip this effect if it has already been added
      return;
    }

    if (instance.addedInteractions[interactionId!] && !elements) {
      // Skip this interaction if it has already been added
      return;
    }

    const mql = getMediaQuery(effectOptions.conditions || [], instance.dataCache.conditions);

    if (mql) {
      instance.setupMediaQueryListener(interactionId, mql, sourceKey, () => {
        sourceController.update();
      });
    }

    if (!mql || mql.matches) {
      interactionVariations[interactionId!] = true;

      const target = targetKey_ && getInterpolatedKey(targetKey_, sourceKey);

      let targetController;
      if (target) {
        targetController = Interact.getController(target);

        if (!targetController) {
          // Bail out :: no target element in cache
          return;
        }

        if (effectOptions.listContainer) {
          targetController.watchChildList(effectOptions.listContainer);
        }
      } else {
        // target is not specified - fallback to same as source
        targetController = sourceController;
      }

      const [sourceElements, targetElements] = _getInteractionElements(
        interaction,
        effectOptions,
        sourceController.element,
        targetController.element,
        elements,
      );

      if (!sourceElements || !targetElements) {
        return;
      }

      instance.addedInteractions[interactionId!] = true;

      const key = target || interaction.key;
      const selectorCondition = getSelectorCondition(
        effectOptions.conditions || [],
        instance.dataCache.conditions,
      );

      interactionsToApply.push([
        key,
        interaction,
        effectOptions,
        sourceElements,
        targetElements,
        selectorCondition,
      ]);
    }
  });

  // apply the effects in reverse to return to the order specified by the user to ensure order of composition is as defined
  interactionsToApply.reverse().forEach((interaction) => {
    _applyInteraction(...interaction);
  });
}

function addEffectsForTarget(
  targetKey: string,
  targetController: IInteractionController,
  instance: Interact,
  listContainer?: string,
  elements?: HTMLElement[],
) {
  const effects = instance.get(targetKey)?.effects || {};
  const interactionIds = Object.keys(effects);
  const interactionsToApply: InteractionsToApply = [];

  interactionIds.forEach((interactionId_) => {
    const interactionId = getInterpolatedKey(interactionId_, targetKey);

    if (instance.addedInteractions[interactionId] && !elements) {
      // Skip this interaction if it has already been added
      return;
    }

    const effectVariations = effects[interactionId_];

    // use `some` to short-circuit after the first effect that matches the conditions
    effectVariations.some(({ effect, ...interaction }) => {
      const effectId = (effect as EffectRef).effectId;

      const effectOptions = {
        ...(instance!.dataCache.effects[effectId] || {}),
        ...effect,
        effectId,
      };

      if (listContainer && effectOptions.listContainer !== listContainer) {
        // skip this effect if a listContainer was provided and it's not matching this effect.listContainer
        return false;
      }

      const mql = getMediaQuery(effectOptions.conditions || [], instance!.dataCache.conditions);

      if (mql) {
        instance.setupMediaQueryListener(interactionId, mql, targetKey, () => {
          // For effects on target, we reconcile the target element
          targetController.update();
        });
      }

      if (!mql || mql.matches) {
        const sourceKey = interaction.key && getInterpolatedKey(interaction.key, targetKey);
        const sourceController = Interact.getController(sourceKey);

        if (!sourceController) {
          // Bail out :: no source or target elements in cache
          return true;
        }

        if (effectOptions.listContainer) {
          targetController.watchChildList(effectOptions.listContainer);
        }

        const [sourceElements, targetElements] = _getInteractionElements(
          interaction,
          effectOptions,
          sourceController.element,
          targetController.element,
          undefined,
          elements,
        );

        if (!sourceElements || !targetElements) {
          // Bail out :: no source or target elements found in DOM
          return true;
        }

        instance!.addedInteractions[interactionId] = true;

        const selectorCondition = getSelectorCondition(
          effectOptions.conditions || [],
          instance!.dataCache.conditions,
        );

        interactionsToApply.push([
          targetKey,
          interaction,
          effectOptions as Effect,
          sourceElements,
          targetElements,
          selectorCondition,
        ]);

        // short-circuit the loop since we have a match
        return true;
      }

      return false;
    });
  });

  // apply the effects in reverse to return to the order specified by the user to ensure order of composition is as defined
  interactionsToApply.reverse().forEach((interaction) => {
    _applyInteraction(...interaction);
  });

  return interactionIds.length > 0;
}

/**
 * Registers a handler to an event on a given element.
 */
function addInteraction<T extends TriggerType>(
  targetKey: string,
  source: HTMLElement,
  trigger: T,
  target: HTMLElement,
  effect: Effect,
  options: InteractionParamsTypes[T],
  selectorCondition?: string,
): void {
  let targetController;

  if (
    (effect as TransitionEffect).transition ||
    (effect as TransitionEffect).transitionProperties
  ) {
    const args: CreateTransitionCSSParams = {
      key: targetKey,
      effectId: (effect as Effect).effectId!,
      transition: (effect as TransitionEffect).transition,
      properties: (effect as TransitionEffect).transitionProperties,
      childSelector: getSelector(effect, {
        asCombinator: true,
        addItemFilter: true,
      }),
      selectorCondition,
    };

    targetController = Interact.getController(targetKey);
    if (!targetController) {
      return;
    }

    targetController.renderStyle(createTransitionCSS(args));
  }

  TRIGGER_TO_HANDLER_MODULE_MAP[trigger]?.add(source, target, effect, options, {
    reducedMotion: Interact.forceReducedMotion,
    targetController,
    selectorCondition,
    allowA11yTriggers: Interact.allowA11yTriggers,
  });
}

/**
 * Adds all events and effects to an element based on config
 */
export function add(controller: IInteractionController): boolean {
  const key = controller.key as string;
  const instance = Interact.getInstance(key);

  if (!instance) {
    console.warn(`No instance found for key: ${key}`);

    // even if we don't find a matching instance, we still want to cache the element
    Interact.setController(key, controller);
    return false;
  }

  const { triggers = [] } = instance?.get(key) || {};
  const hasTriggers = triggers.length > 0;

  instance.setController(key, controller);

  triggers.forEach((interaction, index) => {
    const mql = getMediaQuery(interaction.conditions, instance!.dataCache.conditions);

    if (mql) {
      const interactionId = `${key}::trigger::${index}`;
      instance.setupMediaQueryListener(interactionId, mql, key, () => {
        controller.update();
      });
    }

    if (!mql || mql.matches) {
      if (interaction.listContainer) {
        controller.watchChildList(interaction.listContainer);
      }

      _addInteraction(key, controller, instance!, interaction);
    }
  });

  let hasEffects = false;
  if (instance) {
    hasEffects = addEffectsForTarget(key, controller, instance);
  }

  return hasTriggers || hasEffects;
}

export function addListItems(
  controller: IInteractionController,
  listContainer: string,
  elements: HTMLElement[],
) {
  const key = controller.key as string;
  const instance = Interact.getInstance(key);

  if (instance) {
    const { triggers = [] } = instance?.get(key) || {};

    triggers.forEach((interaction, index) => {
      if (interaction.listContainer !== listContainer) {
        return;
      }

      const mql = getMediaQuery(interaction.conditions, instance!.dataCache.conditions);

      if (mql) {
        const interactionId = `${key}::listTrigger::${listContainer}::${index}`;
        instance.setupMediaQueryListener(interactionId, mql, key, () => {
          // For list items, reconciling the root might be expensive but safe
          controller.update();
        });
      }

      if (!mql || mql.matches) {
        _addInteraction(key, controller, instance!, interaction, elements);
      }
    });

    addEffectsForTarget(key, controller, instance, listContainer, elements);
  }
}
