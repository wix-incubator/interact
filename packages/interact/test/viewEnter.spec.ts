import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';

vi.mock('@wix/motion', () => ({
    getAnimation: vi.fn().mockReturnValue({
      play: vi.fn(),
      cancel: vi.fn(),
      onFinish: vi.fn(),
      isCSS: false,
      ready: Promise.resolve(),
    }),
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
    let observerCallback: (entries: Partial<IntersectionObserverEntry>[]) => void;
    let observerMock: any;
    let observeSpy: MockInstance;
    let unobserveSpy: MockInstance;
    let IntersectionObserverMock: MockInstance;
  
    beforeEach(async () => {
      vi.resetModules();
      viewEnterHandler = (await import('../src/handlers/viewEnter') as any).default;
      fastdom = (await import('fastdom') as any).default;
  
      // Reset DOM
      document.body.innerHTML = '';
      element = document.createElement('div');
      target = document.createElement('div');
      document.body.appendChild(element);
      document.body.appendChild(target);
  
      vi.clearAllMocks();
  
      observeSpy = vi.fn();
      unobserveSpy = vi.fn();
      observerMock = {
        observe: observeSpy,
        unobserve: unobserveSpy,
        disconnect: vi.fn(),
      };
  
      IntersectionObserverMock = vi.fn((cb, _options) => {
        observerCallback = cb;
        return observerMock;
      });
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
        );
  
        const entry = createEntry();
        observerCallback([entry]);
  
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
        );
  
        const entry = createEntry({
          isIntersecting: false,
          boundingClientRect: { height: 1000 } as DOMRectReadOnly,
          rootBounds: { height: 400 } as DOMRectReadOnly,
        });
        observerCallback([entry]);
  
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
        );
  
        const entry = createEntry({
          isIntersecting: false,
          boundingClientRect: { height: sourceHeight } as DOMRectReadOnly,
          rootBounds: { height: rootHeight } as DOMRectReadOnly,
        });
  
        observerCallback([entry]);
  
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
        );
  
        const entry = createEntry({
          isIntersecting: false,
          boundingClientRect: { height: sourceHeight } as DOMRectReadOnly,
          rootBounds: { height: rootHeight } as DOMRectReadOnly,
        });
  
        observerCallback([entry]);
  
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
        );
  
        const entry = createEntry({
          isIntersecting: false,
          boundingClientRect: { height: sourceHeight } as DOMRectReadOnly,
          rootBounds: { height: rootHeight } as DOMRectReadOnly,
        });
  
        observerCallback([entry]);
  
        expect(fastdom.measure).not.toHaveBeenCalled();
      });
    });
  });