import { InteractConfig } from '../types';

export function generate(_config: InteractConfig, useFirstChild: boolean = false): string {
  const css: string[] = [
    `@media (prefers-reduced-motion: no-preference) {
  [data-interact-initial="true"]${useFirstChild ? ' > :first-child' : ''}:not([data-interact-enter="done"]) {
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
