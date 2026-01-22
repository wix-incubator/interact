import { PanScroll, ScrubAnimationOptions, DomApi, AnimationFillMode } from '../../types';
import { getCssUnits, toKeyframeValue } from '../../utils';

export function getNames(_: ScrubAnimationOptions) {
  return ['motion-panScroll'];
}

export function prepare(options: ScrubAnimationOptions, dom?: DomApi) {
  if (options.namedEffect && (options.namedEffect as PanScroll).startFromOffScreen && dom) {
    let left = 0;
    dom.measure((target) => {
      if (!target) {
        return;
      }
      left = target.getBoundingClientRect().left;
    });
    dom.mutate((target) => {
      target?.style.setProperty('--motion-left', `${left}px`);
    });
  }
}

export function web(options: ScrubAnimationOptions, dom?: DomApi) {
  prepare(options, dom);

  return style(options, true);
}

export function style(options: ScrubAnimationOptions, asWeb = false) {
  const {
    direction = 'left',
    startFromOffScreen = true,
    range = 'in',
  } = options.namedEffect as PanScroll;
  let { distance } = options.namedEffect as PanScroll;
  if (!distance || !distance.value || !distance.type) {
    distance = { value: 400, type: 'px' };
  }
  const travel = distance.value * (direction === 'left' ? 1 : -1);
  let startX = `${-travel}${getCssUnits(distance.type)}`;
  let endX = `${travel}${getCssUnits(distance.type)}`;
  if (startFromOffScreen) {
    const startXLeft = `calc(${toKeyframeValue(
      {},
      '--motion-left',
      false,
      'calc(100vw - 100%)',
    )} * -1 - 100%)`;
    const endXLeft = `calc(100vw - ${toKeyframeValue({}, '--motion-left', false, '0px')})`;
    [startX, endX] = direction === 'left' ? [startXLeft, endXLeft] : [endXLeft, startXLeft];
  }

  const fromValue = range === 'out' ? 0 : startX;
  const toValue = range === 'in' ? 0 : range === 'out' ? startX : endX;
  const easing = 'linear';
  const fill = (
    range === 'out' ? 'forwards' : range === 'in' ? 'backwards' : options.fill
  ) as AnimationFillMode;

  const [panScroll] = getNames(options);

  const custom = {
    '--motion-pan-from': fromValue,
    '--motion-pan-to': toValue,
  };

  // use transform: translateX(<value>) and not translate: <value> because of WebKit bug: https://bugs.webkit.org/show_bug.cgi?id=276281
  return [
    {
      ...options,
      name: panScroll,
      fill,
      easing,
      custom,
      keyframes: [
        {
          transform: `translateX(${toKeyframeValue(
            custom,
            '--motion-pan-from',
            asWeb,
          )}) rotate(${toKeyframeValue({}, '--comp-rotate-z', false, '0')})`,
        },
        {
          transform: `translateX(${toKeyframeValue(
            custom,
            '--motion-pan-to',
            asWeb,
          )}) rotate(${toKeyframeValue({}, '--comp-rotate-z', false, '0')})`,
        },
      ],
    },
  ];
}
