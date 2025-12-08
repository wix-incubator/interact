import { Interact } from './Interact';
import TRIGGER_TO_HANDLER_MODULE_MAP from '../handlers';
import type { IInteractionController } from '../types';

/**
 * Removes all events and effects from an element based on config
 */
export function remove(controller: IInteractionController): void {
  const key = controller.key as string;
  const instance = Interact.getInstance(key);

  if (!instance) {
    return;
  }

  const selectors = [...(instance.get(key)?.selectors.values() || [])].join(',');
  const elements = controller.element.querySelectorAll(selectors);

  removeListItems(Array.from(elements) as HTMLElement[]);

  instance.deleteController(key);
}

export function removeListItems(elements: HTMLElement[]) {
  const modules = Object.values(TRIGGER_TO_HANDLER_MODULE_MAP);

  for (const element of elements) {
    for (const module of modules) {
      module.remove(element);
    }
  }
}
