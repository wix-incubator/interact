import { registerEffects, getWebAnimation, getCSSAnimation } from '@wix/motion';
import type { AnimationGroup } from '@wix/motion';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CssAnimationData = {
  target: string;
  animation: string;
  name: string | undefined;
  keyframes: Keyframe[];
  composition: CompositeOperation | undefined;
  custom: Record<string, string | number | undefined> | undefined;
  id: string | undefined;
  animationTimeline: string;
  animationRange: string;
};

type CustomEffectEntry = { element: Element | null; progress: number | null };

type EffectsFixtureWindow = typeof window & {
  namedWaapiGroup: AnimationGroup;
  namedCssData: CssAnimationData[];
  keyframeWaapiGroup: AnimationGroup;
  keyframeCssData: CssAnimationData[];
  customEffectGroup: AnimationGroup;
  customEffectLog: CustomEffectEntry[];
  runNamedWaapi: () => void;
  runNamedCss: () => void;
  runKeyframeWaapi: () => void;
  runKeyframeCss: () => void;
  runCustomEffect: () => void;
  runPlayback: () => void;
  runPlaybackReverse: () => void;
  runPlaybackPause: () => void;
  runPlaybackResume: () => void;
};

// ---------------------------------------------------------------------------
// Register ad-hoc named effects (self-contained, no @wix/motion-presets dep)
// ---------------------------------------------------------------------------

registerEffects({
  TestFadeIn: {
    getNames: () => ['test-fadeIn'],
    web: (options) => [
      {
        ...options,
        name: 'test-fadeIn',
        easing: 'linear',
        keyframes: [{ offset: 0, opacity: 0 }, { offset: 1, opacity: 1 }],
      },
    ],
    style: (options) => [
      {
        ...options,
        name: 'test-fadeIn',
        easing: 'linear',
        keyframes: [{ offset: 0, opacity: 0 }, { offset: 1, opacity: 1 }],
      },
    ],
  },
  TestScale: {
    getNames: () => ['test-scale'],
    web: (options) => [
      {
        ...options,
        name: 'test-scale',
        easing: 'linear',
        keyframes: [
          { offset: 0, transform: 'scale(0)' },
          { offset: 1, transform: 'scale(1)' },
        ],
      },
    ],
    style: (options) => [
      {
        ...options,
        name: 'test-scale',
        easing: 'linear',
        keyframes: [
          { offset: 0, transform: 'scale(0)' },
          { offset: 1, transform: 'scale(1)' },
        ],
      },
    ],
  },
});

// ---------------------------------------------------------------------------
// Element references
// ---------------------------------------------------------------------------

const namedWaapiEl = document.getElementById('named-waapi-target') as HTMLElement;
const namedCssEl = document.getElementById('named-css-target') as HTMLElement;
const keyframeWaapiEl = document.getElementById('keyframe-waapi-target') as HTMLElement;
const keyframeCssEl = document.getElementById('keyframe-css-target') as HTMLElement;
const customEffectEl = document.getElementById('custom-effect-target') as HTMLElement;
const playbackEl = document.getElementById('playback-target') as HTMLElement;
const playbackStateDisplay = document.querySelector('[data-testid="playback-state-display"]') as HTMLElement;

namedCssEl.id = 'named-css-target';
keyframeCssEl.id = 'keyframe-css-target';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const customEffectLog: CustomEffectEntry[] = [];
let namedWaapiGroup: AnimationGroup;
let namedCssData: CssAnimationData[];
let keyframeWaapiGroup: AnimationGroup;
let keyframeCssData: CssAnimationData[];
let customEffectGroup: AnimationGroup;
let playbackGroup: AnimationGroup;

// ---------------------------------------------------------------------------
// Named Effect — WAAPI path
// ---------------------------------------------------------------------------

function runNamedWaapi() {
  namedWaapiGroup = getWebAnimation(namedWaapiEl, {
    namedEffect: { type: 'TestFadeIn' },
    duration: 1000,
    fill: 'both',
    easing: 'linear',
  }) as AnimationGroup;

  namedWaapiGroup.play();
  (window as EffectsFixtureWindow).namedWaapiGroup = namedWaapiGroup;
}

// ---------------------------------------------------------------------------
// Named Effect — CSS path
// ---------------------------------------------------------------------------

function runNamedCss() {
  namedCssData = getCSSAnimation('named-css-target', {
    namedEffect: { type: 'TestScale' },
    duration: 1000,
    fill: 'both',
    easing: 'linear',
  }) as CssAnimationData[];

  (window as EffectsFixtureWindow).namedCssData = namedCssData;
}

// ---------------------------------------------------------------------------
// Keyframe Effect — WAAPI path
// ---------------------------------------------------------------------------

function runKeyframeWaapi() {
  keyframeWaapiGroup = getWebAnimation(keyframeWaapiEl, {
    keyframeEffect: {
      name: 'kf-slide',
      keyframes: [
        { offset: 0, transform: 'translateX(-100%)' },
        { offset: 1, transform: 'translateX(0%)' },
      ],
    },
    duration: 800,
    fill: 'both',
    easing: 'ease-out',
  }) as AnimationGroup;

  keyframeWaapiGroup.play();
  (window as EffectsFixtureWindow).keyframeWaapiGroup = keyframeWaapiGroup;
}

// ---------------------------------------------------------------------------
// Keyframe Effect — CSS path
// ---------------------------------------------------------------------------

function runKeyframeCss() {
  keyframeCssData = getCSSAnimation('keyframe-css-target', {
    keyframeEffect: {
      name: 'kf-rotate',
      keyframes: [
        { offset: 0, transform: 'rotate(0deg)' },
        { offset: 1, transform: 'rotate(360deg)' },
      ],
    },
    duration: 800,
    fill: 'both',
    easing: 'linear',
  }) as CssAnimationData[];

  (window as EffectsFixtureWindow).keyframeCssData = keyframeCssData;
}

// ---------------------------------------------------------------------------
// Custom Effect — WAAPI path
// ---------------------------------------------------------------------------

function runCustomEffect() {
  customEffectLog.length = 0;

  customEffectGroup = getWebAnimation(customEffectEl, {
    customEffect: (element: Element | null, progress: number | null) => {
      customEffectLog.push({ element, progress });
      if (element && progress !== null) {
        (element as HTMLElement).style.opacity = String(progress);
        (element as HTMLElement).style.transform = `scale(${0.5 + progress * 0.5})`;
      }
    },
    duration: 600,
    fill: 'both',
    easing: 'linear',
  }) as AnimationGroup;

  customEffectGroup.play();
  (window as EffectsFixtureWindow).customEffectGroup = customEffectGroup;
  (window as EffectsFixtureWindow).customEffectLog = customEffectLog;
}

// ---------------------------------------------------------------------------
// Playback controls
// ---------------------------------------------------------------------------

function ensurePlaybackGroup() {
  if (!playbackGroup) {
    playbackGroup = getWebAnimation(playbackEl, {
      keyframeEffect: {
        name: 'playback-test',
        keyframes: [
          { offset: 0, opacity: 0, transform: 'translateX(-60px)' },
          { offset: 1, opacity: 1, transform: 'translateX(0px)' },
        ],
      },
      duration: 2000,
      fill: 'both',
      easing: 'linear',
    }) as AnimationGroup;
  }
}

function updatePlaybackDisplay() {
  if (playbackStateDisplay) {
    playbackStateDisplay.textContent = `state: ${playbackGroup?.playState ?? 'idle'}`;
  }
}

function runPlayback() {
  ensurePlaybackGroup();
  playbackGroup.play().then(updatePlaybackDisplay);
  updatePlaybackDisplay();
}

function runPlaybackReverse() {
  ensurePlaybackGroup();
  playbackGroup.reverse().then(updatePlaybackDisplay);
  updatePlaybackDisplay();
}

function runPlaybackPause() {
  ensurePlaybackGroup();
  playbackGroup.pause();
  updatePlaybackDisplay();
}

function runPlaybackResume() {
  ensurePlaybackGroup();
  playbackGroup.play().then(updatePlaybackDisplay);
  updatePlaybackDisplay();
}

// ---------------------------------------------------------------------------
// Expose to tests
// ---------------------------------------------------------------------------

(window as EffectsFixtureWindow).customEffectLog = customEffectLog;
(window as EffectsFixtureWindow).runNamedWaapi = runNamedWaapi;
(window as EffectsFixtureWindow).runNamedCss = runNamedCss;
(window as EffectsFixtureWindow).runKeyframeWaapi = runKeyframeWaapi;
(window as EffectsFixtureWindow).runKeyframeCss = runKeyframeCss;
(window as EffectsFixtureWindow).runCustomEffect = runCustomEffect;
(window as EffectsFixtureWindow).runPlayback = runPlayback;
(window as EffectsFixtureWindow).runPlaybackReverse = runPlaybackReverse;
(window as EffectsFixtureWindow).runPlaybackPause = runPlaybackPause;
(window as EffectsFixtureWindow).runPlaybackResume = runPlaybackResume;
