import { getWebAnimation } from '@wix/motion';
import type { AnimationGroup } from '@wix/motion';

type SelectorFixtureWindow = typeof window & {
  animateGrid: () => void;
  animateList: () => void;
};

const matchedDisplay = document.querySelector('[data-testid="matched-display"]') as HTMLElement;
const GRID_EVEN_SELECTOR = '#nth-child-grid .grid-item:nth-child(even)';
const GRID_ODD_SELECTOR = '#nth-child-grid .grid-item:nth-child(odd)';
const LIST_SELECTOR = '#list-container > .list-item';

// ---------------------------------------------------------------------------
// nth-child grid animations
// ---------------------------------------------------------------------------

function animateGrid() {
  const evenItems = Array.from(document.querySelectorAll(GRID_EVEN_SELECTOR)) as HTMLElement[];
  const oddItems = Array.from(document.querySelectorAll(GRID_ODD_SELECTOR)) as HTMLElement[];

  evenItems.forEach((item, index) => {
    const group = getWebAnimation(item, {
      keyframeEffect: {
        name: `grid-even-${index}`,
        keyframes: [
          { offset: 0, opacity: 0, transform: 'scale(0.5)' },
          { offset: 1, opacity: 1, transform: 'scale(1)' },
        ],
      },
      duration: 500,
      delay: index * 50,
      fill: 'both',
      easing: 'ease-out',
    }) as AnimationGroup;

    group?.play();
  });

  oddItems.forEach((item, index) => {
    const group = getWebAnimation(item, {
      keyframeEffect: {
        name: `grid-odd-${index}`,
        keyframes: [
          { offset: 0, opacity: 0, transform: 'translateY(20px)' },
          { offset: 1, opacity: 1, transform: 'translateY(0px)' },
        ],
      },
      duration: 500,
      delay: index * 50,
      fill: 'both',
      easing: 'ease-out',
    }) as AnimationGroup;

    group?.play();
  });

  if (matchedDisplay) {
    matchedDisplay.textContent = `selectors: even=${evenItems.length}, odd=${oddItems.length}`;
  }
}

// ---------------------------------------------------------------------------
// List container animations
// ---------------------------------------------------------------------------

function animateList() {
  const items = Array.from(document.querySelectorAll(LIST_SELECTOR)) as HTMLElement[];

  items.forEach((item, i) => {
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

  if (matchedDisplay) {
    matchedDisplay.textContent = `selector: ${LIST_SELECTOR}, count=${items.length}`;
  }
}

// Expose to tests
(window as SelectorFixtureWindow).animateGrid = animateGrid;
(window as SelectorFixtureWindow).animateList = animateList;
