import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';

vi.mock('@wix/motion', () => ({
  getAnimation: vi.fn().mockReturnValue({
    play: vi.fn(),
    cancel: vi.fn(),
    onFinish: vi.fn(),
    pause: vi.fn(),
    reverse: vi.fn(),
    progress: vi.fn(),
    persist: vi.fn(),
    isCSS: false,
    playState: 'idle',
    ready: Promise.resolve(),
  }),
  registerEffects: vi.fn(),
  SequenceRegistry: {
    configs: new Map(),
    sequences: new Map(),
    registerEffect: vi.fn(),
    getOrCreateSequence: vi.fn(),
    clear: vi.fn(),
    clearSequence: vi.fn(),
  },
}));

vi.mock('fastdom', () => ({
  default: {
    measure: vi.fn((cb) => cb()),
    mutate: vi.fn((cb) => cb()),
  },
}));

describe('viewEnter handler', () => {
  let viewEnterHandler: any;
  let fastdom: any;
  let element: HTMLElement;
  let target: HTMLElement;
  let observerCallbacks: Array<(entries: Partial<IntersectionObserverEntry>[]) => void>;
  let observerMock: any;
  let observeSpy: MockInstance;
  let unobserveSpy: MockInstance;
  let IntersectionObserverMock: MockInstance;

  // Helper to get the main (entry) observer callback
  const getMainObserverCallback = () => observerCallbacks[0];
  // Helper to get the exit observer callback (for repeat/state types)
  const getExitObserverCallback = () => observerCallbacks[1];

  beforeEach(async () => {
    vi.resetModules();
    viewEnterHandler = ((await import('../src/handlers/viewEnter')) as any).default;
    fastdom = ((await import('fastdom')) as any).default;

    // Reset DOM
    document.body.innerHTML = '';
    element = document.createElement('div');
    target = document.createElement('div');
    document.body.appendChild(element);
    document.body.appendChild(target);

    vi.clearAllMocks();

    observeSpy = vi.fn();
    unobserveSpy = vi.fn();
    observerCallbacks = [];
    observerMock = {
      observe: observeSpy,
      unobserve: unobserveSpy,
      disconnect: vi.fn(),
    };

    IntersectionObserverMock = vi.fn(function (this: any, cb: any, _options: any) {
      observerCallbacks.push(cb);
      this.observe = observeSpy;
      this.unobserve = unobserveSpy;
      this.disconnect = vi.fn();
    }) as any;
    (window as any).IntersectionObserver = IntersectionObserverMock;
  });

  afterEach(() => {
    // Clean up handlers to prevent state leakage between tests
    if (viewEnterHandler && element) {
      viewEnterHandler.remove(element);
    }
    if (viewEnterHandler && target) {
      viewEnterHandler.remove(target);
    }
  });

  const createEntry = (
    overrides: Partial<IntersectionObserverEntry> = {},
  ): Partial<IntersectionObserverEntry> => {
    return {
      target: element,
      isIntersecting: true,
      boundingClientRect: {
        height: 100,
        width: 100,
      } as unknown as DOMRectReadOnly,
      rootBounds: {
        height: 100,
        width: 100,
      } as unknown as DOMRectReadOnly,
      ...overrides,
    };
  };

  describe('Regular flow', () => {
    it('should create an IntersectionObserver and observe the source', () => {
      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        {},
        {},
      );

      expect(IntersectionObserverMock).toHaveBeenCalled();
      expect(observeSpy).toHaveBeenCalledWith(element);
    });

    it('should unobserve after first intersection if type is "once"', () => {
      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { type: 'once' },
        {},
      );

      const entry = createEntry();
      getMainObserverCallback()([entry]);

      expect(unobserveSpy).toHaveBeenCalledWith(element);
    });
  });

  describe('Safe flow', () => {
    it('should check for safe mode conditions on first run when not intersecting', () => {
      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { useSafeViewEnter: true, threshold: 0.5 },
        {},
      );

      const entry = createEntry({
        isIntersecting: false,
        boundingClientRect: { height: 1000 } as DOMRectReadOnly,
        rootBounds: { height: 400 } as DOMRectReadOnly,
      });
      getMainObserverCallback()([entry]);

      expect(fastdom.measure).toHaveBeenCalled();
    });

    it('should switch to safe observer if element is too tall for root', () => {
      const threshold = 0.5;
      const sourceHeight = 1000;
      const rootHeight = 400; // 1000 * 0.5 = 500 > 400 -> Should trigger safe mode

      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { useSafeViewEnter: true, threshold },
        {},
      );

      const entry = createEntry({
        isIntersecting: false,
        boundingClientRect: { height: sourceHeight } as DOMRectReadOnly,
        rootBounds: { height: rootHeight } as DOMRectReadOnly,
      });

      getMainObserverCallback()([entry]);

      expect(fastdom.mutate).toHaveBeenCalled();
      expect(unobserveSpy).toHaveBeenCalledWith(element);

      expect(IntersectionObserverMock).toHaveBeenCalledTimes(2);

      const safeObserverConfig = IntersectionObserverMock.mock.calls[1][1];
      expect(safeObserverConfig.threshold).toEqual([0]);
      expect(safeObserverConfig.rootMargin).toBe('0px 0px -10% 0px');
    });

    it('should NOT switch to safe observer if element fits in root', () => {
      const threshold = 0.5;
      const sourceHeight = 600;
      const rootHeight = 400; // 600 * 0.5 = 300 < 400 -> No safe mode needed

      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { useSafeViewEnter: true, threshold },
        {},
      );

      const entry = createEntry({
        isIntersecting: false,
        boundingClientRect: { height: sourceHeight } as DOMRectReadOnly,
        rootBounds: { height: rootHeight } as DOMRectReadOnly,
      });

      getMainObserverCallback()([entry]);

      expect(fastdom.measure).toHaveBeenCalled();
      expect(fastdom.mutate).not.toHaveBeenCalled();
      expect(unobserveSpy).not.toHaveBeenCalledWith(element);
      expect(IntersectionObserverMock).toHaveBeenCalledTimes(1);
    });

    it('should NOT switch to safe observer if useSafeViewEnter is false', () => {
      const threshold = 0.5;
      const sourceHeight = 1000;
      const rootHeight = 400;

      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { useSafeViewEnter: false, threshold },
        {},
      );

      const entry = createEntry({
        isIntersecting: false,
        boundingClientRect: { height: sourceHeight } as DOMRectReadOnly,
        rootBounds: { height: rootHeight } as DOMRectReadOnly,
      });

      getMainObserverCallback()([entry]);

      expect(fastdom.measure).not.toHaveBeenCalled();
    });
  });

  describe('Alternate type', () => {
    it('should play animation on first entry', async () => {
      const { getAnimation } = await import('@wix/motion');
      const mockAnimation = (getAnimation as any)();

      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { type: 'alternate' },
        {},
      );

      const entry = createEntry({ isIntersecting: true });
      getMainObserverCallback()([entry]);

      expect(mockAnimation.play).toHaveBeenCalled();
    });

    it('should reverse animation on exit', async () => {
      const { getAnimation } = await import('@wix/motion');
      const mockAnimation = (getAnimation as any)();

      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { type: 'alternate' },
        {},
      );

      // First entry
      const entryIn = createEntry({ isIntersecting: true });
      getMainObserverCallback()([entryIn]);

      mockAnimation.reverse.mockClear();

      // Exit (alternate uses same observer)
      const entryOut = createEntry({ isIntersecting: false });
      getMainObserverCallback()([entryOut]);

      expect(mockAnimation.reverse).toHaveBeenCalled();
    });

    it('should reverse animation on subsequent re-entry', async () => {
      const { getAnimation } = await import('@wix/motion');
      const mockAnimation = (getAnimation as any)();

      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { type: 'alternate' },
        {},
      );

      // First entry
      const entryIn = createEntry({ isIntersecting: true });
      getMainObserverCallback()([entryIn]);

      // Exit
      const entryOut = createEntry({ isIntersecting: false });
      getMainObserverCallback()([entryOut]);

      mockAnimation.reverse.mockClear();

      // Re-entry - should reverse (not play)
      getMainObserverCallback()([entryIn]);

      expect(mockAnimation.reverse).toHaveBeenCalled();
    });

    it('should NOT unobserve after first intersection', () => {
      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { type: 'alternate' },
        {},
      );

      const entry = createEntry({ isIntersecting: true });
      getMainObserverCallback()([entry]);

      expect(unobserveSpy).not.toHaveBeenCalled();
    });

    it('should persist the animation', async () => {
      const { getAnimation } = await import('@wix/motion');
      const mockAnimation = (getAnimation as any)();

      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { type: 'alternate' },
        {},
      );

      expect(mockAnimation.persist).toHaveBeenCalled();
    });
  });

  describe('Repeat type', () => {
    it('should play animation from 0 on entry', async () => {
      const { getAnimation } = await import('@wix/motion');
      const mockAnimation = (getAnimation as any)();

      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { type: 'repeat' },
        {},
      );

      const entry = createEntry({ isIntersecting: true });
      getMainObserverCallback()([entry]);

      expect(mockAnimation.progress).toHaveBeenCalledWith(0);
      expect(mockAnimation.play).toHaveBeenCalled();
    });

    it('should pause and reset progress to 0 on exit', async () => {
      const { getAnimation } = await import('@wix/motion');
      const mockAnimation = (getAnimation as any)();

      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { type: 'repeat' },
        {},
      );

      // First entry
      const entryIn = createEntry({ isIntersecting: true });
      getMainObserverCallback()([entryIn]);

      mockAnimation.pause.mockClear();
      mockAnimation.progress.mockClear();

      // Exit (repeat uses separate exit observer)
      const entryOut = createEntry({ isIntersecting: false });
      getExitObserverCallback()([entryOut]);

      expect(mockAnimation.pause).toHaveBeenCalled();
      expect(mockAnimation.progress).toHaveBeenCalledWith(0);
    });

    it('should play from 0 on subsequent re-entry', async () => {
      const { getAnimation } = await import('@wix/motion');
      const mockAnimation = (getAnimation as any)();

      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { type: 'repeat' },
        {},
      );

      // First entry
      const entryIn = createEntry({ isIntersecting: true });
      getMainObserverCallback()([entryIn]);

      // Exit (repeat uses separate exit observer)
      const entryOut = createEntry({ isIntersecting: false });
      getExitObserverCallback()([entryOut]);

      mockAnimation.progress.mockClear();
      mockAnimation.play.mockClear();

      // Re-entry
      getMainObserverCallback()([entryIn]);

      expect(mockAnimation.progress).toHaveBeenCalledWith(0);
      expect(mockAnimation.play).toHaveBeenCalled();
    });

    it('should NOT unobserve after first intersection', () => {
      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { type: 'repeat' },
        {},
      );

      const entry = createEntry({ isIntersecting: true });
      getMainObserverCallback()([entry]);

      expect(unobserveSpy).not.toHaveBeenCalled();
    });

    it('should persist the animation', async () => {
      const { getAnimation } = await import('@wix/motion');
      const mockAnimation = (getAnimation as any)();

      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { type: 'repeat' },
        {},
      );

      expect(mockAnimation.persist).toHaveBeenCalled();
    });
  });

  describe('State type', () => {
    it('should play animation on first entry', async () => {
      const { getAnimation } = await import('@wix/motion');
      const mockAnimation = (getAnimation as any)();

      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { type: 'state' },
        {},
      );

      const entry = createEntry({ isIntersecting: true });
      getMainObserverCallback()([entry]);

      expect(mockAnimation.play).toHaveBeenCalled();
    });

    it('should pause animation on exit', async () => {
      const { getAnimation } = await import('@wix/motion');
      const mockAnimation = (getAnimation as any)();

      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { type: 'state' },
        {},
      );

      // First entry
      const entryIn = createEntry({ isIntersecting: true });
      getMainObserverCallback()([entryIn]);

      mockAnimation.pause.mockClear();

      // Exit (state uses separate exit observer)
      const entryOut = createEntry({ isIntersecting: false });
      getExitObserverCallback()([entryOut]);

      expect(mockAnimation.pause).toHaveBeenCalled();
    });

    it('should resume animation on subsequent re-entry', async () => {
      const { getAnimation } = await import('@wix/motion');
      const mockAnimation = (getAnimation as any)();

      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { type: 'state' },
        {},
      );

      // First entry
      const entryIn = createEntry({ isIntersecting: true });
      getMainObserverCallback()([entryIn]);

      // Exit (state uses separate exit observer)
      const entryOut = createEntry({ isIntersecting: false });
      getExitObserverCallback()([entryOut]);

      mockAnimation.play.mockClear();

      // Re-entry - should resume (calling .play() resumes)
      getMainObserverCallback()([entryIn]);

      expect(mockAnimation.play).toHaveBeenCalled();
    });

    it('should NOT reset progress on re-entry', async () => {
      const { getAnimation } = await import('@wix/motion');
      const mockAnimation = (getAnimation as any)();

      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { type: 'state' },
        {},
      );

      // First entry
      const entryIn = createEntry({ isIntersecting: true });
      getMainObserverCallback()([entryIn]);

      // Exit (state uses separate exit observer)
      const entryOut = createEntry({ isIntersecting: false });
      getExitObserverCallback()([entryOut]);

      mockAnimation.progress.mockClear();

      // Re-entry
      getMainObserverCallback()([entryIn]);

      // Should NOT call progress(0) - just resume
      expect(mockAnimation.progress).not.toHaveBeenCalled();
    });

    it('should NOT unobserve after first intersection', () => {
      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { type: 'state' },
        {},
      );

      const entry = createEntry({ isIntersecting: true });
      getMainObserverCallback()([entry]);

      expect(unobserveSpy).not.toHaveBeenCalled();
    });

    it('should persist the animation', async () => {
      const { getAnimation } = await import('@wix/motion');
      const mockAnimation = (getAnimation as any)();

      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'FadeIn' } },
        { type: 'state' },
        {},
      );

      expect(mockAnimation.persist).toHaveBeenCalled();
    });
  });

  describe('Null animation handling', () => {
    it('should not create IntersectionObserver when animation is null', async () => {
      const { getAnimation } = await import('@wix/motion');
      (getAnimation as any).mockReturnValueOnce(null);

      viewEnterHandler.add(
        element,
        target,
        { duration: 1000, namedEffect: { type: 'NonExistentEffect' } },
        {},
        {},
      );

      // IntersectionObserver should not be created when animation is null
      expect(observeSpy).not.toHaveBeenCalled();
    });
  });
});
