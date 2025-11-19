import {
  InteractCache,
  IInteractElement,
  InteractConfig,
  EffectRef,
  Effect,
  Interaction,
} from '../types';
import { getInterpolatedKey } from './utilities';
import { getInteractElement } from '../InteractElement';
import { generateId } from '../utils';

function registerInteractElement() {
  if (!customElements.get('interact-element')) {
    const interactElement = getInteractElement();
    customElements.define('interact-element', interactElement);

    return true;
  }

  return false;
}

function _convertToKeyTemplate(key: string) {
  return key.replace(/\[([-\w]+)]/g, '[]');
}

export class Interact {
  dataCache: InteractCache;
  addedInteractions: { [interactionId: string]: boolean };
  listInteractionsCache: {
    [listContainer: string]: { [interactionId: string]: boolean };
  };
  elements: Set<IInteractElement>;
  static forceReducedMotion: boolean = false;
  static instances: Interact[] = [];
  static elementCache = new Map<string, IInteractElement>();

  constructor() {
    this.dataCache = { effects: {}, conditions: {}, interactions: {} };
    this.addedInteractions = {};
    this.listInteractionsCache = {};
    this.elements = new Set();
  }

  init(config: InteractConfig): void {
    if (typeof window === 'undefined' || !window.customElements) {
      return;
    }

    this.dataCache = parseConfig(config);

    const didRegister = registerInteractElement();

    if (!didRegister) {
      Interact.elementCache.forEach((element: IInteractElement, key) =>
        element.connect(key),
      );
    }
  }

  destroy(): void {
    for (const element of this.elements) {
      element.disconnect();
    }
    this.addedInteractions = {};
    this.listInteractionsCache = {};
    this.elements.clear();
    this.dataCache = { effects: {}, conditions: {}, interactions: {} };
    Interact.instances.splice(Interact.instances.indexOf(this), 1);
  }

  setElement(key: string, element: IInteractElement) {
    this.elements.add(element);

    Interact.setElement(key, element);
  }

  deleteElement(key: string) {
    const element = Interact.elementCache.get(key);

    this.clearInteractionStateForKey(key);

    if (element) {
      this.elements.delete(element);
      Interact.elementCache.delete(key);
    }
  }

  has(key: string): boolean {
    return !!this.get(key);
  }

  get(key: string): InteractCache['interactions'][string] | undefined {
    const processedKey = _convertToKeyTemplate(key);
    return this.dataCache.interactions[processedKey];
  }

  clearInteractionStateForKey(key: string): void {
    const interactionIds = this.get(key)?.interactionIds || [];

    interactionIds.forEach((interactionId_) => {
      const interactionId = getInterpolatedKey(interactionId_, key);
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this.addedInteractions[interactionId];
    });
  }

  static create(config: InteractConfig): Interact {
    const instance = new Interact();
    Interact.instances.push(instance);

    instance.init(config);

    return instance;
  }

  static destroy(): void {
    Interact.elementCache.forEach((element: IInteractElement) => {
      element.disconnect();
    });
    Interact.instances.length = 0;
    Interact.elementCache.clear();
  }

  static getInstance(key: string): Interact | undefined {
    return Interact.instances.find((instance) => instance.has(key));
  }

  static getElement(key: string | undefined): IInteractElement | undefined {
    return key ? Interact.elementCache.get(key) : undefined;
  }

  static setElement(key: string, element: IInteractElement): void {
    Interact.elementCache.set(key, element);
  }
}

let interactionIdCounter = 0;

export function getSelector(
  d: Interaction | Effect,
  {
    asCombinator = false,
    addItemFilter = false,
  }: { asCombinator?: boolean; addItemFilter?: boolean } = {},
): string {
  if (d.listContainer) {
    const itemFilter = `${
      addItemFilter && d.listItemSelector ? ` > ${d.listItemSelector}` : ''
    }`;

    if (d.selector) {
      return `${d.listContainer}${itemFilter} ${d.selector}`;
    }

    return `${d.listContainer}${itemFilter || ' > *'}`;
  } else if (d.selector) {
    return d.selector;
  }

  // TODO: consider moving :scope to be configurable since it may lead to unexpected results in some cases
  return asCombinator ? '> :first-child' : ':scope > :first-child';
}

/**
 * Parses the config object and caches interactions, effects, and conditions
 */
function parseConfig(config: InteractConfig): InteractCache {
  const conditions = config.conditions || {};
  const interactions: InteractCache['interactions'] = {};

  config.interactions?.forEach((interaction_) => {
    const source = interaction_.key;
    const interactionIdx = ++interactionIdCounter;
    const { effects: effects_, ...rest } = interaction_;

    if (!source) {
      console.error(
        `Interaction ${interactionIdx} is missing a key for source element.`,
      );
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
    interactions[source].selectors.add(getSelector(interaction));

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
      interactions[target].selectors.add(getSelector(effect));
    });
  });

  return {
    effects: config.effects || {},
    conditions,
    interactions,
  };
}
