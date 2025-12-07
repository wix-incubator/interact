import type {
  NamedEffect,
  RangeOffset,
  ScrubTransitionEasing,
  MotionAnimationOptions,
} from '@wix/motion';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'interact-element': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        'data-interact-key'?: string;
      };
    }
  }
}

export type TriggerType =
  | 'hover'
  | 'click'
  | 'viewEnter'
  | 'pageVisible'
  | 'animationEnd'
  | 'viewProgress'
  | 'pointerMove';

export type ViewEnterType = 'once' | 'repeat' | 'alternate';

export type TransitionMethod = 'add' | 'remove' | 'toggle' | 'clear';

export type StateParams = {
  method: TransitionMethod;
};

export type PointerTriggerParams = {
  type?: ViewEnterType | 'state';
};

export type ViewEnterParams = {
  type?: ViewEnterType;
  threshold?: number;
  inset?: string;
};

export type PointerMoveParams = {
  hitArea?: 'root' | 'self';
};

export type AnimationEndParams = {
  effectId: string;
};

export type TriggerParams =
  | StateParams
  | PointerTriggerParams
  | ViewEnterParams
  | PointerMoveParams
  | AnimationEndParams;

type Fill = 'none' | 'forwards' | 'backwards' | 'both';

type MotionKeyframeEffect = {
  name: string;
  keyframes: Keyframe[];
};

type EffectEffectProperty =
  | {
      keyframeEffect: MotionKeyframeEffect;
    }
  | {
      namedEffect: NamedEffect;
    }
  | {
      customEffect: (element: Element, progress: any) => void;
    };

export type TimeEffect = {
  duration: number;
  easing?: string;
  iterations?: number;
  alternate?: boolean;
  fill?: Fill;
  reversed?: boolean;
  delay?: number;
} & EffectEffectProperty;

export type ScrubEffect = {
  easing?: string;
  iterations?: number;
  alternate?: boolean;
  fill?: Fill;
  reversed?: boolean;
  rangeStart?: RangeOffset;
  rangeEnd?: RangeOffset;
  centeredToTarget?: boolean;
  transitionDuration?: number;
  transitionDelay?: number;
  transitionEasing?: ScrubTransitionEasing;
} & EffectEffectProperty;

export type TransitionOptions = {
  duration?: number;
  delay?: number;
  easing?: string;
};

export type StyleProperty = {
  name: string;
  value: string;
};

export type TransitionProperty = StyleProperty & TransitionOptions;

export type TransitionEffect = {
  key?: string;
  effectId?: string;
} & {
  transition?: TransitionOptions & {
    styleProperties: StyleProperty[];
  };
  transitionProperties?: TransitionProperty[];
};

export type EffectBase = {
  key?: string;
  listContainer?: string;
  listItemSelector?: string;
  conditions?: string[];
  selector?: string;
  effectId?: string;
};

export type EffectRef = EffectBase & { effectId: string };

export type Effect = EffectBase & (TimeEffect | ScrubEffect | TransitionEffect);

export type Condition = {
  type: 'media' | 'container' | 'selector';
  predicate?: string;
};

export type InteractionTrigger = {
  key: string;
  listContainer?: string;
  listItemSelector?: string;
  trigger: TriggerType;
  params?: TriggerParams;
  conditions?: string[];
  selector?: string;
};

export type Interaction = InteractionTrigger & {
  effects: ((Effect | EffectRef) & { interactionId?: string })[];
};

export type InteractConfig = {
  effects: Record<string, Effect>;
  conditions?: Record<string, Condition>;
  interactions: Interaction[];
};

export type AnimationOptions<T extends 'time' | 'scrub'> =
  MotionAnimationOptions<T> & EffectEffectProperty;

/// ////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////

export interface IInteractionController {
  element: HTMLElement;
  key: string | undefined;
  connected: boolean;
  sheet: CSSStyleSheet | null;
  _observers: WeakMap<HTMLElement, MutationObserver>;
  connect(key?: string): void;
  disconnect(): void;
  update(): void;
  toggleEffect(effectId: string, method: StateParams['method'], item?: HTMLElement | null, isLegacy?: boolean): void;
  getActiveEffects(): string[];
  renderStyle(cssRules: string[]): void;
  watchChildList(listContainer: string): void;
  _childListChangeHandler(listContainer: string, entries: MutationRecord[]): void;
}

export interface IInteractElement extends HTMLElement {
  _internals: (ElementInternals & { states: Set<string> }) | null;
  connectedCallback(): void;
  disconnectedCallback(): void;
  toggleEffect(
    effectId: string,
    method: StateParams['method'],
    item?: HTMLElement | null,
  ): void;
  getActiveEffects(): string[];
}

export type InteractionParamsTypes = {
  hover: StateParams | PointerTriggerParams;
  click: StateParams | PointerTriggerParams;
  viewEnter: ViewEnterParams;
  pageVisible: ViewEnterParams;
  animationEnd: AnimationEndParams;
  viewProgress: ViewEnterParams;
  pointerMove: PointerMoveParams;
};

export type InteractOptions = {
  reducedMotion?: boolean;
  targetController?: IInteractionController;
  selectorCondition?: string;
};

export type InteractionHandlerModule<T extends TriggerType> = {
  registerOptionsGetter?: (getter: () => any) => void;
  add: (
    source: HTMLElement,
    target: HTMLElement,
    effect: Effect,
    options: InteractionParamsTypes[T],
    interactOptions: InteractOptions,
  ) => void;
  remove: (element: HTMLElement) => void;
};

export type TriggerHandlerMap<T extends TriggerType> = {
  [K in T]: InteractionHandlerModule<K>;
};

export type HandlerObject = {
  source: HTMLElement;
  target: HTMLElement;
  cleanup: () => void;
  handler?: () => void;
};

export type HandlerObjectMap = WeakMap<HTMLElement, Set<HandlerObject>>;

export type InteractCache = {
  effects: {
    [effectId: string]: Effect;
  };
  conditions: {
    [conditionId: string]: Condition;
  };
  interactions: {
    [path: string]: {
      triggers: Interaction[];
      effects: Record<
        string,
        (InteractionTrigger & { effect: Effect | EffectRef })[]
      >;
      interactionIds: Set<string>;
      selectors: Set<string>;
    };
  };
};

export type CreateTransitionCSSParams = {
  key: string;
  effectId: string;
  transition?: TransitionEffect['transition'];
  properties?: TransitionProperty[];
  childSelector?: string;
};
