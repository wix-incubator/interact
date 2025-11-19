/* eslint-disable prettier/prettier */
import type { Blink, TimeAnimationOptions, DomApi } from '../../types';
import { getCssUnits, getEasing, mapRange } from '../../utils';

const POWER_TO_BLINK_FACTOR_MAP = {
  soft: {
    maxScaleBy: 0,
    maxTranslateBy: 50,
  },
  medium: {
    maxScaleBy: 0.5,
    maxTranslateBy: 100,
  },
  hard: {
    maxScaleBy: 0.7,
    maxTranslateBy: 200,
  },
};

const BASE_POSITION = {
  translate: `0 0`,
  scale: 1,
};

const TOTAL_BLINKS = 10;
const TRANSITION_MS = 500;
const SCALE_RANGE = { min: 0, max: 0.7 };
const SCALE_OFFSET = 0.02;

const getRandomsBySeed = (seed: number) =>
  [0.3, 0.45, 0.7].map((n) => (seed * n) % 1);

export function web(options: TimeAnimationOptions, _?: DomApi) {
  const {
    power,
    scale = 0,
    distance = { value: 50, type: 'percentage' },
  } = options.namedEffect as Blink;

  const isResponsive = typeof power === 'undefined';
  const duration = options.duration ?? 0; // the duration in which the element is visible
  const delay = options.delay ?? 0; // the duration in which the element is hidden 
  const totalDuration = (duration + delay + 2 * TRANSITION_MS) * (TOTAL_BLINKS - 1);
  const easing = getEasing(isResponsive ? options.easing || 'backInOut' : 'backInOut')
  const travelUnits = getCssUnits(distance.type);
  const [name] = getNames(options);
  const keyframes = [];

  const scaleMappedFromRange = mapRange(
    0,
    1,
    SCALE_RANGE.min,
    SCALE_RANGE.max,
    scale,
  );

  const { maxScaleBy, maxTranslateBy } = isResponsive
    ? {
        maxScaleBy: scaleMappedFromRange,
        maxTranslateBy: distance.value,
      }
    : POWER_TO_BLINK_FACTOR_MAP[power];

 
  for (let i = 0; i < TOTAL_BLINKS; i++) {
    const randoms = getRandomsBySeed(i + 1); // perhaps insert seed in future use
    const translateY = Math.round(randoms[0] * 2 * maxTranslateBy) - maxTranslateBy;
    const translateX = Math.round(randoms[1] * 2 * maxTranslateBy) - maxTranslateBy;
    const scaleBy = 1 + (randoms[2] * maxScaleBy * (i % 2 === 0 ? 1 : -1));

    const blink = {
      translate: `${translateX}${travelUnits} ${translateY}${travelUnits}`,
      scale: scaleBy,
      easing,
      ...(i === 0 || i === TOTAL_BLINKS - 1 ? BASE_POSITION : {}), // override if its first or last blink
    };

    /* 
      4 offset points to each blink: 
      two for opacity: 1, and two for opacity: 0. 
    */
    const offsets = {
      hiddenEnd: (TRANSITION_MS * (i * 2 - 1) + duration * (i - 1) + delay * i) / totalDuration,
      visibleStart: (TRANSITION_MS * (i * 2) + duration * (i - 1) + delay * i) / totalDuration,
      visibleEnd: (TRANSITION_MS * (i * 2) + duration * i + delay * i) / totalDuration,
      hiddenStart: (TRANSITION_MS * (i * 2 + 1) + duration * i + delay * i) / totalDuration,
    };

    if (i > 0) {
      keyframes.push(
        ...[
          {
            ...blink,
            opacity: 0,
            scale: blink.scale - SCALE_OFFSET,
            offset: offsets.hiddenEnd,
          },
          {
            ...blink,
            opacity: 1,
            offset: offsets.visibleStart,
          },
        ],
      );
    }
    keyframes.push({
      ...blink,
      opacity: 1,
      offset: offsets.visibleEnd,
    });

    if (i < TOTAL_BLINKS - 1) {
      keyframes.push({
        ...blink,
        opacity: 0,
        scale: blink.scale - SCALE_OFFSET,
        offset: offsets.hiddenStart,
      });
    }
  }

  return [
    {
      ...options,
      name,
      easing: 'linear',
      delay: 0,
      duration: totalDuration,
      keyframes,
    },
  ];
}

export function getNames(_: TimeAnimationOptions) {
  return ['motion-blink'];
}
