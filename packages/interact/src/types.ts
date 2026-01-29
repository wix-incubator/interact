import type {
  NamedEffect,
  RangeOffset,
  ScrubTransitionEasing,
  MotionAnimationOptions,
} from '@wix/motion';

export type { RangeOffset };

export type PointerMoveAxis = 'x' | 'y';

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
  | 'pointerMove'
  | 'activate'
  | 'interest';

export type ViewEnterType = 'once' | 'repeat' | 'alternate' | 'state';

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
  useSafeViewEnter?: boolean;
};

export type PointerMoveParams = {
  hitArea?: 'root' | 'self';
  axis?: PointerMoveAxis;
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

/**
 * A Sequence is a group of Effects managed as a coordinated timeline with staggered delays.
 */
export type Sequence = {
  /**
   * Unique identifier for referencing this sequence from Interaction.sequences
   */
  sequenceId: string;
  /**
   * Fixed delay in milliseconds before the entire sequence starts.
   * @default 0
   */
  delay?: number;
  /**
   * Base offset in milliseconds between each effect in the sequence.
   * @default 100
   */
  offset?: number;
  /**
   * Easing function to apply to offset calculation.
   * Can be a JS function, a named easing from @wix/motion, or a CSS easing value.
   * @default 'linear'
   */
  offsetEasing?: string | ((t: number) => number);
  /**
   * The effects that belong to this sequence.
   * Effects will be applied in order with calculated staggered delays.
   */
  effects: (Effect | EffectRef)[];
};

/**
 * Reference to a reusable Sequence defined in InteractConfig.sequences
 */
export type SequenceRef = {
  sequenceId: string;
  /**
   * Override the delay defined in the referenced sequence
   */
  delay?: number;
  /**
   * Override the offset defined in the referenced sequence
   */
  offset?: number;
  /**
   * Override the offsetEasing defined in the referenced sequence
   */
  offsetEasing?: string | ((t: number) => number);
};

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
  /**
   * Direct effects to apply for this interaction.
   * Can be omitted if only using sequences.
   */
  effects?: ((Effect | EffectRef) & { interactionId?: string })[];
  /**
   * Sequences of effects to apply for this interaction.
   * Each sequence groups effects with staggered delays.
   */
  sequences?: (Sequence | SequenceRef)[];
};

export type InteractConfig = {
  effects: Record<string, Effect>;
  /**
   * Reusable Sequence declarations that can be referenced by Interaction.sequences
   */
  sequences?: Record<string, Sequence>;
  conditions?: Record<string, Condition>;
  interactions: Interaction[];
};

export type AnimationOptions<T extends 'time' | 'scrub'> = MotionAnimationOptions<T> &
  EffectEffectProperty;

/// ////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////
/// ////////////////////////////////////////////////////////

export interface IInteractionController {
  element: HTMLElement;
  key: string | undefined;
  connected: boolean;
  sheet: CSSStyleSheet | null;
  useFirstChild: boolean;
  _observers: WeakMap<HTMLElement, MutationObserver>;
  connect(key?: string): void;
  disconnect(options?: { removeFromCache?: boolean }): void;
  update(): void;
  toggleEffect(
    effectId: string,
    method: StateParams['method'],
    item?: HTMLElement | null,
    isLegacy?: boolean,
  ): void;
  getActiveEffects(): string[];
  renderStyle(cssRules: string[]): void;
  watchChildList(listContainer: string): void;
  _childListChangeHandler(listContainer: string, entries: MutationRecord[]): void;
}

export interface IInteractElement extends HTMLElement {
  _internals: (ElementInternals & { states: Set<string> }) | null;
  controller: IInteractionController;
  connectedCallback(): void;
  disconnectedCallback(): void;
  connect(key?: string): void;
  disconnect(options?: { removeFromCache?: boolean }): void;
  toggleEffect(effectId: string, method: StateParams['method'], item?: HTMLElement | null): void;
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
  activate: StateParams | PointerTriggerParams;
  interest: StateParams | PointerTriggerParams;
};

export type InteractOptions = {
  reducedMotion?: boolean;
  targetController?: IInteractionController;
  selectorCondition?: string;
  allowA11yTriggers?: boolean;
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

export type ViewEnterHandlerModule = InteractionHandlerModule<'viewEnter'> & {
  setOptions: (options: Partial<ViewEnterParams>) => void;
};

export type TriggerHandlerMap<T extends TriggerType> = {
  [K in T]: InteractionHandlerModule<K>;
};

export type HandlerObject = {
  source: HTMLElement;
  target: HTMLElement;
  cleanup: () => void;
  handler?: (isIntersecting?: boolean) => void;
};

export type HandlerObjectMap = WeakMap<HTMLElement, Set<HandlerObject>>;

export type InteractCache = {
  effects: {
    [effectId: string]: Effect;
  };
  sequences: {
    [sequenceId: string]: Sequence;
  };
  conditions: {
    [conditionId: string]: Condition;
  };
  interactions: {
    [path: string]: {
      triggers: Interaction[];
      effects: Record<string, (InteractionTrigger & { effect: Effect | EffectRef })[]>;
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
  selectorCondition?: string;
  useFirstChild?: boolean;
};
