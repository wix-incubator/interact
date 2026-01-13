type LengthUnit = 'px' | 'em' | 'rem' | 'vh' | 'vw' | 'vmin' | 'vmax';

export declare type Length = {
  value: number;
  type: LengthUnit;
};

export declare type Percentage = {
  value: number;
  type: 'percentage';
};

export declare type LengthPercentage = Length | Percentage;

export declare type UnitLengthPercentage = LengthPercentage;

export type Point = [number, number];

export type EffectNineDirections =
  | 'right'
  | 'top-right'
  | 'top'
  | 'top-left'
  | 'left'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'
  | 'center';

export type EffectScaleDirection = 'up' | 'down';

declare class ViewTimeline {
  constructor(options: { subject: HTMLElement });
}

declare global {
  interface Window {
    ViewTimeline: ViewTimeline;
  }
}

export type AnimationFillMode = 'none' | 'backwards' | 'forwards' | 'both';

export type BaseDataItemLike<Type extends string = string> = {
  id?: string;
  type: Type;
};

export type EffectTwoSides = 'left' | 'right';

export type EffectFourDirections = 'top' | 'right' | 'bottom' | 'left';
export type EffectFourCorners = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type EffectEightDirections = EffectFourDirections | EffectFourCorners;
export type EffectPower = 'soft' | 'medium' | 'hard';
export type EffectScrollRange = 'in' | 'out' | 'continuous';

export type FadeIn = BaseDataItemLike<'FadeIn'>;
export type ArcIn = BaseDataItemLike<'ArcIn'> & {
  direction: EffectFourDirections;
  power?: EffectPower;
};
export type CurveIn = BaseDataItemLike<'CurveIn'> & {
  direction: EffectTwoSides;
};
export type DropIn = BaseDataItemLike<'DropIn'> & {
  power?: EffectPower;
  initialScale?: number;
};
export type ExpandIn = BaseDataItemLike<'ExpandIn'> & {
  power?: EffectPower;
  direction: EffectEightDirections | 'center';
  initialScale?: number;
};
export type FlipIn = BaseDataItemLike<'FlipIn'> & {
  power?: EffectPower;
  direction: EffectFourDirections;
  initialRotate?: number;
};
export type FloatIn = BaseDataItemLike<'FloatIn'> & {
  direction: EffectFourDirections;
};
export type FoldIn = BaseDataItemLike<'FoldIn'> & {
  direction: EffectFourDirections;
  power?: EffectPower;
  initialRotate?: number;
};
export type SlideIn = BaseDataItemLike<'SlideIn'> & {
  power?: EffectPower;
  direction: EffectFourDirections;
  initialTranslate?: number;
};
export type SpinIn = BaseDataItemLike<'SpinIn'> & {
  spins: number;
  direction: 'clockwise' | 'counter-clockwise';
  power?: EffectPower;
  initialScale?: number;
};
export type BounceIn = BaseDataItemLike<'BounceIn'> & {
  direction: EffectFourDirections | 'center';
  power?: EffectPower;
  distanceFactor?: number;
};
export type PunchIn = BaseDataItemLike<'PunchIn'> & {
  direction: EffectFourCorners | 'center';
  power?: EffectPower;
};
export type GlideIn = BaseDataItemLike<'GlideIn'> & {
  direction: number;
  distance: UnitLengthPercentage;
  power?: EffectPower;
  startFromOffScreen?: boolean;
};
export type GlitchIn = BaseDataItemLike<'GlitchIn'> & {
  direction: number;
  distance: UnitLengthPercentage;
  power?: EffectPower;
  startFromOffScreen?: boolean;
};
export type TurnIn = BaseDataItemLike<'TurnIn'> & {
  direction: EffectFourCorners;
  power?: EffectPower;
};
export type CircleIn = BaseDataItemLike<'CircleIn'> & {
  direction: EffectTwoSides;
};
export type WinkIn = BaseDataItemLike<'WinkIn'> & {
  direction: 'vertical' | 'horizontal';
};
export type TiltIn = BaseDataItemLike<'TiltIn'> & {
  direction: EffectTwoSides;
};
export type ShapeIn = BaseDataItemLike<'ShapeIn'> & {
  shape: 'circle' | 'ellipse' | 'rectangle' | 'diamond' | 'window';
  direction: EffectEightDirections | 'center';
};

export type ShuttersIn = BaseDataItemLike<'ShuttersIn'> & {
  direction: EffectFourDirections;
  shutters: number;
  staggered: boolean;
  power?: EffectPower;
};
export type GrowIn = BaseDataItemLike<'GrowIn'> & {
  direction: number;
  distance: UnitLengthPercentage;
  power?: EffectPower;
  initialScale?: number;
};
export type RevealIn = BaseDataItemLike<'RevealIn'> & {
  direction: EffectFourDirections;
};
export type BlurIn = BaseDataItemLike<'BlurIn'> & {
  blur?: number;
  power?: EffectPower;
};

export type AnimationOptionsTypes = {
  time: TimeAnimationOptions & AnimationExtraOptions;
  scrub: ScrubAnimationOptions & AnimationExtraOptions;
};

export type AnimationEffectAPI<Enum extends keyof AnimationOptionsTypes> = {
  web: (
    animationOptions: AnimationOptionsTypes[Enum],
    dom?: DomApi,
    options?: Record<string, any>,
  ) => AnimationData[];
  getNames: (animationOptions: AnimationOptionsTypes[Enum]) => string[];
  style?: (options: AnimationOptionsTypes[Enum]) => AnimationData[];
  prepare?: (options: AnimationOptionsTypes[Enum], dom?: DomApi) => void;
};

export type WebAnimationEffectFactory<Enum extends keyof AnimationOptionsTypes> = (
  animationOptions: AnimationOptionsTypes[Enum],
  dom?: DomApi,
  options?: Record<string, any>,
) => AnimationData[];

export type EntranceAnimation =
  | FadeIn
  | ArcIn
  | CurveIn
  | DropIn
  | ExpandIn
  | FlipIn
  | FloatIn
  | FoldIn
  | SlideIn
  | SpinIn
  | BounceIn
  | PunchIn
  | GlideIn
  | GlitchIn
  | TurnIn
  | CircleIn
  | WinkIn
  | TiltIn
  | ShapeIn
  | ShuttersIn
  | GrowIn
  | RevealIn
  | BlurIn;
export type EntranceAnimations = Record<EntranceAnimation['type'], AnimationEffectAPI<'time'>>;

export type Breathe = BaseDataItemLike<'Breathe'> & {
  direction: 'vertical' | 'horizontal' | 'center';
  distance: UnitLengthPercentage;
};
export type Pulse = BaseDataItemLike<'Pulse'> & {
  power?: EffectPower;
  intensity?: number;
};
export type Spin = BaseDataItemLike<'Spin'> & {
  direction: 'clockwise' | 'counter-clockwise';
  power?: EffectPower;
};
export type Poke = BaseDataItemLike<'Poke'> & {
  direction: EffectFourDirections;
  power?: EffectPower;
  intensity?: number;
};
export type Flash = BaseDataItemLike<'Flash'>;
export type Swing = BaseDataItemLike<'Swing'> & {
  power?: EffectPower;
  swing?: number;
  direction?: EffectFourDirections;
};
export type Flip = BaseDataItemLike<'Flip'> & {
  direction: 'vertical' | 'horizontal';
  power?: EffectPower;
};
export type Rubber = BaseDataItemLike<'Rubber'> & {
  power?: EffectPower;
  intensity?: number;
};
export type Fold = BaseDataItemLike<'Fold'> & {
  direction: EffectFourDirections;
  power?: EffectPower;
  angle?: number;
};
export type Jello = BaseDataItemLike<'Jello'> & {
  power?: EffectPower;
  intensity?: number;
};
export type Wiggle = BaseDataItemLike<'Wiggle'> & {
  power?: EffectPower;
  intensity?: number;
};
export type Bounce = BaseDataItemLike<'Bounce'> & {
  power?: EffectPower;
  intensity?: number;
};
export type Cross = BaseDataItemLike<'Cross'> & {
  direction: EffectEightDirections;
};
export type DVD = BaseDataItemLike<'DVD'> & {
  power?: EffectPower;
};

export type Blink = BaseDataItemLike<'Blink'> & {
  power?: EffectPower;
  scale?: number;
  distance?: UnitLengthPercentage;
};

export type OngoingAnimation =
  | Breathe
  | Blink
  | Pulse
  | Spin
  | Poke
  | Flash
  | Swing
  | Flip
  | Rubber
  | Fold
  | Jello
  | Wiggle
  | Bounce
  | Cross
  | DVD;
export type OngoingAnimations = Record<OngoingAnimation['type'], AnimationEffectAPI<'time'>>;

export type ArcScroll = BaseDataItemLike<'ArcScroll'> & {
  direction: 'vertical' | 'horizontal';
  range?: EffectScrollRange;
};
export type BlurScroll = BaseDataItemLike<'BlurScroll'> & {
  power?: EffectPower;
  range?: EffectScrollRange;
  blur?: number;
};
export type FadeScroll = BaseDataItemLike<'FadeScroll'> & {
  range: EffectScrollRange;
  opacity: number;
};
export type FlipScroll = BaseDataItemLike<'FlipScroll'> & {
  direction: 'vertical' | 'horizontal';
  power?: EffectPower;
  range?: EffectScrollRange;
  rotate?: number;
};
export type GrowScroll = BaseDataItemLike<'GrowScroll'> & {
  direction: EffectNineDirections;
  power?: EffectPower;
  range?: EffectScrollRange;
  scale?: number;
  speed?: number;
};
export type MoveScroll = BaseDataItemLike<'MoveScroll'> & {
  angle: number;
  power?: EffectPower;
  range?: EffectScrollRange;
  distance?: UnitLengthPercentage;
};
export type PanScroll = BaseDataItemLike<'PanScroll'> & {
  direction: EffectTwoSides;
  distance: UnitLengthPercentage;
  startFromOffScreen: boolean;
  range?: EffectScrollRange;
};
export type ParallaxScroll = BaseDataItemLike<'ParallaxScroll'> & {
  speed: number;
  range?: EffectScrollRange;
};
export type RevealScroll = BaseDataItemLike<'RevealScroll'> & {
  direction: EffectFourDirections;
  range?: EffectScrollRange;
};
export type ShapeScroll = BaseDataItemLike<'ShapeScroll'> & {
  shape: 'circle' | 'ellipse' | 'rectangle' | 'diamond' | 'window';
  range?: EffectScrollRange;
  power?: EffectPower;
  intensity?: number;
};
export type ShrinkScroll = BaseDataItemLike<'ShrinkScroll'> & {
  direction: EffectNineDirections;
  power?: EffectPower;
  range?: EffectScrollRange;
  scale?: number;
  speed?: number;
};
export type ShuttersScroll = BaseDataItemLike<'ShuttersScroll'> & {
  direction: EffectFourDirections;
  shutters: number;
  staggered: boolean;
  range?: EffectScrollRange;
};
export type SkewPanScroll = BaseDataItemLike<'SkewPanScroll'> & {
  direction: EffectTwoSides;
  range?: EffectScrollRange;
  power?: EffectPower;
  skew?: number;
};
export type SlideScroll = BaseDataItemLike<'SlideScroll'> & {
  direction: EffectFourDirections;
  range?: EffectScrollRange;
};
export type Spin3dScroll = BaseDataItemLike<'Spin3dScroll'> & {
  range?: EffectScrollRange;
  power?: EffectPower;
  rotate?: number;
  speed?: number;
};
export type SpinScroll = BaseDataItemLike<'SpinScroll'> & {
  direction: 'clockwise' | 'counter-clockwise';
  spins: number;
  range?: EffectScrollRange;
  power?: EffectPower;
  scale?: number;
};
export type StretchScroll = BaseDataItemLike<'StretchScroll'> & {
  power?: EffectPower;
  range?: EffectScrollRange;
  stretch?: number;
};
export type TiltScroll = BaseDataItemLike<'TiltScroll'> & {
  direction: EffectTwoSides;
  range?: EffectScrollRange;
  power?: EffectPower;
  distance?: number;
};
export type TurnScroll = BaseDataItemLike<'TurnScroll'> & {
  direction: EffectTwoSides;
  spin: 'clockwise' | 'counter-clockwise';
  range?: EffectScrollRange;
  power?: EffectPower;
  scale?: number;
};

export type ScrollAnimation =
  | ArcScroll
  | BlurScroll
  | FadeScroll
  | FlipScroll
  | GrowScroll
  | MoveScroll
  | PanScroll
  | ParallaxScroll
  | RevealScroll
  | ShapeScroll
  | ShuttersScroll
  | ShrinkScroll
  | SkewPanScroll
  | SlideScroll
  | Spin3dScroll
  | SpinScroll
  | StretchScroll
  | TiltScroll
  | TurnScroll;
export type ScrollAnimations = Record<ScrollAnimation['type'], WebAnimationEffectFactory<'scrub'>>;

export type BgCloseUp = BaseDataItemLike<'BgCloseUp'> & {
  scale?: number;
};
export type BgFade = BaseDataItemLike<'BgFade'> & {
  range: 'in' | 'out';
};
export type BgFadeBack = BaseDataItemLike<'BgFadeBack'> & {
  scale?: number;
};
export type BgFake3D = BaseDataItemLike<'BgFake3D'> & {
  stretch?: number;
  zoom?: number;
};
export type BgPan = BaseDataItemLike<'BgPan'> & {
  direction: 'left' | 'right';
  speed?: number;
};
export type BgParallax = BaseDataItemLike<'BgParallax'> & {
  speed?: number;
};
export type BgPullBack = BaseDataItemLike<'BgPullBack'> & {
  scale?: number;
};
export type BgReveal = BaseDataItemLike<'BgReveal'>;
export type BgRotate = BaseDataItemLike<'BgRotate'> & {
  direction?: 'counter-clockwise' | 'clockwise';
  angle?: number;
};
export type BgSkew = BaseDataItemLike<'BgSkew'> & {
  direction?: 'counter-clockwise' | 'clockwise';
  angle?: number;
};
export type BgZoom = BaseDataItemLike<'BgZoom'> & {
  direction: 'in' | 'out';
  zoom?: number;
};
export type ImageParallax = BaseDataItemLike<'ImageParallax'> & {
  reverse?: boolean;
  speed?: number;
  isPage?: boolean;
};

export type BackgroundScrollAnimation =
  | BgCloseUp
  | BgFade
  | BgFadeBack
  | BgFake3D
  | BgPan
  | BgParallax
  | BgPullBack
  | BgReveal
  | BgRotate
  | BgSkew
  | BgZoom
  | ImageParallax;

export type BackgroundScrollAnimations = Record<
  BackgroundScrollAnimation['type'],
  WebAnimationEffectFactory<'scrub'>
>;

type MouseEffectBase = {
  inverted?: boolean;
};

type MouseEffectAxis = 'both' | 'horizontal' | 'vertical';

export type MousePivotAxis =
  | 'top'
  | 'bottom'
  | 'right'
  | 'left'
  | 'center-horizontal'
  | 'center-vertical';

export type AiryMouse = BaseDataItemLike<'AiryMouse'> &
  MouseEffectBase & {
    distance?: UnitLengthPercentage;
    axis?: MouseEffectAxis;
    angle?: number;
    power?: EffectPower;
  };
export type BlobMouse = BaseDataItemLike<'BlobMouse'> &
  MouseEffectBase & {
    distance?: UnitLengthPercentage;
    scale?: number;
    power?: EffectPower;
  };
export type BlurMouse = BaseDataItemLike<'BlurMouse'> &
  MouseEffectBase & {
    distance?: UnitLengthPercentage;
    angle?: number;
    scale?: number;
    blur?: number;
    perspective?: number;
    power?: EffectPower;
  };
export type BounceMouse = BaseDataItemLike<'BounceMouse'> &
  MouseEffectBase & {
    distance?: UnitLengthPercentage;
    axis?: MouseEffectAxis;
    power?: EffectPower;
  };
export type ScaleMouse = BaseDataItemLike<'ScaleMouse'> &
  MouseEffectBase & {
    distance?: UnitLengthPercentage;
    axis?: MouseEffectAxis;
    scale?: number;
    power?: EffectPower;
    scaleDirection: EffectScaleDirection;
  };
export type SkewMouse = BaseDataItemLike<'SkewMouse'> &
  MouseEffectBase & {
    distance?: UnitLengthPercentage;
    angle?: number;
    axis?: MouseEffectAxis;
    power?: EffectPower;
  };
export type SpinMouse = BaseDataItemLike<'SpinMouse'> &
  MouseEffectBase & {
    axis?: MouseEffectAxis;
    power?: EffectPower;
  };
export type SwivelMouse = BaseDataItemLike<'SwivelMouse'> &
  MouseEffectBase & {
    angle?: number;
    perspective?: number;
    pivotAxis?: MousePivotAxis;
    power?: EffectPower;
  };
export type Tilt3DMouse = BaseDataItemLike<'Tilt3DMouse'> &
  MouseEffectBase & {
    angle?: number;
    perspective?: number;
    power?: EffectPower;
  };
export type Track3DMouse = BaseDataItemLike<'Track3DMouse'> &
  MouseEffectBase & {
    distance?: UnitLengthPercentage;
    angle?: number;
    axis?: MouseEffectAxis;
    perspective?: number;
    power?: EffectPower;
  };
export type TrackMouse = BaseDataItemLike<'TrackMouse'> &
  MouseEffectBase & {
    distance?: UnitLengthPercentage;
    axis?: MouseEffectAxis;
    power?: EffectPower;
  };

export type CustomMouse = BaseDataItemLike<'CustomMouse'>;

export type Progress = {
  x: number;
  y: number;
  v?: { x: number; y: number };
  active?: boolean;
};
export interface MouseAnimationInstance {
  target: HTMLElement;
  play: () => void;
  progress: (progress: Progress) => void;
  cancel: () => void;
}

export interface CustomMouseAnimationInstance extends MouseAnimationInstance {
  getProgress: () => Progress;
}

export type MouseAnimationFactory = (element: HTMLElement) => MouseAnimationInstance;

export type MouseAnimationFactoryCreate = (
  options: ScrubAnimationOptions,
  dom?: DomApi,
) => MouseAnimationFactory;

export type MouseAnimation =
  | AiryMouse
  | BlobMouse
  | BlurMouse
  | BounceMouse
  | CustomMouse
  | ScaleMouse
  | SkewMouse
  | SpinMouse
  | SwivelMouse
  | Tilt3DMouse
  | Track3DMouse
  | TrackMouse;
export type MouseAnimations = Record<MouseAnimation['type'], MouseAnimationFactoryCreate>;

export type NamedEffect =
  | EntranceAnimation
  | OngoingAnimation
  | ScrollAnimation
  | MouseAnimation
  | BackgroundScrollAnimation;

export type CustomEffect =
  | {
      ranges: { name: string; min: number; max: number; step?: number }[];
    }
  | ((element: Element | null, progress: number | null) => void);

export type AnimationExtraOptions = {
  effectId?: string;
  effect?: (progress: () => number | { x: number | undefined; y: number | undefined }) => void;
};

export type AnimationOptions = (TimeAnimationOptions | ScrubAnimationOptions) &
  AnimationExtraOptions;

export type MotionAnimationOptions<T extends keyof AnimationOptionsTypes> =
  AnimationOptionsTypes[T];

export type MeasureCallback = (fn: (target: HTMLElement | null) => void) => void;
export type DomApi = { measure: MeasureCallback; mutate: MeasureCallback };

export type NamedEffectFunction = (
  options: AnimationOptions,
  domApi?: DomApi | undefined,
  config?: Record<string, any>,
) => AnimationData[];

export type ScrubTransitionEasing = 'linear' | 'hardBackOut' | 'easeOut' | 'elastic' | 'bounce';

export type RangeOffset = {
  name?: 'entry' | 'exit' | 'contain' | 'cover' | 'entry-crossing' | 'exit-crossing';
  offset?: LengthPercentage;
};

export type MotionKeyframeEffect = BaseDataItemLike<'KeyframeEffect'> & {
  name: string;
  keyframes: Keyframe[];
};

export type TimeAnimationOptions = {
  id?: string;
  keyframeEffect?: MotionKeyframeEffect;
  namedEffect?: NamedEffect;
  customEffect?: CustomEffect;
  duration?: number;
  delay?: number;
  endDelay?: number;
  easing?: string;
  iterations?: number;
  alternate?: boolean;
  fill?: AnimationFillMode;
  reversed?: boolean;
};

type ScrubAnimationDataBase = {
  id?: string;
  keyframeEffect?: MotionKeyframeEffect;
  namedEffect?: NamedEffect;
  customEffect?: CustomEffect;
  startOffset?: RangeOffset;
  endOffset?: RangeOffset;
  playbackRate?: number;
  easing?: string;
  iterations?: number;
  fill?: AnimationFillMode;
  alternate?: boolean;
  reversed?: boolean;
  transitionDuration?: number;
  transitionDelay?: number;
  transitionEasing?: ScrubTransitionEasing;
  centeredToTarget?: boolean;
};

export type ScrubAnimationOptions = ScrubAnimationDataBase & {
  duration?: LengthPercentage;
};

type AnimationDataExtra = {
  name?: string; // TODO:  need to be added to all animations and then be made required
  keyframes: Record<string, string | number | undefined>[];
  custom?: Record<string, string | number | undefined>;
  composite?: CompositeOperation;
  part?: string;
  timing?: Partial<EffectTiming>;
};

export type AnimationDataForScrub = ScrubAnimationDataBase & {
  duration?: LengthPercentage | number;
  startOffsetAdd?: string;
  endOffsetAdd?: string;
};

export type AnimationData = (TimeAnimationOptions | AnimationDataForScrub) & AnimationDataExtra;

// TODO: need it?
export type AnimationProperties = {
  groups?: string[];
  schema: { [key: string]: any };
};

export type TriggerVariant = {
  id: string;
  trigger: 'view-progress' | 'pointer-move';
  componentId: string;
};

export type AnimationGroupOptions = AnimationOptions & {
  trigger?: Partial<TriggerVariant> | undefined;
  startOffsetAdd?: string | undefined;
  endOffsetAdd?: string | undefined;
  measured?: Promise<void>;
};

export type Shape = 'ellipse' | 'circle' | 'rectangle' | 'diamond' | 'window';

export interface ScrubScrollScene {
  start: RangeOffset;
  end: RangeOffset;
  viewSource: HTMLElement;
  ready: Promise<void>;
  getProgress(): number;
  effect(__: any, p: number): void;
  disabled: boolean;
  destroy(): void;
  groupId?: string;
}

export interface ScrubPointerScene {
  target?: HTMLElement;
  centeredToTarget?: boolean;
  transitionDuration?: number;
  transitionEasing?: ScrubTransitionEasing;
  getProgress(): Progress;
  effect(p: Progress): void;
  disabled: boolean;
  destroy(): void;
  allowActiveEvent?: boolean;
}
