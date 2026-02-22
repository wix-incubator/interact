import { getWebAnimation, getScrubScene } from '@wix/motion';
import type { AnimationGroup, RangeOffset, ScrubScrollScene } from '@wix/motion';

type ScrollFixtureWindow = typeof window & {
  scrubScene: AnimationGroup;
  getScrollProgress: () => number;
  rangeScene: ScrubScrollScene | null;
  rangeConfig: { startOffset: RangeOffset; endOffset: RangeOffset };
};

const target = document.getElementById('view-progress-target') as HTMLElement;
const progressDisplay = document.querySelector('[data-testid="progress-display"]') as HTMLElement;

function calculateProgress(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
  return Math.max(0, Math.min(1, progress));
}

const animationGroup = getWebAnimation(
  target,
  {
    keyframeEffect: {
      name: 'scroll-fade-slide',
      keyframes: [
        { offset: 0, opacity: 0, transform: 'translateY(60px)' },
        { offset: 1, opacity: 1, transform: 'translateY(0px)' },
      ],
    },
    duration: 1000,
    fill: 'both',
    easing: 'linear',
  },
) as AnimationGroup;

animationGroup.ready.then(() => {
  function onScroll() {
    const p = calculateProgress(target);
    animationGroup.progress(p);
    if (progressDisplay) {
      progressDisplay.textContent = `progress: ${p.toFixed(3)}`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

// Staggered scrub cards
const cards = ['scrub-card-1', 'scrub-card-2', 'scrub-card-3'];
cards.forEach((id, i) => {
  const card = document.getElementById(id) as HTMLElement;

  const cardAnimation = getWebAnimation(card, {
    keyframeEffect: {
      name: `card-enter-${i}`,
      keyframes: [
        { offset: 0, opacity: 0, transform: 'translateX(-40px)' },
        { offset: 1, opacity: 1, transform: 'translateX(0px)' },
      ],
    },
    duration: 600,
    delay: i * 80,
    fill: 'both',
    easing: 'ease-out',
  }) as AnimationGroup;

  cardAnimation.ready.then(() => {
    function onCardScroll() {
      cardAnimation.progress(calculateProgress(card));
    }
    window.addEventListener('scroll', onCardScroll, { passive: true });
    onCardScroll();
  });
});

(window as ScrollFixtureWindow).scrubScene = animationGroup;
(window as ScrollFixtureWindow).getScrollProgress = () => calculateProgress(target);

// ---------------------------------------------------------------------------
// Range offset scene — tests that startOffset/endOffset flow through the pipeline
// ---------------------------------------------------------------------------

const RANGE_START: RangeOffset = { name: 'entry' };
const RANGE_END: RangeOffset = { name: 'exit' };

const rangeSceneResult = getScrubScene(
  target,
  {
    keyframeEffect: {
      name: 'scroll-range-test',
      keyframes: [
        { offset: 0, opacity: 0 },
        { offset: 1, opacity: 1 },
      ],
    },
    startOffset: RANGE_START,
    endOffset: RANGE_END,
    fill: 'both',
  },
  { trigger: 'view-progress', element: target },
);

// getScrubScene returns ScrubScrollScene[] in the fallback path (no native ViewTimeline)
const rangeScene = Array.isArray(rangeSceneResult) ? (rangeSceneResult[0] as ScrubScrollScene) : null;

(window as ScrollFixtureWindow).rangeScene = rangeScene;
(window as ScrollFixtureWindow).rangeConfig = { startOffset: RANGE_START, endOffset: RANGE_END };
