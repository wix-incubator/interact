import { add, remove } from '../dom/api';

export type InteractRef = (node: Element | null) => () => void;

export function createInteractRef(interactKey: string): InteractRef {
  return function (node: Element | null) {
    if (node) {
      add(node as HTMLElement, interactKey);
    } else {
      // React 18 and below
      remove(interactKey);
    }

    // React 19+
    return () => {
      remove(interactKey);
    };
  };
}
