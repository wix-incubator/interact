import {
  AnimationExtraOptions,
  DomApi,
  TimeAnimationOptions,
} from '../../types';
import type { GlitchIn } from '../../types';
import { web as glideInWeb, style as glideInStyle } from './GlideIn';

export { prepare, getNames } from './GlideIn';

function getFixedDirection(options: TimeAnimationOptions) {
  // TODO replace with structuredClone() when possible
  const duplicate = JSON.parse(JSON.stringify(options));
  const { direction } = duplicate.namedEffect as GlitchIn;

  if ((duplicate.namedEffect as GlitchIn).startFromOffScreen) {
    (duplicate.namedEffect as GlitchIn).direction = (direction ?? 270) - 90;
  } else if (typeof direction === 'undefined') {
    (duplicate.namedEffect as GlitchIn).direction = 270;
  }

  return duplicate;
}

export function web(
  options: TimeAnimationOptions & AnimationExtraOptions,
  dom?: DomApi,
) {
  return glideInWeb(getFixedDirection(options), dom);
}

export function style(options: TimeAnimationOptions) {
  return glideInStyle(getFixedDirection(options));
}
