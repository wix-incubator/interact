import type { StateParams } from './types';
import { add, addListItems } from './core/add';
import { remove, removeListItems } from './core/remove';

export const INTERACT_EFFECT_DATA_ATTR = 'interactEffect';

export function getInteractElement() {
  let checkedForLegacyStateSyntax = false;
  let isLegacyStateSyntax = false;

  return class InteractElement extends HTMLElement {
    _internals: (ElementInternals & { states: Set<string> }) | null;
    connected: boolean;
    sheet: CSSStyleSheet | null;
    _observers: WeakMap<HTMLElement, MutationObserver>;

    constructor() {
      super();

      this.connected = false;
      this.sheet = null;
      this._observers = new WeakMap();

      if (this.attachInternals) {
        this._internals = this.attachInternals() as ElementInternals & {
          states: Set<string>;
        };

        if (!checkedForLegacyStateSyntax) {
          checkedForLegacyStateSyntax = true;

          try {
            this._internals.states.add('test');
            this._internals.states.delete('test');
          } catch (e) {
            isLegacyStateSyntax = true;
          }
        }
      } else {
        checkedForLegacyStateSyntax = true; // custom states not supported - skip syntax check
        this._internals = null;
      }
    }
    connectedCallback() {
      this.connect();
    }

    disconnectedCallback() {
      this.disconnect();
    }

    disconnect() {
      const key = this.dataset.interactKey;

      // Only call remove() if the element is actually being removed from DOM
      // If the element is still connected to the DOM (this.isConnected === true),
      // we're just disconnecting due to instance destruction (e.g., React StrictMode),
      // so we should keep the element in the cache for reconnection
      if (key && !this.isConnected) {
        remove(key);
      }

      if (this.sheet) {
        const index = document.adoptedStyleSheets.indexOf(this.sheet);
        document.adoptedStyleSheets.splice(index, 1);
      }

      this._observers = new WeakMap();

      this.connected = false;
    }

    connect(key?: string) {
      if (this.connected) {
        return;
      }

      key = key || this.dataset.interactKey;

      if (!key) {
        console.warn('InteractElement: No key provided');
        return;
      }

      this.connected = add(this, key);
    }

    renderStyle(cssRules: string[]) {
      if (!this.sheet) {
        this.sheet = new CSSStyleSheet();
        void this.sheet.replace(cssRules.join('\n'));

        document.adoptedStyleSheets.push(this.sheet);
      } else {
        let position = this.sheet.cssRules.length;

        for (const cssRule of cssRules) {
          try {
            this.sheet.insertRule(cssRule, position);
            position++;
          } catch (e) {
            console.error(e);
          }
        }
      }
    }

    toggleEffect(effectId: string, method: StateParams['method'], item?: HTMLElement | null) {
      if (item === null) {
        return;
      }
      if (isLegacyStateSyntax) {
        effectId = `--${effectId}`;
      }

      if (this._internals && !item) {
        if (method === 'toggle') {
          this._internals.states.has(effectId)
            ? this._internals.states.delete(effectId)
            : this._internals.states.add(effectId);
        } else if (method === 'add') {
          this._internals.states.add(effectId);
        } else if (method === 'remove') {
          this._internals.states.delete(effectId);
        } else if (method === 'clear') {
          this._internals.states.clear();
        }
      } else {
        const currentEffects = new Set(this.dataset[INTERACT_EFFECT_DATA_ATTR]?.split(' ') || []);

        if (method === 'toggle') {
          currentEffects.has(effectId)
            ? currentEffects.delete(effectId)
            : currentEffects.add(effectId);
        } else if (method === 'add') {
          currentEffects.add(effectId);
        } else if (method === 'remove') {
          currentEffects.delete(effectId);
        } else if (method === 'clear') {
          currentEffects.clear();
        }

        (item || this).dataset[INTERACT_EFFECT_DATA_ATTR] = Array.from(currentEffects).join(' ');
      }
    }

    getActiveEffects(): string[] {
      if (this._internals) {
        const effects = Array.from(this._internals.states);
        return isLegacyStateSyntax ? effects.map((effect) => effect.replace(/^--/g, '')) : effects;
      }

      const raw = this.dataset[INTERACT_EFFECT_DATA_ATTR] || '';
      const trimmed = raw.trim();
      return trimmed ? trimmed.split(/\s+/) : [];
    }

    watchChildList(listContainer: string): void {
      const list = this.querySelector(listContainer);

      if (list) {
        // TODO: we can probably improve this and use less observers, this impl. uses one per container element
        let observer = this._observers.get(list as HTMLElement);

        if (!observer) {
          observer = new MutationObserver(this._childListChangeHandler.bind(this, listContainer));

          this._observers.set(list as HTMLElement, observer);

          observer.observe(list as HTMLElement, { childList: true });
        }
      }
    }

    _childListChangeHandler(listContainer: string, entries: MutationRecord[]) {
      const key = this.dataset.interactKey;
      const removedElements: HTMLElement[] = [];
      const addedElements: HTMLElement[] = [];

      entries.forEach((entry) => {
        entry.removedNodes.forEach((el) => {
          if (el instanceof HTMLElement) {
            removedElements.push(el);
          }
        });

        entry.addedNodes.forEach((el) => {
          if (el instanceof HTMLElement) {
            addedElements.push(el);
          }
        });
      });

      removeListItems(removedElements);
      key && addListItems(this, key, listContainer, addedElements);
    }
  };
}
