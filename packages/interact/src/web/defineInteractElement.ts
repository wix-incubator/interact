import { getInteractElement } from './InteractElement';

export function defineInteractElement() {
  if (!customElements.get('interact-element')) {
    const interactElement = getInteractElement();
    customElements.define('interact-element', interactElement);

    return true;
  }

  return false;
}
