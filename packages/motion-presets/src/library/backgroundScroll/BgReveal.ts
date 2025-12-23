import type { ScrubAnimationOptions, DomApi } from '../../types';
import { measureCompHeight } from './utils';

export function create(_options: ScrubAnimationOptions, dom?: DomApi) {
  if (dom) {
    measureCompHeight({ compHeight: 0 }, dom, true);
  }
  return [];
}
