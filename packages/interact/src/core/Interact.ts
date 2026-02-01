import {
  InteractCache,
  InteractConfig,
  EffectRef,
  Effect,
  Interaction,
  ViewEnterParams,
  ViewEnterHandlerModule,
  IInteractionController,
  IInteractElement,
  Sequence,
  SequenceRef,
} from '../types';
import { getInterpolatedKey } from './utilities';
import { generateId } from '../utils';
import TRIGGER_TO_HANDLER_MODULE_MAP from '../handlers';
import { registerEffects, calculateOffsets, jsEasings, parseCubicBezier } from '@wix/motion';

function _convertToKeyTemplate(key: string) {
  return key.replace(/\[([-\w]+)]/g, '[]');
}

/** Keys that indicate an effect has its own definition (not just a reference) */
const EFFECT_DEFINITION_KEYS = ['duration', 'namedEffect', 'keyframeEffect', 'customEffect'] as const;

/** Check if an effect is just a reference to another effect (has effectId but no definition) */
function isEffectReference(effect: Effect | EffectRef): effect is EffectRef {
  return 'effectId' in effect && !EFFECT_DEFINITION_KEYS.some((key) => key in effect);
}

export class Interact {
  static defineInteractElement?: () => boolean;
  dataCache: InteractCache;
  addedInteractions: { [interactionId: string]: boolean };
  mediaQueryListeners: Map<
    string,
    {
      mql: MediaQueryList;
      handler: (e: MediaQueryListEvent | MediaQueryList) => void;
      key: string;
    }
  >;
  listInteractionsCache: {
    [listContainer: string]: { [interactionId: string]: boolean };
  };
  controllers: Set<IInteractionController>;
  static forceReducedMotion: boolean = false;
  static allowA11yTriggers: boolean = true;
  static instances: Interact[] = [];
  static controllerCache = new Map<string, IInteractionController>();

  constructor() {
    this.dataCache = { effects: {}, sequences: {}, conditions: {}, interactions: {} };
    this.addedInteractions = {};
    this.mediaQueryListeners = new Map();
    this.listInteractionsCache = {};
    this.controllers = new Set();
  }

  init(config: InteractConfig, options?: { useCutsomElement?: boolean }): void {
    if (typeof window === 'undefined' || !window.customElements) {
      return;
    }

    const useCutsomElement = options?.useCutsomElement ?? !!Interact.defineInteractElement;

    this.dataCache = parseConfig(config, useCutsomElement);

    const defined = Interact.defineInteractElement?.();

    if (useCutsomElement && defined === false) {
      // mostly to recover from React's <StrictMode>, blah...
      document.querySelectorAll('interact-element').forEach((element) => {
        (element as IInteractElement).connect();
      });
    } else {
      // Always try to reconnect elements from cache.
      // This handles cases where elements were added to DOM before the instance was created
      // (e.g., in React where useEffect runs after render), or when an instance is recreated
      // (e.g., in React StrictMode where effects run twice).
      // The connect() method has a guard to skip if already connected.
      Interact.controllerCache.forEach((controller: IInteractionController, key) =>
        controller.connect(key),
      );
    }
  }

  destroy(): void {
    for (const controller of this.controllers) {
      controller.disconnect();
    }

    // Properly remove all media query listeners before clearing the Map
    // This is critical for React StrictMode where instances are destroyed and recreated,
    // to prevent duplicate listeners from firing with stale instance references
    for (const [, listener] of this.mediaQueryListeners.entries()) {
      listener.mql.removeEventListener('change', listener.handler);
    }
    this.mediaQueryListeners.clear();
    this.addedInteractions = {};
    this.listInteractionsCache = {};
    this.controllers.clear();
    this.dataCache = { effects: {}, sequences: {}, conditions: {}, interactions: {} };
    Interact.instances.splice(Interact.instances.indexOf(this), 1);
  }

  setController(key: string, controller: IInteractionController) {
    this.controllers.add(controller);

    Interact.setController(key, controller);
  }

  deleteController(key: string, removeFromCache: boolean = false) {
    const controller = Interact.controllerCache.get(key);

    this.clearInteractionStateForKey(key);
    this.clearMediaQueryListenersForKey(key);

    if (controller && removeFromCache) {
      this.controllers.delete(controller);
      Interact.deleteController(key);
    }
  }

  has(key: string): boolean {
    return !!this.get(key);
  }

  get(key: string): InteractCache['interactions'][string] | undefined {
    const processedKey = _convertToKeyTemplate(key);
    return this.dataCache.interactions[processedKey];
  }

  clearMediaQueryListenersForKey(key: string): void {
    for (const [id, listener] of this.mediaQueryListeners.entries()) {
      if (listener.key === key) {
        listener.mql.removeEventListener('change', listener.handler);
        this.mediaQueryListeners.delete(id);
      }
    }
  }

  clearInteractionStateForKey(key: string): void {
    const interactionIds = this.get(key)?.interactionIds || [];

    interactionIds.forEach((interactionId_) => {
      const interactionId = getInterpolatedKey(interactionId_, key);
      delete this.addedInteractions[interactionId];
    });
  }

  setupMediaQueryListener(id: string, mql: MediaQueryList, key: string, handler: () => void) {
    if (this.mediaQueryListeners.has(id)) {
      return;
    }

    mql.addEventListener('change', handler);

    this.mediaQueryListeners.set(id, {
      mql,
      handler,
      key,
    });
  }

  static create(config: InteractConfig, options?: { useCutsomElement?: boolean }): Interact {
    const instance = new Interact();
    Interact.instances.push(instance);

    instance.init(config, options);

    return instance;
  }

  static destroy(): void {
    Interact.controllerCache.forEach((controller: IInteractionController) => {
      controller.disconnect();
    });
    Interact.instances.length = 0;
    Interact.controllerCache.clear();
  }

  static setup(options: {
    scrollOptionsGetter?: () => Partial<scrollConfig>;
    pointerOptionsGetter?: () => Partial<PointerConfig>;
    viewEnter?: Partial<ViewEnterParams>;
    allowA11yTriggers?: boolean;
  }): void {
    if (options.scrollOptionsGetter) {
      TRIGGER_TO_HANDLER_MODULE_MAP.viewProgress.registerOptionsGetter?.(
        options.scrollOptionsGetter,
      );
    }

    if (options.pointerOptionsGetter) {
      TRIGGER_TO_HANDLER_MODULE_MAP.pointerMove.registerOptionsGetter?.(
        options.pointerOptionsGetter,
      );
    }

    if (options.viewEnter) {
      (TRIGGER_TO_HANDLER_MODULE_MAP.viewEnter as ViewEnterHandlerModule).setOptions(
        options.viewEnter,
      );
    }

    if (options.allowA11yTriggers !== undefined) {
      Interact.allowA11yTriggers = options.allowA11yTriggers;
    }
  }

  static getInstance(key: string): Interact | undefined {
    return Interact.instances.find((instance) => instance.has(key));
  }

  static getController(key: string | undefined): IInteractionController | undefined {
    return key ? Interact.controllerCache.get(key) : undefined;
  }

  static setController(key: string, controller: IInteractionController): void {
    Interact.controllerCache.set(key, controller);
  }

  static deleteController(key: string): void {
    Interact.controllerCache.delete(key);
  }

  static registerEffects = registerEffects;
}

let interactionIdCounter = 0;

/**
 * Resolves an easing value to a function.
 * Supports:
 * - Direct function references
 * - Named easings from @wix/motion library
 * - CSS cubic-bezier strings (e.g., "cubic-bezier(0.4, 0, 0.2, 1)")
 */
function resolveEasingFunction(
  easing: string | ((t: number) => number) | undefined,
): (t: number) => number {
  if (typeof easing === 'function') {
    return easing;
  }

  if (typeof easing === 'string') {
    // Check named easings first
    if (easing in jsEasings) {
      return jsEasings[easing as keyof typeof jsEasings];
    }

    // Try parsing as cubic-bezier
    const bezierFn = parseCubicBezier(easing);
    if (bezierFn) {
      return bezierFn;
    }
  }

  return jsEasings.linear;
}

/**
 * Resolves a sequence reference or inline sequence to a full Sequence object.
 */
function resolveSequence(
  seqOrRef: Sequence | SequenceRef,
  configSequences: Record<string, Sequence>,
): Sequence | null {
  const sequenceId = seqOrRef.sequenceId;
  if (!('effects' in seqOrRef) || !seqOrRef.effects) {
    const referencedSequence = configSequences[sequenceId];

    if (!referencedSequence) {
      console.warn(`Sequence with id "${sequenceId}" not found in config.sequences`);
      return null;
    }

    return {
      ...referencedSequence,
      delay: seqOrRef.delay ?? referencedSequence.delay,
      offset: seqOrRef.offset ?? referencedSequence.offset,
      offsetEasing: seqOrRef.offsetEasing ?? referencedSequence.offsetEasing,
    };
  }

  return seqOrRef;
}

/**
 * Expands effects from sequences into the effects array with calculated staggered delays.
 */
function expandSequenceEffects(
  interaction: Interaction,
  configSequences: Record<string, Sequence>,
  configEffects: Record<string, Effect>,
): (Effect | EffectRef)[] {
  const expandedEffects: (Effect | EffectRef)[] = [];

  if (interaction.sequences) {
    for (const seqOrRef of interaction.sequences) {
      const sequence = resolveSequence(seqOrRef, configSequences);
      if (!sequence) continue;

      const delay = sequence.delay ?? 0;
      const offset = sequence.offset ?? 100;
      const easingFn = resolveEasingFunction(sequence.offsetEasing);
      const offsets = calculateOffsets(sequence.effects.length, offset, easingFn);

      sequence.effects.forEach((effect, index) => {
        let resolvedEffect: Effect;
        if (isEffectReference(effect)) {
          const referencedEffect = configEffects[effect.effectId];
          resolvedEffect = referencedEffect ? { ...referencedEffect, ...effect } : effect;
        } else {
          resolvedEffect = effect;
        }

        // Calculate the total delay for this effect (sequence delay + staggered offset + effect's own delay)
        let effectDelay;
        if('delay' in resolvedEffect) {
          effectDelay = resolvedEffect.delay ?? 0;
        } else {
          effectDelay = 0;
        }
        const calculatedDelay = delay + offsets[index] + effectDelay;

        // Create a new effect with the calculated delay
        const effectWithDelay: Effect | EffectRef = {
          ...resolvedEffect,
          delay: calculatedDelay,
          // Mark this effect as part of a sequence for potential cleanup tracking
          _sequenceId: sequence.sequenceId,
          _sequenceIndex: index,
        } as any;

        expandedEffects.push(effectWithDelay);
      });
    }
  }

  return expandedEffects;
}

export function getSelector(
  d: Interaction | Effect,
  {
    asCombinator = false,
    addItemFilter = false,
    useFirstChild = false,
  }: { asCombinator?: boolean; addItemFilter?: boolean; useFirstChild?: boolean } = {},
): string {
  if (d.listContainer) {
    const itemFilter = `${addItemFilter && d.listItemSelector ? ` > ${d.listItemSelector}` : ''}`;

    if (d.selector) {
      return `${d.listContainer}${itemFilter} ${d.selector}`;
    }

    return `${d.listContainer}${itemFilter || ' > *'}`;
  } else if (d.selector) {
    return d.selector;
  }

  // TODO: consider moving :scope to be configurable since it may lead to unexpected results in some cases
  return useFirstChild ? (asCombinator ? '> :first-child' : ':scope > :first-child') : '';
}

/**
 * Parses the config object and caches interactions, effects, and conditions
 */
function parseConfig(config: InteractConfig, useCutsomElement: boolean = false): InteractCache {
  const conditions = config.conditions || {};
  const sequences = config.sequences || {};
  const interactions: InteractCache['interactions'] = {};

  config.interactions?.forEach((interaction_) => {
    const source = interaction_.key;
    const interactionIdx = ++interactionIdCounter;
    const { effects: effects_, sequences: sequences_, ...rest } = interaction_;

    if (!source) {
      console.error(`Interaction ${interactionIdx} is missing a key for source element.`);
      return;
    }

    if (!interactions[source]) {
      interactions[source] = {
        triggers: [],
        effects: {},
        interactionIds: new Set(),
        selectors: new Set(),
      };
    }

    /*
     * Expand sequence effects and combine with direct effects
     */
    const sequenceEffects = expandSequenceEffects(
      { ...interaction_, sequences: sequences_ } as Interaction,
      sequences,
      config.effects || {},
    );

    /*
     * Cache interaction trigger by source element
     */
    const effects = Array.from([...(effects_ || []), ...sequenceEffects]);
    effects.reverse(); // reverse to ensure the first effect is the one that will be applied first
    const interaction = { ...rest, effects };

    interactions[source].triggers.push(interaction);
    interactions[source].selectors.add(
      getSelector(interaction, { useFirstChild: useCutsomElement }),
    );

    const listContainer = interaction.listContainer;

    effects.forEach((effect) => {
      /*
       * Target cascade order is the first of:
       *  -> Config.interactions.effects.effect.key
       *  -> Config.effects.effect.key
       *  -> Config.interactions.interaction.key
       */
      let target = effect.key;

      if (!target && (effect as EffectRef).effectId) {
        const referencedEffect = config.effects[(effect as EffectRef).effectId];

        if (referencedEffect) {
          target = referencedEffect.key;
        }
      }

      if (!(effect as EffectRef).effectId) {
        (effect as EffectRef).effectId = generateId();
      }

      // if no target is specified, use the source element as the target
      target = target || source;
      effect.key = target;
      const effectId = (effect as EffectRef).effectId;

      if (listContainer && effect.listContainer) {
        // we do not support having 2 separate lists for same interaction
        if (target !== source || effect.listContainer !== listContainer) {
          return;
        }
      }

      const interactionId = `${target}::${effectId}::${interactionIdx}`;
      (effect as any).interactionId = interactionId;
      interactions[source].interactionIds.add(interactionId);

      if (target === source) {
        // if target is the source element, no need to add an interaction to `effects`
        return;
      }

      /*
       * Cache interaction effect by target element
       */
      if (!interactions[target]) {
        interactions[target] = {
          triggers: [],
          effects: {
            [interactionId]: [],
          },
          interactionIds: new Set(),
          selectors: new Set(),
        };
      } else if (!interactions[target].effects[interactionId]) {
        interactions[target].effects[interactionId] = [];
        interactions[target].interactionIds.add(interactionId);
      }

      interactions[target].effects[interactionId].push({ ...rest, effect });
      interactions[target].selectors.add(getSelector(effect, { useFirstChild: useCutsomElement }));
    });
  });

  return {
    effects: config.effects || {},
    sequences,
    conditions,
    interactions,
  };
}
