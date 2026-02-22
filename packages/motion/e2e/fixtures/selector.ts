import { getWebAnimation } from '@wix/motion';
import type { AnimationGroup } from '@wix/motion';

type SelectorFixtureWindow = typeof window & {
  getMatchedSelectors: () => string[];
  animateGrid: () => void;
  animateList: () => void;
};

const matchedDisplay = document.querySelector('[data-testid="matched-display"]') as HTMLElement;
const matchedSelectors: string[] = [];

function recordMatch(selector: string) {
  if (!matchedSelectors.includes(selector)) {
    matchedSelectors.push(selector);
  }
  if (matchedDisplay) {
    matchedDisplay.textContent = `matched: ${JSON.stringify(matchedSelectors)}`;
  }
}

// ---------------------------------------------------------------------------
// nth-child grid animations
// ---------------------------------------------------------------------------

function animateGrid() {
  matchedSelectors.length = 0;

  const grid = document.getElementById('nth-child-grid') as HTMLElement;
  const items = Array.from(grid.querySelectorAll('.grid-item')) as HTMLElement[];

  items.forEach((item, i) => {
    const isEven = (i + 1) % 2 === 0;
    const selector = isEven ? ':nth-child(even)' : ':nth-child(odd)';
    recordMatch(selector);

    // Even items: fade in (opacity)
    // Odd items: slide + fade in
    const keyframes: Keyframe[] = isEven
      ? [
          { offset: 0, opacity: 0, transform: 'scale(0.5)' },
          { offset: 1, opacity: 1, transform: 'scale(1)' },
        ]
      : [
          { offset: 0, opacity: 0, transform: 'translateY(20px)' },
          { offset: 1, opacity: 1, transform: 'translateY(0px)' },
        ];

    const group = getWebAnimation(item, {
      keyframeEffect: {
        name: `grid-${selector.replace(/[^a-z0-9]/g, '-')}-${i}`,
        keyframes,
      },
      duration: 500,
      delay: i * 50,
      fill: 'both',
      easing: 'ease-out',
    }) as AnimationGroup;

    group?.play();
  });
}

// ---------------------------------------------------------------------------
// List container animations
// ---------------------------------------------------------------------------

function animateList() {
  const container = document.getElementById('list-container') as HTMLElement;
  const items = Array.from(container.querySelectorAll('.list-item')) as HTMLElement[];

  items.forEach((item, i) => {
    recordMatch('list-container > .list-item');

    const group = getWebAnimation(item, {
      keyframeEffect: {
        name: `list-item-enter-${i}`,
        keyframes: [
          { offset: 0, opacity: 0, transform: 'translateX(-30px)' },
          { offset: 1, opacity: 1, transform: 'translateX(0px)' },
        ],
      },
      duration: 400,
      delay: i * 80,
      fill: 'both',
      easing: 'ease-out',
    }) as AnimationGroup;

    group?.play();
  });
}

// Expose to tests
(window as SelectorFixtureWindow).getMatchedSelectors = () => [...matchedSelectors];
(window as SelectorFixtureWindow).animateGrid = animateGrid;
(window as SelectorFixtureWindow).animateList = animateList;
