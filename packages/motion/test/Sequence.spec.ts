import { describe, expect, test, vi } from 'vitest';
import { AnimationGroup } from '../src/AnimationGroup';
import { linear } from '../src/easings';
import { Sequence } from '../src/Sequence';
import { getJsEasing } from '../src/utils';

(globalThis as any).CSSAnimation = class CSSAnimation {};

const createMockAnimation = (overrides: Partial<Animation> = {}): Animation =>
  ({
    id: '',
    currentTime: 0,
    playState: 'idle' as AnimationPlayState,
    ready: Promise.resolve(undefined as any),
    finished: Promise.resolve(undefined as any),
    effect: {
      getComputedTiming: vi.fn().mockReturnValue({ progress: 0.5 }),
      getTiming: vi.fn().mockReturnValue({ delay: 0, duration: 1000, iterations: 1 }),
      updateTiming: vi.fn(),
    } as any,
    play: vi.fn(),
    pause: vi.fn(),
    cancel: vi.fn(),
    reverse: vi.fn(),
    playbackRate: 1,
    ...overrides,
  }) as Animation;

function createGroup(
  options: {
    animations?: Animation[];
    ready?: Promise<void>;
    finished?: Promise<unknown>;
  } = {},
) {
  const animations = options.animations ?? [createMockAnimation()];
  const group = new AnimationGroup(
    animations,
    options.ready ? { measured: options.ready } : undefined,
  );

  if (options.finished) {
    Object.defineProperty(group, 'finished', {
      get: () => options.finished,
      configurable: true,
    });
  }

  return group;
}

describe('Sequence', () => {
  describe('Constructor', () => {
    test('creates Sequence with empty groups array', () => {
      const sequence = new Sequence([]);

      expect(sequence.animationGroups).toEqual([]);
      expect(sequence.animations).toEqual([]);
    });

    test('creates Sequence from multiple AnimationGroups', () => {
      const group1 = createGroup();
      const group2 = createGroup();

      const sequence = new Sequence([group1, group2]);

      expect(sequence.animationGroups).toEqual([group1, group2]);
    });

    test('flattens all child animations into parent animations array', () => {
      const a1 = createMockAnimation();
      const a2 = createMockAnimation();
      const a3 = createMockAnimation();
      const group1 = createGroup({ animations: [a1] });
      const group2 = createGroup({ animations: [a2, a3] });

      const sequence = new Sequence([group1, group2]);

      expect(sequence.animations).toEqual([a1, a2, a3]);
    });

    test('stores animationGroups reference', () => {
      const groups = [createGroup(), createGroup()];

      const sequence = new Sequence(groups);

      expect(sequence.animationGroups).toBe(groups);
    });

    test('defaults delay=0, offset=0, offsetEasing=linear', () => {
      const sequence = new Sequence([createGroup()]);

      expect(sequence.delay).toBe(0);
      expect(sequence.offset).toBe(0);
      expect(sequence.offsetEasing).toBe(linear);
    });

    test('accepts custom delay, offset, and offsetEasing function', () => {
      const offsetEasing = (p: number) => p ** 3;
      const sequence = new Sequence([createGroup()], { delay: 30, offset: 120, offsetEasing });

      expect(sequence.delay).toBe(30);
      expect(sequence.offset).toBe(120);
      expect(sequence.offsetEasing).toBe(offsetEasing);
    });

    test("resolves named offsetEasing string via getJsEasing (e.g. 'quadIn')", () => {
      const sequence = new Sequence([createGroup()], { offsetEasing: 'quadIn' });
      const quadIn = getJsEasing('quadIn');

      expect(quadIn).toBeDefined();
      expect(sequence.offsetEasing(0.5)).toBe(quadIn!(0.5));
    });

    test('resolves cubic-bezier offsetEasing string', () => {
      const sequence = new Sequence([createGroup()], {
        offsetEasing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      });

      expect(sequence.offsetEasing(0.5)).not.toBe(0.5);
    });

    test('falls back to linear for invalid or unknown offsetEasing string', () => {
      const sequence = new Sequence([createGroup()], { offsetEasing: 'not-a-real-easing' });

      expect(sequence.offsetEasing(0.25)).toBe(linear(0.25));
      expect(sequence.offsetEasing(0.75)).toBe(linear(0.75));
    });
  });

  describe('Offset calculation (calculateOffsets)', () => {
    test('single group returns [0]', () => {
      const sequence = new Sequence([createGroup()], { offset: 200 });

      expect((sequence as any).calculateOffsets()).toEqual([0]);
    });

    test('linear easing with 5 groups and offset=200 produces [0, 200, 400, 600, 800]', () => {
      const groups = Array.from({ length: 5 }, () => createGroup());
      const sequence = new Sequence(groups, { offset: 200, offsetEasing: 'linear' });

      expect((sequence as any).calculateOffsets()).toEqual([0, 200, 400, 600, 800]);
    });

    test('quadIn easing with 5 groups and offset=200 produces [0, 50, 200, 450, 800]', () => {
      const groups = Array.from({ length: 5 }, () => createGroup());
      const sequence = new Sequence(groups, { offset: 200, offsetEasing: 'quadIn' });

      expect((sequence as any).calculateOffsets()).toEqual([0, 50, 200, 450, 800]);
    });

    test('sineOut easing produces expected non-linear offsets', () => {
      const groups = Array.from({ length: 5 }, () => createGroup());
      const sequence = new Sequence(groups, { offset: 200, offsetEasing: 'sineOut' });

      expect((sequence as any).calculateOffsets()).toEqual([0, 306, 565, 739, 800]);
    });

    test('floors fractional offsets', () => {
      const groups = [createGroup(), createGroup(), createGroup()];
      const sequence = new Sequence(groups, { offset: 99, offsetEasing: (p) => p * 0.5 });

      expect((sequence as any).calculateOffsets()).toEqual([0, 49, 99]);
    });
  });

  describe('applyOffsets (synchronous in constructor)', () => {
    test('applies delay plus calculated offset to each group via group.applyOffset', () => {
      const groups = [createGroup(), createGroup(), createGroup()];
      const spies = groups.map((group) => vi.spyOn(group, 'applyOffset'));
      new Sequence(groups, { delay: 100, offset: 50, offsetEasing: 'linear' });

      expect(spies[0]).toHaveBeenCalledWith(100);
      expect(spies[1]).toHaveBeenCalledWith(150);
      expect(spies[2]).toHaveBeenCalledWith(200);
    });

    test('skips applyOffset when additionalDelay is 0', () => {
      const groups = [createGroup(), createGroup()];
      const spies = groups.map((group) => vi.spyOn(group, 'applyOffset'));
      new Sequence(groups, { delay: 0, offset: 0 });

      expect(spies[0]).not.toHaveBeenCalled();
      expect(spies[1]).not.toHaveBeenCalled();
    });

    test('ready resolves after all group ready promises settle', async () => {
      let resolveFirst!: () => void;
      let resolveSecond!: () => void;
      const firstReady = new Promise<void>((r) => {
        resolveFirst = r;
      });
      const secondReady = new Promise<void>((r) => {
        resolveSecond = r;
      });

      const group1 = createGroup({ ready: firstReady });
      const group2 = createGroup({ ready: secondReady });
      const sequence = new Sequence([group1, group2], { delay: 10 });

      let resolved = false;
      const readyPromise = sequence.ready.then(() => {
        resolved = true;
      });

      await Promise.resolve();
      expect(resolved).toBe(false);

      resolveFirst();
      await Promise.resolve();
      expect(resolved).toBe(false);

      resolveSecond();
      await readyPromise;
      expect(resolved).toBe(true);
    });
  });

  describe('Inherited playback API (from AnimationGroup)', () => {
    test('play() plays all flattened animations', async () => {
      const a1 = createMockAnimation();
      const a2 = createMockAnimation();
      const sequence = new Sequence([
        createGroup({ animations: [a1] }),
        createGroup({ animations: [a2] }),
      ]);

      await sequence.play();

      expect(a1.play).toHaveBeenCalledTimes(1);
      expect(a2.play).toHaveBeenCalledTimes(1);
    });

    test('pause() pauses all flattened animations', () => {
      const a1 = createMockAnimation();
      const a2 = createMockAnimation();
      const sequence = new Sequence([
        createGroup({ animations: [a1] }),
        createGroup({ animations: [a2] }),
      ]);

      sequence.pause();

      expect(a1.pause).toHaveBeenCalledTimes(1);
      expect(a2.pause).toHaveBeenCalledTimes(1);
    });

    test('reverse() reverses all flattened animations', async () => {
      const a1 = createMockAnimation();
      const a2 = createMockAnimation();
      const sequence = new Sequence([
        createGroup({ animations: [a1] }),
        createGroup({ animations: [a2] }),
      ]);

      await sequence.reverse();

      expect(a1.reverse).toHaveBeenCalledTimes(1);
      expect(a2.reverse).toHaveBeenCalledTimes(1);
    });

    test('cancel() cancels all flattened animations', () => {
      const a1 = createMockAnimation();
      const a2 = createMockAnimation();
      const sequence = new Sequence([
        createGroup({ animations: [a1] }),
        createGroup({ animations: [a2] }),
      ]);

      sequence.cancel();

      expect(a1.cancel).toHaveBeenCalledTimes(1);
      expect(a2.cancel).toHaveBeenCalledTimes(1);
    });

    test('setPlaybackRate() sets rate on all flattened animations', () => {
      const a1 = createMockAnimation();
      const a2 = createMockAnimation();
      const sequence = new Sequence([
        createGroup({ animations: [a1] }),
        createGroup({ animations: [a2] }),
      ]);

      sequence.setPlaybackRate(1.5);

      expect(a1.playbackRate).toBe(1.5);
      expect(a2.playbackRate).toBe(1.5);
    });

    test('playState returns from first animation', () => {
      const playing = createMockAnimation({ playState: 'running' });
      const idle = createMockAnimation({ playState: 'idle' });
      const sequence = new Sequence([
        createGroup({ animations: [playing] }),
        createGroup({ animations: [idle] }),
      ]);

      expect(sequence.playState).toBe('running');
    });
  });

  describe('onFinish (overridden)', () => {
    test('calls callback when all animation groups finish', async () => {
      const group1 = createGroup({ finished: Promise.resolve(undefined) });
      const group2 = createGroup({ finished: Promise.resolve(undefined) });
      const sequence = new Sequence([group1, group2]);
      const callback = vi.fn();

      await sequence.onFinish(callback);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    test("does not call callback if any group's finished promise rejects", async () => {
      const group1 = createGroup({ finished: Promise.resolve(undefined) });
      const group2 = createGroup({ finished: Promise.reject(new Error('interrupted')) });
      const sequence = new Sequence([group1, group2]);
      const callback = vi.fn();
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await sequence.onFinish(callback);

      expect(callback).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });

    test('logs warning on interrupted animation', async () => {
      const error = new Error('interrupted');
      const group = createGroup({ finished: Promise.reject(error) });
      const sequence = new Sequence([group]);
      const callback = vi.fn();
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      await sequence.onFinish(callback);

      expect(warnSpy).toHaveBeenCalledWith(
        'animation was interrupted - aborting onFinish callback - ',
        error,
      );
      warnSpy.mockRestore();
    });

    test('handles empty groups array', async () => {
      const sequence = new Sequence([]);
      const callback = vi.fn();

      await sequence.onFinish(callback);

      expect(callback).toHaveBeenCalledTimes(1);
    });
  });
});
