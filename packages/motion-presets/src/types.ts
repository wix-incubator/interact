export type {
  AnimationData,
  AnimationExtraOptions,
  AnimationFillMode,
  AnimationOptions,
  CustomEffect,
  DomApi,
  EffectFourCorners,
  EffectFourDirections,
  EffectPower,
  EffectScrollRange,
  EffectTwoSides,
  Length,
  Percentage,
  Progress,
  RangeOffset,
  ScrubAnimationOptions,
  ScrubTransitionEasing,
  Shape,
  TimeAnimationOptions,
  Point,
} from '@wix/motion';

import type {
  AnimationData,
  AnimationEffectAPI,
  AnimationOptions,
  DomApi,
  EffectEightDirections,
  EffectFourCorners,
  EffectFourDirections,
  EffectNineDirections,
  EffectPower,
  EffectScaleDirection,
  EffectScrollRange,
  EffectTwoSides,
  MouseAnimationFactoryCreate,
  ScrubAnimationOptions,
  UnitLengthPercentage,
  WebAnimationEffectFactory,
} from '@wix/motion';

export type FadeIn = { type: 'FadeIn' };
export type ArcIn = {
  type: 'ArcIn';
  direction: EffectFourDirections;
  power?: EffectPower;
};
export type CurveIn = {
  type: 'CurveIn';
  direction: EffectTwoSides;
};
export type DropIn = {
  type: 'DropIn';
  power?: EffectPower;
  initialScale?: number;
};
export type ExpandIn = {
  type: 'ExpandIn';
  power?: EffectPower;
  direction: EffectEightDirections | 'center';
  initialScale?: number;
};
export type FlipIn = {
  type: 'FlipIn';
  power?: EffectPower;
  direction: EffectFourDirections;
  initialRotate?: number;
};
export type FloatIn = {
  type: 'FloatIn';
  direction: EffectFourDirections;
};
export type FoldIn = {
  type: 'FoldIn';
  direction: EffectFourDirections;
  power?: EffectPower;
  initialRotate?: number;
};
export type SlideIn = {
  type: 'SlideIn';
  power?: EffectPower;
  direction: EffectFourDirections;
  initialTranslate?: number;
};
export type SpinIn = {
  type: 'SpinIn';
  spins: number;
  direction: 'clockwise' | 'counter-clockwise';
  power?: EffectPower;
  initialScale?: number;
};
export type BounceIn = {
  type: 'BounceIn';
  direction: EffectFourDirections | 'center';
  power?: EffectPower;
  distanceFactor?: number;
};
export type PunchIn = {
  type: 'PunchIn';
  direction: EffectFourCorners | 'center';
  power?: EffectPower;
};
export type GlideIn = {
  type: 'GlideIn';
  direction: number;
  distance: UnitLengthPercentage;
  power?: EffectPower;
  startFromOffScreen?: boolean;
};
export type GlitchIn = {
  type: 'GlitchIn';
  direction: number;
  distance: UnitLengthPercentage;
  power?: EffectPower;
  startFromOffScreen?: boolean;
};
export type TurnIn = {
  type: 'TurnIn';
  direction: EffectFourCorners;
  power?: EffectPower;
};
export type CircleIn = {
  type: 'CircleIn';
  direction: EffectTwoSides;
};
export type WinkIn = {
  type: 'WinkIn';
  direction: 'vertical' | 'horizontal';
};
export type TiltIn = {
  type: 'TiltIn';
  direction: EffectTwoSides;
};
export type ShapeIn = {
  type: 'ShapeIn';
  shape: 'circle' | 'ellipse' | 'rectangle' | 'diamond' | 'window';
  direction: EffectEightDirections | 'center';
};

export type ShuttersIn = {
  type: 'ShuttersIn';
  direction: EffectFourDirections;
  shutters: number;
  staggered: boolean;
  power?: EffectPower;
};
export type GrowIn = {
  type: 'GrowIn';
  direction: number;
  distance: UnitLengthPercentage;
  power?: EffectPower;
  initialScale?: number;
};
export type RevealIn = {
  type: 'RevealIn';
  direction: EffectFourDirections;
};
export type BlurIn = {
  type: 'BlurIn';
  blur?: number;
  power?: EffectPower;
};

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

export type Breathe = {
  type: 'Breathe';
  direction: 'vertical' | 'horizontal' | 'center';
  distance: UnitLengthPercentage;
};
export type Pulse = {
  type: 'Pulse';
  power?: EffectPower;
  intensity?: number;
};
export type Spin = {
  type: 'Spin';
  direction: 'clockwise' | 'counter-clockwise';
  power?: EffectPower;
};
export type Poke = {
  type: 'Poke';
  direction: EffectFourDirections;
  power?: EffectPower;
  intensity?: number;
};
export type Flash = { type: 'Flash' };
export type Swing = {
  type: 'Swing';
  power?: EffectPower;
  swing?: number;
  direction?: EffectFourDirections;
};
export type Flip = {
  type: 'Flip';
  direction: 'vertical' | 'horizontal';
  power?: EffectPower;
};
export type Rubber = {
  type: 'Rubber';
  power?: EffectPower;
  intensity?: number;
};
export type Fold = {
  type: 'Fold';
  direction: EffectFourDirections;
  power?: EffectPower;
  angle?: number;
};
export type Jello = {
  type: 'Jello';
  power?: EffectPower;
  intensity?: number;
};
export type Wiggle = {
  type: 'Wiggle';
  power?: EffectPower;
  intensity?: number;
};
export type Bounce = {
  type: 'Bounce';
  power?: EffectPower;
  intensity?: number;
};
export type Cross = {
  type: 'Cross';
  direction: EffectEightDirections;
};
export type DVD = {
  type: 'DVD';
  power?: EffectPower;
};

export type Blink = {
  type: 'Blink';
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

export type ArcScroll = {
  type: 'ArcScroll';
  direction: 'vertical' | 'horizontal';
  range?: EffectScrollRange;
};
export type BlurScroll = {
  type: 'BlurScroll';
  power?: EffectPower;
  range?: EffectScrollRange;
  blur?: number;
};
export type FadeScroll = {
  type: 'FadeScroll';
  range: EffectScrollRange;
  opacity: number;
};
export type FlipScroll = {
  type: 'FlipScroll';
  direction: 'vertical' | 'horizontal';
  power?: EffectPower;
  range?: EffectScrollRange;
  rotate?: number;
};
export type GrowScroll = {
  type: 'GrowScroll';
  direction: EffectNineDirections;
  power?: EffectPower;
  range?: EffectScrollRange;
  scale?: number;
  speed?: number;
};
export type MoveScroll = {
  type: 'MoveScroll';
  angle: number;
  power?: EffectPower;
  range?: EffectScrollRange;
  distance?: UnitLengthPercentage;
};
export type PanScroll = {
  type: 'PanScroll';
  direction: EffectTwoSides;
  distance: UnitLengthPercentage;
  startFromOffScreen: boolean;
  range?: EffectScrollRange;
};
export type ParallaxScroll = {
  type: 'ParallaxScroll';
  speed: number;
  range?: EffectScrollRange;
};
export type RevealScroll = {
  type: 'RevealScroll';
  direction: EffectFourDirections;
  range?: EffectScrollRange;
};
export type ShapeScroll = {
  type: 'ShapeScroll';
  shape: 'circle' | 'ellipse' | 'rectangle' | 'diamond' | 'window';
  range?: EffectScrollRange;
  power?: EffectPower;
  intensity?: number;
};
export type ShrinkScroll = {
  type: 'ShrinkScroll';
  direction: EffectNineDirections;
  power?: EffectPower;
  range?: EffectScrollRange;
  scale?: number;
  speed?: number;
};
export type ShuttersScroll = {
  type: 'ShuttersScroll';
  direction: EffectFourDirections;
  shutters: number;
  staggered: boolean;
  range?: EffectScrollRange;
};
export type SkewPanScroll = {
  type: 'SkewPanScroll';
  direction: EffectTwoSides;
  range?: EffectScrollRange;
  power?: EffectPower;
  skew?: number;
};
export type SlideScroll = {
  type: 'SlideScroll';
  direction: EffectFourDirections;
  range?: EffectScrollRange;
};
export type Spin3dScroll = {
  type: 'Spin3dScroll';
  range?: EffectScrollRange;
  power?: EffectPower;
  rotate?: number;
  speed?: number;
};
export type SpinScroll = {
  type: 'SpinScroll';
  direction: 'clockwise' | 'counter-clockwise';
  spins: number;
  range?: EffectScrollRange;
  power?: EffectPower;
  scale?: number;
};
export type StretchScroll = {
  type: 'StretchScroll';
  power?: EffectPower;
  range?: EffectScrollRange;
  stretch?: number;
};
export type TiltScroll = {
  type: 'TiltScroll';
  direction: EffectTwoSides;
  range?: EffectScrollRange;
  power?: EffectPower;
  distance?: number;
};
export type TurnScroll = {
  type: 'TurnScroll';
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

export type ScrollPreset = (
  options: ScrubAnimationOptions,
  dom?: DomApi,
  config?: Record<string, any>,
) => AnimationData[];

export type ScrollAnimations = Record<ScrollAnimation['type'], AnimationEffectAPI<'scrub'>>;

export type BgCloseUp = {
  type: 'BgCloseUp';
  scale?: number;
};
export type BgFade = {
  type: 'BgFade';
  range: 'in' | 'out';
};
export type BgFadeBack = {
  type: 'BgFadeBack';
  scale?: number;
};
export type BgFake3D = {
  type: 'BgFake3D';
  stretch?: number;
  zoom?: number;
};
export type BgPan = {
  type: 'BgPan';
  direction: 'left' | 'right';
  speed?: number;
};
export type BgParallax = {
  type: 'BgParallax';
  speed?: number;
};
export type BgPullBack = {
  type: 'BgPullBack';
  scale?: number;
};
export type BgReveal = { type: 'BgReveal' };
export type BgRotate = {
  type: 'BgRotate';
  direction?: 'counter-clockwise' | 'clockwise';
  angle?: number;
};
export type BgSkew = {
  type: 'BgSkew';
  direction?: 'counter-clockwise' | 'clockwise';
  angle?: number;
};
export type BgZoom = {
  type: 'BgZoom';
  direction: 'in' | 'out';
  zoom?: number;
};
export type ImageParallax = {
  type: 'ImageParallax';
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

export type BackgroundScrollAnimationModule = {
  create: WebAnimationEffectFactory<'scrub'>;
};
export type BackgroundScrollAnimations = Record<
  BackgroundScrollAnimation['type'],
  AnimationEffectAPI<'scrub'>
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

export type AiryMouse = MouseEffectBase & {
  type: 'AiryMouse';
  distance?: UnitLengthPercentage;
  axis?: MouseEffectAxis;
  angle?: number;
  power?: EffectPower;
};
export type BlobMouse = MouseEffectBase & {
  type: 'BlobMouse';
  distance?: UnitLengthPercentage;
  scale?: number;
  power?: EffectPower;
};
export type BlurMouse = MouseEffectBase & {
  type: 'BlurMouse';
  distance?: UnitLengthPercentage;
  angle?: number;
  scale?: number;
  blur?: number;
  perspective?: number;
  power?: EffectPower;
};
export type BounceMouse = MouseEffectBase & {
  type: 'BounceMouse';
  distance?: UnitLengthPercentage;
  axis?: MouseEffectAxis;
  power?: EffectPower;
};
export type ScaleMouse = MouseEffectBase & {
  type: 'ScaleMouse';
  distance?: UnitLengthPercentage;
  axis?: MouseEffectAxis;
  scale?: number;
  power?: EffectPower;
  scaleDirection: EffectScaleDirection;
};
export type SkewMouse = MouseEffectBase & {
  type: 'SkewMouse';
  distance?: UnitLengthPercentage;
  angle?: number;
  axis?: MouseEffectAxis;
  power?: EffectPower;
};
export type SpinMouse = MouseEffectBase & {
  type: 'SpinMouse';
  axis?: MouseEffectAxis;
  power?: EffectPower;
};
export type SwivelMouse = MouseEffectBase & {
  type: 'SwivelMouse';
  angle?: number;
  perspective?: number;
  pivotAxis?: MousePivotAxis;
  power?: EffectPower;
};
export type Tilt3DMouse = MouseEffectBase & {
  type: 'Tilt3DMouse';
  angle?: number;
  perspective?: number;
  power?: EffectPower;
};
export type Track3DMouse = MouseEffectBase & {
  type: 'Track3DMouse';
  distance?: UnitLengthPercentage;
  angle?: number;
  axis?: MouseEffectAxis;
  perspective?: number;
  power?: EffectPower;
};
export type TrackMouse = MouseEffectBase & {
  type: 'TrackMouse';
  distance?: UnitLengthPercentage;
  axis?: MouseEffectAxis;
  power?: EffectPower;
};

export type CustomMouse = { type: 'CustomMouse' };

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

export type MotionPresetsAnimationOptions<TNamedEffect extends NamedEffect = NamedEffect> =
  AnimationOptions & { namedEffect?: TNamedEffect };
