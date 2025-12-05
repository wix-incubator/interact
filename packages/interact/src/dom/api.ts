import { Interact } from '../core/Interact';
import { InteractionController } from '../core/InteractionController';

export function add(element: HTMLElement, key?: string): void {
  const controller = new InteractionController(element, key);

  controller.connect();
}

export function remove(key: string): void {
  const controller = Interact.getController(key);
  if (!controller) {
    return;
  }

  controller.disconnect();
}
