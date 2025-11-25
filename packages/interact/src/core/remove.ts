import { Interact } from './Interact';
import TRIGGER_TO_HANDLER_MODULE_MAP from '../handlers';

/**
 * Removes all events and effects from an element based on config
 */
export function remove(key: string): void {
  const instance = Interact.getInstance(key);

  if (!instance) {
    // Even if no instance is found, we should ensure the element is removed from the global cache
    // This handles cases where the instance was destroyed but the element is being removed from DOM later
    const element = Interact.getElement(key);
    if (element) {
      Interact.deleteElement(key);
    }
    return;
  }

  const root = Interact.getElement(key);
  if (!root) {
    return;
  }

  const selectors = [...(instance.get(key)?.selectors.values() || [])].join(',');
  const elements = root.querySelectorAll(selectors);

  removeListItems(Array.from(elements) as HTMLElement[]);

  instance?.deleteElement(key);
}

export function removeListItems(elements: HTMLElement[]) {
  const modules = Object.values(TRIGGER_TO_HANDLER_MODULE_MAP);

  for (const element of elements) {
    for (const module of modules) {
      module.remove(element);
    }
  }
}
