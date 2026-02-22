import { getWebAnimation } from '@wix/motion';
import type { AnimationGroup } from '@wix/motion';

type ResponsiveFixtureWindow = typeof window & {
  activeCondition: string;
  triggerAnimation: () => void;
  breakpointWidths: { desktop: number; tablet: number; mobile: number };
};

const desktopTarget = document.getElementById('desktop-target') as HTMLElement;
const tabletTarget = document.getElementById('tablet-target') as HTMLElement;
const mobileTarget = document.getElementById('mobile-target') as HTMLElement;
const conditionDisplay = document.querySelector('[data-testid="condition-display"]') as HTMLElement;
const viewportDisplay = document.querySelector('[data-testid="viewport-display"]') as HTMLElement;

const BREAKPOINTS = {
  desktop: '(min-width: 1025px)',
  tablet: '(min-width: 768px) and (max-width: 1024px)',
  mobile: '(max-width: 767px)',
} as const;

type BreakpointKey = keyof typeof BREAKPOINTS;

function getActiveBreakpoint(): BreakpointKey | 'none' {
  for (const [key, query] of Object.entries(BREAKPOINTS) as [BreakpointKey, string][]) {
    if (window.matchMedia(query).matches) {
      return key;
    }
  }
  return 'none';
}

function updateConditionDisplay() {
  const active = getActiveBreakpoint();
  (window as ResponsiveFixtureWindow).activeCondition = active;

  if (conditionDisplay) {
    conditionDisplay.textContent = active;
  }
  if (viewportDisplay) {
    viewportDisplay.textContent = `${window.innerWidth}px`;
  }
}

function runAnimation(target: HTMLElement, name: string): AnimationGroup | null {
  const group = getWebAnimation(target, {
    keyframeEffect: {
      name,
      keyframes: [
        { offset: 0, opacity: 0, transform: 'scale(0.7)' },
        { offset: 0.6, opacity: 1, transform: 'scale(1.05)' },
        { offset: 1, opacity: 1, transform: 'scale(1)' },
      ],
    },
    duration: 600,
    fill: 'both',
    easing: 'ease-out',
  }) as AnimationGroup;

  group?.play();
  return group;
}

function triggerAnimation() {
  updateConditionDisplay();
  const active = getActiveBreakpoint();

  if (active === 'desktop') {
    runAnimation(desktopTarget, 'responsive-desktop');
  } else if (active === 'tablet') {
    runAnimation(tabletTarget, 'responsive-tablet');
  } else if (active === 'mobile') {
    runAnimation(mobileTarget, 'responsive-mobile');
  }
}

// Track active breakpoint reactively via matchMedia listeners
for (const [key, query] of Object.entries(BREAKPOINTS) as [BreakpointKey, string][]) {
  window.matchMedia(query).addEventListener('change', (e) => {
    if (e.matches) {
      (window as ResponsiveFixtureWindow).activeCondition = key;
      updateConditionDisplay();
    }
  });
}

updateConditionDisplay();

// Expose to tests
(window as ResponsiveFixtureWindow).activeCondition = getActiveBreakpoint();
(window as ResponsiveFixtureWindow).triggerAnimation = triggerAnimation;
(window as ResponsiveFixtureWindow).breakpointWidths = { desktop: 1200, tablet: 900, mobile: 400 };
