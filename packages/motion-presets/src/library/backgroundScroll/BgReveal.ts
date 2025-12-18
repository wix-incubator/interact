import type { ScrubAnimationOptions, DomApi } from '../../types';
import { measureCompHeight } from './utils';

export function web(_options: ScrubAnimationOptions, dom?: DomApi) {
  if (dom) {
    measureCompHeight({ compHeight: 0 }, dom, true);
  }
  return [];
}
