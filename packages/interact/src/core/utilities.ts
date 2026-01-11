import { roundNumber } from '../utils';

export function _processKeysForInterpolation(key: string) {
  return [...key.matchAll(/\[([-\w]+)]/g)].map(
    ([_, _instanceKey]) => _instanceKey,
  );
}

// TODO: currently only supports simple one-to-one mapping, e.g. item[0] -> item[0], item[1] -> item[1]
export function getInterpolatedKey(template: string, key: string) {
  const keys = _processKeysForInterpolation(key);
  let index = 0;
  return keys.length
    ? template.replace(/\[]/g, () => `[${keys[index++]}]` || '[]')
    : template;
}


function interpolateKeyframesOffsets(
  keyframes: Keyframe[],
): Keyframe[] {
  if (!keyframes || keyframes.length === 0) return [];

  const result = keyframes.map((kf) => ({ ...kf }));

  // Set first and last if not present
  if (result[0].offset === undefined) {
    result[0].offset = 0;
  }
  if (result[result.length - 1].offset === undefined) {
    result[result.length - 1].offset = 1;
  }

  // Find segments between defined offsets and interpolate
  let lastDefinedIndex = 0, currentOffset = result[lastDefinedIndex].offset as number;
  for (let i = 1; i < result.length; i++) {
    if (result[i].offset !== undefined) {
      const endOffset = result[i].offset as number;

      if (endOffset < currentOffset) {
        console.error('Offsets must be monotonically non-decreasing');
        return [];
      } else if (endOffset > 1) {
        console.error('Offsets must be in the range [0,1]');
        return [];
      }
      const gap = i - lastDefinedIndex;

      for (let j = lastDefinedIndex + 1; j < i; j++) {
        const progress = (j - lastDefinedIndex) / gap;
        result[j].offset = currentOffset + (endOffset - currentOffset) * progress;
      }

      lastDefinedIndex = i;
      currentOffset = endOffset;
    }
  }

  return result;
}

function keyframePropertyToCSS(key: string): string {
  if (key === 'cssFloat') {
		return 'float'
	}
	if (key === 'easing') {
		return 'animation-timing-function'
	}
	if (key === 'cssOffset') {
		return 'offset'
	}
	if (key === 'composite') {
		return 'animation-composition'
	}
  return key.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function keyframeObjectToKeyframeCSS(keyframeObj: Keyframe, offsetString: string): string {
  const props = Object.entries(keyframeObj)
    .filter(([key, value]) => key !== 'offset' && value !== undefined && value !== null)
    .map(([key, value]) => {
      const cssKey = keyframePropertyToCSS(key);
      return `${cssKey}: ${value};`;
    })
    .join(' ');
  return `${offsetString} { ${props} }`;
}

export function keyframesToCSS(name: string, keyframes: Keyframe[], initial?: any): string {
  if (!keyframes || keyframes.length === 0) return '';
  const interpolated = interpolateKeyframesOffsets(keyframes);

  let keyframeBlocks = interpolated
    .map((kf) => {
      const offset = kf.offset as number;
      const percentage = roundNumber(offset * 100);

      return keyframeObjectToKeyframeCSS(kf, `${percentage}%`);
    })
    .join(' ');

  if (initial) {
    const fromFrame = keyframeObjectToKeyframeCSS(initial, 'from');
    keyframeBlocks = `${fromFrame} ${keyframeBlocks}`;
  }

  return `@keyframes ${name} { ${keyframeBlocks} }`;
}
