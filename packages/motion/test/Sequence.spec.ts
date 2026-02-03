import { describe, expect, test, vi, beforeEach, beforeAll } from 'vitest';
import { Sequence } from '../src/Sequence';
import {
  calculateOffsets,
  parseCubicBezier,
  createCubicBezier,
  parseLinear,
  createLinear,
} from '../src/utils';
import { AnimationGroup } from '../src/AnimationGroup';
import { linear, quadIn, sineOut, cubicIn, expoIn, quadOut, cubicOut } from '../src/easings';

// Stub CSSAnimation for Node.js environment
beforeAll(() => {
  if (typeof globalThis.CSSAnimation === 'undefined') {
    (globalThis as any).CSSAnimation = class CSSAnimation {};
  }
});

describe('Sequence', () => {
  describe('calculateOffsets()', () => {
    test('should return [0] for count <= 1', () => {
      expect(calculateOffsets(0, 100, linear)).toEqual([0]);
      expect(calculateOffsets(1, 100, linear)).toEqual([0]);
    });

    test('should calculate linear offsets correctly', () => {
      // 5 items with 200ms offset, linear easing
      // indices: [0, 1, 2, 3, 4], last = 4
      // linear(0/4) * 4 * 200 = 0 * 800 = 0
      // linear(1/4) * 4 * 200 = 0.25 * 800 = 200
      // linear(2/4) * 4 * 200 = 0.5 * 800 = 400
      // linear(3/4) * 4 * 200 = 0.75 * 800 = 600
      // linear(4/4) * 4 * 200 = 1 * 800 = 800
      const result = calculateOffsets(5, 200, linear);
      expect(result).toEqual([0, 200, 400, 600, 800]);
    });

    test('should calculate quadIn offsets correctly', () => {
      // 5 items with 200ms offset, quadIn easing (t^2)
      // indices: [0, 1, 2, 3, 4], last = 4
      // quadIn(0/4) * 4 * 200 = 0^2 * 800 = 0
      // quadIn(1/4) * 4 * 200 = 0.0625 * 800 = 50
      // quadIn(2/4) * 4 * 200 = 0.25 * 800 = 200
      // quadIn(3/4) * 4 * 200 = 0.5625 * 800 = 450
      // quadIn(4/4) * 4 * 200 = 1 * 800 = 800
      const result = calculateOffsets(5, 200, quadIn);
      expect(result).toEqual([0, 50, 200, 450, 800]);
    });

    test('should calculate sineOut offsets correctly', () => {
      // 5 items with 200ms offset, sineOut easing
      const result = calculateOffsets(5, 200, sineOut);
      // sineOut(0) = 0
      // sineOut(0.25) ≈ 0.3827
      // sineOut(0.5) ≈ 0.7071
      // sineOut(0.75) ≈ 0.9239
      // sineOut(1) = 1
      expect(result[0]).toBe(0);
      expect(result[1]).toBeGreaterThan(200); // faster start
      expect(result[2]).toBeGreaterThan(400); // much faster
      expect(result[3]).toBeGreaterThan(600); // slowing down
      expect(result[4]).toBe(800);
    });

    test('should calculate cubicIn offsets correctly', () => {
      // 5 items with 100ms offset, cubicIn easing (t^3)
      const result = calculateOffsets(5, 100, cubicIn);
      expect(result[0]).toBe(0);
      expect(result[1]).toBeLessThan(100); // slow start
      expect(result[2]).toBeLessThan(200); // still slow
      expect(result[3]).toBeLessThan(300); // accelerating
      expect(result[4]).toBe(400); // last = 4, so 4 * 100 = 400
    });

    test('should handle different offset values', () => {
      const result50 = calculateOffsets(3, 50, linear);
      expect(result50).toEqual([0, 50, 100]);

      const result150 = calculateOffsets(3, 150, linear);
      expect(result150).toEqual([0, 150, 300]);

      const result1000 = calculateOffsets(3, 1000, linear);
      expect(result1000).toEqual([0, 1000, 2000]);
    });

    test('should floor results using bitwise OR', () => {
      // Test that fractional results are floored
      const result = calculateOffsets(3, 100, (t) => t * 0.333);
      // (0.333 * 0) * 2 * 100 = 0
      // (0.333 * 0.5) * 2 * 100 = 33.3 → 33
      // (0.333 * 1) * 2 * 100 = 66.6 → 66
      expect(result[0]).toBe(0);
      expect(result[1]).toBe(33);
      expect(result[2]).toBe(66);
    });
  });

  describe('Sequence class', () => {
    let mockAnimations: any[];
    let mockAnimationGroups: AnimationGroup[];

    beforeEach(() => {
      vi.clearAllMocks();

      // Create mock animations with effects
      mockAnimations = [
        {
          id: 'anim-1',
          play: vi.fn(),
          pause: vi.fn(),
          reverse: vi.fn(),
          cancel: vi.fn(),
          ready: Promise.resolve(),
          finished: Promise.resolve(),
          playState: 'idle',
          playbackRate: 1,
          effect: {
            getTiming: vi.fn(() => ({ delay: 0, duration: 1000, iterations: 1 })),
            updateTiming: vi.fn(),
            getComputedTiming: vi.fn(() => ({ progress: 0 })),
          },
        },
        {
          id: 'anim-2',
          play: vi.fn(),
          pause: vi.fn(),
          reverse: vi.fn(),
          cancel: vi.fn(),
          ready: Promise.resolve(),
          finished: Promise.resolve(),
          playState: 'idle',
          playbackRate: 1,
          effect: {
            getTiming: vi.fn(() => ({ delay: 100, duration: 800, iterations: 1 })),
            updateTiming: vi.fn(),
            getComputedTiming: vi.fn(() => ({ progress: 0.5 })),
          },
        },
        {
          id: 'anim-3',
          play: vi.fn(),
          pause: vi.fn(),
          reverse: vi.fn(),
          cancel: vi.fn(),
          ready: Promise.resolve(),
          finished: Promise.resolve(),
          playState: 'running',
          playbackRate: 1,
          effect: {
            getTiming: vi.fn(() => ({ delay: 50, duration: 1200, iterations: 1 })),
            updateTiming: vi.fn(),
            getComputedTiming: vi.fn(() => ({ progress: 0.25 })),
          },
        },
      ];

      // Create real AnimationGroup instances with mock animations
      mockAnimationGroups = [
        new AnimationGroup([mockAnimations[0]] as unknown as Animation[]),
        new AnimationGroup([mockAnimations[1]] as unknown as Animation[]),
        new AnimationGroup([mockAnimations[2]] as unknown as Animation[]),
      ];
    });

    test('should create a Sequence with default options', () => {
      const sequence = new Sequence(mockAnimationGroups);

      expect(sequence.animationGroups).toBe(mockAnimationGroups);
      expect(sequence.sequenceDelay).toBe(0);
      expect(sequence.offset).toBe(100);
      expect(typeof sequence.offsetEasing).toBe('function');
    });

    test('should create a Sequence with custom delay', () => {
      const sequence = new Sequence(mockAnimationGroups, { delay: 500 });

      expect(sequence.sequenceDelay).toBe(500);
    });

    test('should create a Sequence with custom offset', () => {
      const sequence = new Sequence(mockAnimationGroups, { offset: 200 });

      expect(sequence.offset).toBe(200);
    });

    test('should create a Sequence with string easing name', () => {
      const sequence = new Sequence(mockAnimationGroups, { offsetEasing: 'quadIn' });

      // Test that it resolves to the quadIn function
      expect(sequence.offsetEasing(0.5)).toBeCloseTo(quadIn(0.5));
    });

    test('should create a Sequence with custom easing function', () => {
      const customEasing = (t: number) => t * t * t;
      const sequence = new Sequence(mockAnimationGroups, { offsetEasing: customEasing });

      expect(sequence.offsetEasing).toBe(customEasing);
    });

    test('should fall back to linear for unknown easing names', () => {
      const sequence = new Sequence(mockAnimationGroups, { offsetEasing: 'unknownEasing' });

      // Should fall back to linear
      expect(sequence.offsetEasing(0.5)).toBe(0.5);
    });

    test('should calculate correct offsets on construction', () => {
      const sequence = new Sequence(mockAnimationGroups, { offset: 100 });
      const offsets = sequence.getOffsets();

      // 3 groups, linear easing, 100ms offset
      // last = 2
      // linear(0/2) * 2 * 100 = 0
      // linear(1/2) * 2 * 100 = 100
      // linear(2/2) * 2 * 100 = 200
      expect(offsets).toEqual([0, 100, 200]);
    });

    test('should apply delays to animation groups', () => {
      // Creating the sequence applies delays to the animation groups
      // 3 groups with offset 100: offsets = [0, 100, 200], totalSpan = 200
      new Sequence(mockAnimationGroups, { delay: 50, offset: 100 });

      // First group: delay = 50 + 0 = 50, existing delay = 0 → total = 50, endDelay = 200 - 0 = 200
      expect(mockAnimations[0].effect.updateTiming).toHaveBeenCalledWith({ delay: 50, endDelay: 200 });

      // Second group: delay = 50 + 100 = 150, existing delay = 100 → total = 250, endDelay = 200 - 100 = 100
      expect(mockAnimations[1].effect.updateTiming).toHaveBeenCalledWith({ delay: 250, endDelay: 100 });

      // Third group: delay = 50 + 200 = 250, existing delay = 50 → total = 300, endDelay = 200 - 200 = 0
      expect(mockAnimations[2].effect.updateTiming).toHaveBeenCalledWith({ delay: 300, endDelay: 0 });
    });

    test('getOffsetAt should return offset for specific index', () => {
      const sequence = new Sequence(mockAnimationGroups, { offset: 150 });

      expect(sequence.getOffsetAt(0)).toBe(0);
      expect(sequence.getOffsetAt(1)).toBe(150);
      expect(sequence.getOffsetAt(2)).toBe(300);
      expect(sequence.getOffsetAt(99)).toBe(0); // out of bounds
    });

    test('recalculateOffsets should update offsets', () => {
      const sequence = new Sequence(mockAnimationGroups, { offset: 100 });
      expect(sequence.getOffsets()).toEqual([0, 100, 200]);

      // Change offset and recalculate
      sequence.offset = 200;
      sequence.recalculateOffsets();

      expect(sequence.getOffsets()).toEqual([0, 200, 400]);
    });

    // Note: play(), pause(), reverse(), cancel(), setPlaybackRate(), onFinish(),
    // finished, and playState are inherited from AnimationGroup.
    // These tests verify that the underlying animations are controlled correctly.

    test('play should call play on all underlying animations', async () => {
      const sequence = new Sequence(mockAnimationGroups);

      await sequence.play();

      for (const animation of mockAnimations) {
        expect(animation.play).toHaveBeenCalled();
      }
    });

    test('play should execute callback after all animations are ready', async () => {
      const sequence = new Sequence(mockAnimationGroups);
      const callback = vi.fn();

      await sequence.play(callback);

      expect(callback).toHaveBeenCalled();
    });

    test('pause should call pause on all underlying animations', () => {
      const sequence = new Sequence(mockAnimationGroups);

      sequence.pause();

      for (const animation of mockAnimations) {
        expect(animation.pause).toHaveBeenCalled();
      }
    });

    test('reverse should call reverse on all underlying animations', async () => {
      const sequence = new Sequence(mockAnimationGroups);

      await sequence.reverse();

      for (const animation of mockAnimations) {
        expect(animation.reverse).toHaveBeenCalled();
      }
    });

    test('reverse should execute callback after all animations are ready', async () => {
      const sequence = new Sequence(mockAnimationGroups);
      const callback = vi.fn();

      await sequence.reverse(callback);

      expect(callback).toHaveBeenCalled();
    });

    test('cancel should call cancel on all underlying animations', () => {
      const sequence = new Sequence(mockAnimationGroups);

      sequence.cancel();

      for (const animation of mockAnimations) {
        expect(animation.cancel).toHaveBeenCalled();
      }
    });

    test('setPlaybackRate should set rate on all underlying animations', () => {
      const sequence = new Sequence(mockAnimationGroups);

      sequence.setPlaybackRate(2);

      for (const animation of mockAnimations) {
        expect(animation.playbackRate).toBe(2);
      }
    });

    test('onFinish should call callback when all animations finish', async () => {
      const sequence = new Sequence(mockAnimationGroups);
      const callback = vi.fn();

      await sequence.onFinish(callback);

      expect(callback).toHaveBeenCalled();
    });

    test('finished getter should return promise that resolves when all animations finish', async () => {
      const sequence = new Sequence(mockAnimationGroups);

      const result = await sequence.finished;

      expect(Array.isArray(result)).toBe(true);
    });

    test('playState getter should return first animation playState', () => {
      const sequence = new Sequence(mockAnimationGroups);

      // mockAnimations[0].playState is 'idle'
      expect(sequence.playState).toBe('idle');
    });

    test('playState should return undefined for empty sequence', () => {
      const emptySequence = new Sequence([]);

      expect(emptySequence.playState).toBeUndefined();
    });
  });

  describe('Sequence with various easing functions', () => {
    test('should correctly apply expoIn easing', () => {
      const result = calculateOffsets(5, 100, expoIn);

      // expoIn has very slow start, fast end
      expect(result[0]).toBe(0);
      expect(result[1]).toBeLessThan(10); // very slow start
      expect(result[4]).toBe(400); // ends at 4 * 100
    });

    test('should correctly apply custom exponential easing', () => {
      const customExpo = (t: number) => t ** 4; // quartic

      const result = calculateOffsets(5, 100, customExpo);

      expect(result[0]).toBe(0);
      expect(result[1]).toBeLessThan(50); // slow start
      expect(result[4]).toBe(400);
    });
  });

  describe('parseCubicBezier()', () => {
    test('should parse valid cubic-bezier string', () => {
      const fn = parseCubicBezier('cubic-bezier(0.4, 0, 0.2, 1)');
      expect(fn).not.toBeNull();
      expect(typeof fn).toBe('function');
    });

    test('should return correct values for standard ease-out curve', () => {
      // Standard Material Design ease-out: cubic-bezier(0, 0, 0.2, 1)
      const fn = parseCubicBezier('cubic-bezier(0, 0, 0.2, 1)')!;

      expect(fn(0)).toBe(0);
      expect(fn(1)).toBe(1);
      // This ease-out starts fast (y > x for small x values)
      expect(fn(0.25)).toBeGreaterThan(0.25);
      expect(fn(0.5)).toBeGreaterThan(0.5);
    });

    test('should return correct values for ease-in curve', () => {
      // Standard ease-in: cubic-bezier(0.4, 0, 1, 1)
      const fn = parseCubicBezier('cubic-bezier(0.4, 0, 1, 1)')!;

      expect(fn(0)).toBe(0);
      expect(fn(1)).toBe(1);
      // ease-in starts slow
      expect(fn(0.25)).toBeLessThan(0.25);
      expect(fn(0.5)).toBeLessThan(0.5);
    });

    test('should handle overshoot cubic-bezier values', () => {
      // Overshoot: cubic-bezier(0.34, 1.56, 0.64, 1)
      const fn = parseCubicBezier('cubic-bezier(0.34, 1.56, 0.64, 1)')!;

      expect(fn(0)).toBe(0);
      expect(fn(1)).toBe(1);
      // The curve overshoots past 1 in the middle
      const midValues = [fn(0.3), fn(0.4), fn(0.5), fn(0.6)];
      const hasOvershoot = midValues.some((v) => v > 1);
      expect(hasOvershoot).toBe(true);
    });

    test('should handle whitespace variations', () => {
      const fn1 = parseCubicBezier('cubic-bezier(0.4,0,0.2,1)');
      const fn2 = parseCubicBezier('cubic-bezier( 0.4 , 0 , 0.2 , 1 )');
      const fn3 = parseCubicBezier('cubic-bezier(  0.4,  0,  0.2,  1  )');

      expect(fn1).not.toBeNull();
      expect(fn2).not.toBeNull();
      expect(fn3).not.toBeNull();

      // All should produce same results
      expect(fn1!(0.5)).toBeCloseTo(fn2!(0.5), 5);
      expect(fn2!(0.5)).toBeCloseTo(fn3!(0.5), 5);
    });

    test('should be case insensitive', () => {
      const fn1 = parseCubicBezier('cubic-bezier(0.4, 0, 0.2, 1)');
      const fn2 = parseCubicBezier('CUBIC-BEZIER(0.4, 0, 0.2, 1)');
      const fn3 = parseCubicBezier('Cubic-Bezier(0.4, 0, 0.2, 1)');

      expect(fn1).not.toBeNull();
      expect(fn2).not.toBeNull();
      expect(fn3).not.toBeNull();
    });

    test('should return null for invalid strings', () => {
      expect(parseCubicBezier('ease')).toBeNull();
      expect(parseCubicBezier('linear')).toBeNull();
      expect(parseCubicBezier('cubic-bezier()')).toBeNull();
      expect(parseCubicBezier('cubic-bezier(0.4)')).toBeNull();
      expect(parseCubicBezier('cubic-bezier(0.4, 0, 0.2)')).toBeNull();
      expect(parseCubicBezier('bezier(0.4, 0, 0.2, 1)')).toBeNull();
      expect(parseCubicBezier('cubic-bezier(a, b, c, d)')).toBeNull();
    });

    test('should handle negative values', () => {
      // Back easing uses negative values
      const fn = parseCubicBezier('cubic-bezier(0.6, -0.28, 0.735, 0.045)')!;

      expect(fn).not.toBeNull();
      expect(fn(0)).toBe(0);
      expect(fn(1)).toBe(1);
    });

    test('should handle values greater than 1 for y coordinates', () => {
      // Values > 1 for y1, y2 cause overshoot
      const fn = parseCubicBezier('cubic-bezier(0.175, 0.885, 0.32, 1.275)')!;

      expect(fn).not.toBeNull();
      expect(fn(0)).toBe(0);
      expect(fn(1)).toBe(1);
    });
  });

  describe('createCubicBezier()', () => {
    test('should create linear-like function for (0, 0, 1, 1)', () => {
      const fn = createCubicBezier(0, 0, 1, 1);

      expect(fn(0)).toBe(0);
      expect(fn(0.5)).toBeCloseTo(0.5, 2);
      expect(fn(1)).toBe(1);
    });

    test('should create ease-out function for (0, 0, 0.2, 1)', () => {
      const fn = createCubicBezier(0, 0, 0.2, 1);

      expect(fn(0)).toBe(0);
      expect(fn(1)).toBe(1);
      // ease-out: fast start, slow end
      expect(fn(0.25)).toBeGreaterThan(0.25);
    });

    test('should create ease-in function for (0.4, 0, 1, 1)', () => {
      const fn = createCubicBezier(0.4, 0, 1, 1);

      expect(fn(0)).toBe(0);
      expect(fn(1)).toBe(1);
      // ease-in: slow start, fast end
      expect(fn(0.25)).toBeLessThan(0.25);
    });

    test('should handle boundary values correctly', () => {
      const fn = createCubicBezier(0.25, 0.1, 0.25, 1);

      expect(fn(0)).toBe(0);
      expect(fn(1)).toBe(1);
      expect(fn(-0.5)).toBe(0); // clamp below 0
      expect(fn(1.5)).toBe(1); // clamp above 1
    });
  });

  describe('parseLinear()', () => {
    test('should parse simple linear(0, 1) with auto-distributed stops', () => {
      const fn = parseLinear('linear(0, 1)');
      expect(fn).not.toBeNull();

      expect(fn!(0)).toBe(0);
      expect(fn!(0.5)).toBe(0.5);
      expect(fn!(1)).toBe(1);
    });

    test('should parse linear with explicit percentage stops', () => {
      const fn = parseLinear('linear(0, 0.75 25%, 1)');
      expect(fn).not.toBeNull();

      expect(fn!(0)).toBe(0);
      expect(fn!(0.25)).toBe(0.75); // explicit 75% at 25% progress
      expect(fn!(1)).toBe(1);
      // Between 25% and 100%: interpolate from 0.75 to 1
      expect(fn!(0.625)).toBeCloseTo(0.875, 5); // midpoint between 0.25 and 1
    });

    test('should return null for invalid input', () => {
      expect(parseLinear('not-linear')).toBeNull();
      expect(parseLinear('linear()')).toBeNull();
      expect(parseLinear('linear(0)')).toBeNull(); // needs at least 2 stops
      expect(parseLinear('cubic-bezier(0, 0, 1, 1)')).toBeNull();
    });
  });

  describe('createLinear()', () => {
    test('should create step-like easing with multiple stops', () => {
      // Create a "stairs" effect: 0 until 50%, then jump to 1
      const fn = createLinear([
        { value: 0, position: 0 },
        { value: 0, position: 0.5 },
        { value: 1, position: 0.5 },
        { value: 1, position: 1 },
      ]);

      expect(fn(0)).toBe(0);
      expect(fn(0.25)).toBe(0);
      expect(fn(0.5)).toBe(0); // at exact boundary, returns first matching stop
      expect(fn(0.75)).toBe(1);
      expect(fn(1)).toBe(1);
    });

    test('should handle boundary values correctly', () => {
      const fn = createLinear([
        { value: 0.2, position: 0 },
        { value: 0.8, position: 1 },
      ]);

      expect(fn(-0.5)).toBe(0.2); // clamp below returns first stop value
      expect(fn(1.5)).toBe(0.8); // clamp above returns last stop value
      expect(fn(0.5)).toBeCloseTo(0.5, 5); // midpoint
    });
  });

  describe('Sequence easing resolution', () => {
    let mockAnimationGroups: AnimationGroup[];

    beforeEach(() => {
      vi.clearAllMocks();

      // Create mock animations
      const createMockAnimation = () => ({
        play: vi.fn(),
        pause: vi.fn(),
        reverse: vi.fn(),
        cancel: vi.fn(),
        ready: Promise.resolve(),
        finished: Promise.resolve(),
        playState: 'idle',
        playbackRate: 1,
        effect: {
          getTiming: vi.fn(() => ({ delay: 0 })),
          updateTiming: vi.fn(),
          getComputedTiming: vi.fn(() => ({ progress: 0 })),
        },
      });

      // Create real AnimationGroup instances
      mockAnimationGroups = [
        new AnimationGroup([createMockAnimation()] as unknown as Animation[]),
        new AnimationGroup([createMockAnimation()] as unknown as Animation[]),
        new AnimationGroup([createMockAnimation()] as unknown as Animation[]),
      ];
    });

    describe('Named easing strings', () => {
      test('should resolve "linear" easing name', () => {
        const sequence = new Sequence(mockAnimationGroups, {
          offsetEasing: 'linear',
          offset: 100,
        });

        expect(sequence.offsetEasing(0.5)).toBeCloseTo(linear(0.5));
        expect(sequence.getOffsets()).toEqual([0, 100, 200]);
      });

      test('should resolve "quadIn" easing name', () => {
        const sequence = new Sequence(mockAnimationGroups, {
          offsetEasing: 'quadIn',
          offset: 100,
        });

        expect(sequence.offsetEasing(0.5)).toBeCloseTo(quadIn(0.5));
      });

      test('should resolve "quadOut" easing name', () => {
        const sequence = new Sequence(mockAnimationGroups, {
          offsetEasing: 'quadOut',
          offset: 100,
        });

        expect(sequence.offsetEasing(0.5)).toBeCloseTo(quadOut(0.5));
        // quadOut is faster at start, so middle item should have higher offset
        expect(sequence.getOffsets()[1]).toBeGreaterThan(100);
      });

      test('should resolve "cubicIn" easing name', () => {
        const sequence = new Sequence(mockAnimationGroups, {
          offsetEasing: 'cubicIn',
          offset: 100,
        });

        expect(sequence.offsetEasing(0.5)).toBeCloseTo(cubicIn(0.5));
      });

      test('should resolve "cubicOut" easing name', () => {
        const sequence = new Sequence(mockAnimationGroups, {
          offsetEasing: 'cubicOut',
          offset: 100,
        });

        expect(sequence.offsetEasing(0.5)).toBeCloseTo(cubicOut(0.5));
      });

      test('should resolve "expoIn" easing name', () => {
        const sequence = new Sequence(mockAnimationGroups, {
          offsetEasing: 'expoIn',
          offset: 100,
        });

        expect(sequence.offsetEasing(0.5)).toBeCloseTo(expoIn(0.5));
      });

      test('should resolve "sineOut" easing name', () => {
        const sequence = new Sequence(mockAnimationGroups, {
          offsetEasing: 'sineOut',
          offset: 100,
        });

        expect(sequence.offsetEasing(0.5)).toBeCloseTo(sineOut(0.5));
      });

      test('should fall back to linear for unknown easing name', () => {
        const sequence = new Sequence(mockAnimationGroups, {
          offsetEasing: 'unknownEasing',
          offset: 100,
        });

        expect(sequence.offsetEasing(0.5)).toBe(0.5); // linear
      });
    });

    describe('CSS cubic-bezier strings', () => {
      test('should resolve cubic-bezier easing string', () => {
        const sequence = new Sequence(mockAnimationGroups, {
          offsetEasing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          offset: 100,
        });

        expect(sequence.offsetEasing(0)).toBe(0);
        expect(sequence.offsetEasing(1)).toBe(1);
        // Material ease-out: fast start
        expect(sequence.offsetEasing(0.5)).toBeGreaterThan(0.5);
      });

      test('should resolve cubic-bezier with negative values (back easing)', () => {
        const sequence = new Sequence(mockAnimationGroups, {
          offsetEasing: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
          offset: 100,
        });

        expect(sequence.offsetEasing(0)).toBe(0);
        expect(sequence.offsetEasing(1)).toBe(1);
      });

      test('should resolve cubic-bezier with overshoot values', () => {
        const sequence = new Sequence(mockAnimationGroups, {
          offsetEasing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          offset: 100,
        });

        expect(sequence.offsetEasing(0)).toBe(0);
        expect(sequence.offsetEasing(1)).toBe(1);
        // Should overshoot in the middle
        const midValues = [0.3, 0.4, 0.5, 0.6].map((t) => sequence.offsetEasing(t));
        expect(midValues.some((v) => v > 1)).toBe(true);
      });

      test('should handle CSS standard ease curves', () => {
        // CSS ease: cubic-bezier(0.25, 0.1, 0.25, 1)
        const sequence = new Sequence(mockAnimationGroups, {
          offsetEasing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
          offset: 100,
        });

        expect(sequence.offsetEasing(0)).toBe(0);
        expect(sequence.offsetEasing(1)).toBe(1);
      });

      test('should fall back to linear for malformed cubic-bezier', () => {
        const sequence = new Sequence(mockAnimationGroups, {
          offsetEasing: 'cubic-bezier(invalid)',
          offset: 100,
        });

        expect(sequence.offsetEasing(0.5)).toBe(0.5); // linear fallback
      });
    });

    describe('Custom function easings', () => {
      test('should use provided function directly', () => {
        const customEasing = (t: number) => t * t; // quadratic
        const sequence = new Sequence(mockAnimationGroups, {
          offsetEasing: customEasing,
          offset: 100,
        });

        expect(sequence.offsetEasing).toBe(customEasing);
        expect(sequence.offsetEasing(0.5)).toBe(0.25);
      });

      test('should handle cubic function', () => {
        const cubicFn = (t: number) => t * t * t;
        const sequence = new Sequence(mockAnimationGroups, {
          offsetEasing: cubicFn,
          offset: 100,
        });

        expect(sequence.offsetEasing(0.5)).toBe(0.125);
      });

      test('should handle step function', () => {
        const stepFn = (t: number) => (t < 0.5 ? 0 : 1);
        const sequence = new Sequence(mockAnimationGroups, {
          offsetEasing: stepFn,
          offset: 100,
        });

        expect(sequence.offsetEasing(0.25)).toBe(0);
        expect(sequence.offsetEasing(0.75)).toBe(1);
      });

      test('should handle bounce-like function', () => {
        // Simple bounce that overshoots
        const bounceFn = (t: number) => {
          if (t < 0.5) return 4 * t * t * t;
          return 1 - Math.pow(-2 * t + 2, 3) / 2;
        };
        const sequence = new Sequence(mockAnimationGroups, {
          offsetEasing: bounceFn,
          offset: 100,
        });

        expect(sequence.offsetEasing(0)).toBe(0);
        expect(sequence.offsetEasing(1)).toBe(1);
      });

      test('should calculate offsets correctly with custom function', () => {
        // Square root for ease-out effect
        const sqrtEasing = (t: number) => Math.sqrt(t);
        const sequence = new Sequence(mockAnimationGroups, {
          offsetEasing: sqrtEasing,
          offset: 100,
        });

        const offsets = sequence.getOffsets();
        expect(offsets[0]).toBe(0);
        // sqrt(0.5) ≈ 0.707, so offset should be ~141
        expect(offsets[1]).toBeGreaterThan(130);
        expect(offsets[1]).toBeLessThan(150);
        expect(offsets[2]).toBe(200);
      });
    });
  });
});
