import { InteractConfig } from '../types';

export function generate(_config: InteractConfig): string {
  const css: string[] = [
    `@media (prefers-reduced-motion: no-preference) {
  [data-interact-initial="true"] > :first-child:not([data-motion-enter="done"]) {
    visibility: hidden;
    transform: none;
    translate: none;
    scale: none;
    rotate: none;
  }
}`,
  ];

  return css.join('\n');
}
