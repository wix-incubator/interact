import type { IInteractElement, StateParams } from '../types';
import { add, addListItems } from './add';
import { remove, removeListItems } from './remove';

export const INTERACT_EFFECT_DATA_ATTR = 'interactEffect';

export class InteractionController {
  element: HTMLElement;
  key: string | undefined;
  connected: boolean;
  sheet: CSSStyleSheet | null;
  _observers: WeakMap<HTMLElement, MutationObserver>;

  constructor(element: HTMLElement, key?: string) {
    this.element = element;
    this.key = key;
    this.connected = false;
    this.sheet = null;
    this._observers = new WeakMap();
  }

  connect(key?: string) {
    if (this.connected) {
      return;
    }

    key = key || this.key || this.element.dataset.interactKey;

    if (!key) {
      console.warn('Interact: No key provided');
      return;
    }

    this.key = key;

    this.connected = add(this);
  }

  disconnect() {
    const key = this.key || this.element.dataset.interactKey;

    if (key) {
      remove(this);
    }

    if (this.sheet) {
      const index = document.adoptedStyleSheets.indexOf(this.sheet);
      document.adoptedStyleSheets.splice(index, 1);
    }

    this._observers = new WeakMap();

    this.connected = false;
  }

  update() {
    this.disconnect();
    this.connect();
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

  toggleEffect(effectId: string, method: StateParams['method'], item?: HTMLElement | null, isLegacy?: boolean) {
    if (item === null) {
      return;
    }

    if (!isLegacy && (this.element as IInteractElement).toggleEffect) {
      (this.element as IInteractElement).toggleEffect(effectId, method, item);
      return;
    }

    const currentEffects = new Set(this.element.dataset[INTERACT_EFFECT_DATA_ATTR]?.split(' ') || []);

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

    (item || this.element).dataset[INTERACT_EFFECT_DATA_ATTR] = Array.from(currentEffects).join(' ');
  }

  getActiveEffects(): string[] {
    const raw = this.element.dataset[INTERACT_EFFECT_DATA_ATTR] || '';
    const trimmed = raw.trim();
    return trimmed ? trimmed.split(/\s+/) : [];
  }

  watchChildList(listContainer: string): void {
    const list = this.element.querySelector(listContainer);

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
    const key = this.key || this.element.dataset.interactKey;
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
    key && addListItems(this, listContainer, addedElements);
  }
}
