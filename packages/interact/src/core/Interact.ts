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
} from '../types';
import { getInterpolatedKey } from './utilities';
import { generateId } from '../utils';
import TRIGGER_TO_HANDLER_MODULE_MAP from '../handlers';

function _convertToKeyTemplate(key: string) {
  return key.replace(/\[([-\w]+)]/g, '[]');
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
    this.dataCache = { effects: {}, conditions: {}, interactions: {} };
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
    this.dataCache = { effects: {}, conditions: {}, interactions: {} };
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
}

let interactionIdCounter = 0;

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
  const interactions: InteractCache['interactions'] = {};

  config.interactions?.forEach((interaction_) => {
    const source = interaction_.key;
    const interactionIdx = ++interactionIdCounter;
    const { effects: effects_, ...rest } = interaction_;

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
     * Cache interaction trigger by source element
     */
    const effects = Array.from(effects_);
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
      effect.interactionId = interactionId;
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
    conditions,
    interactions,
  };
}
