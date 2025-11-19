/**
 * @class CustomAnimation
 *
 * A wrapper object for Animation that mimics the same interface but implements CustomEffect that runs JS code instead of KeyframeEffect.
 * The class is implemented by holding an inner Animation object instead of inheritance due to some browsers not allowing extension of built-in objects.
 */
export class CustomAnimation {
  _animation: Animation;
  customEffect: (progress: number | null) => void;
  progress: number | null;
  _tickCbId: number | null;
  _finishHandler: (_: any) => void;

  constructor(
    customEffect: (element: Element | null, progress: number | null) => void,
    target: Element | null,
    effectOptions: KeyframeEffectOptions,
    timingOptions: { timeline?: AnimationTimeline | null },
  ) {
    // overriding composite so that animation is not replaced and removed
    const effect = new KeyframeEffect(target, [], {
      ...effectOptions,
      composite: 'add',
    });
    const { timeline } = timingOptions;
    this._animation = new Animation(effect, timeline);

    this._tickCbId = null;
    this.progress = null;
    this.customEffect = (progress: number | null) =>
      customEffect(effect.target, progress);

    // stop loop if animation is removed from the DOM after finish (does not fire 'remove' event)
    this._finishHandler = (_: any) => {
      if (
        !(this.effect as KeyframeEffect).target
          ?.getAnimations()
          .find((a) => a === this._animation)
      ) {
        this.cancel();
      }
    };
    this.addEventListener('finish', this._finishHandler);
    this.addEventListener('remove', this._finishHandler);
  }

  // private tick method for customEffect loop implementation
  private _tick() {
    try {
      const progress = this.effect?.getComputedTiming().progress ?? null;
      if (progress !== this.progress) {
        this.customEffect?.(progress);
        this.progress = progress;
      }
      this._tickCbId = requestAnimationFrame(() => {
        this._tick();
      });
    } catch (error) {
      this._tickCbId = null;
      console.error(
        `failed to run customEffect! effectId: ${this.id}, error: ${
          error instanceof Error ? error.message : error
        }`,
      );
    }
  }

  // Animation timing properties
  get currentTime() {
    return this._animation.currentTime;
  }
  set currentTime(time: CSSNumberish | null) {
    this._animation.currentTime = time;
  }
  get startTime() {
    return this._animation.startTime;
  }
  set startTime(time: CSSNumberish | null) {
    this._animation.startTime = time;
  }
  get playbackRate() {
    return this._animation.playbackRate;
  }
  set playbackRate(speed: number) {
    this._animation.playbackRate = speed;
  }

  // Animation basic properties
  get id() {
    return this._animation.id;
  }
  set id(uid: string) {
    this._animation.id = uid;
  }
  get effect() {
    return this._animation.effect;
  }
  set effect(e: AnimationEffect | null) {
    this._animation.effect = e;
  }
  get timeline() {
    return this._animation.timeline;
  }
  set timeline(tl: AnimationTimeline | null) {
    this._animation.timeline = tl;
  }

  // Animation readonly state properties
  get finished() {
    return this._animation.finished;
  }
  get pending() {
    return this._animation.pending;
  }
  get playState() {
    return this._animation.playState;
  }
  get ready() {
    return this._animation.ready;
  }
  get replaceState() {
    return this._animation.replaceState;
  }

  // Animation event handlers
  get oncancel() {
    return this._animation.oncancel;
  }
  set oncancel(
    cb: ((this: Animation, ev: AnimationPlaybackEvent) => any) | null,
  ) {
    this._animation.oncancel = cb;
  }
  get onfinish() {
    return this._animation.onfinish;
  }
  set onfinish(
    cb: ((this: Animation, ev: AnimationPlaybackEvent) => any) | null,
  ) {
    this._animation.onfinish = cb;
  }
  get onremove() {
    return this._animation.onremove;
  }
  set onremove(cb: ((this: Animation, ev: AnimationPlaybackEvent) => any) | null) {
    this._animation.onremove = cb;
  }

  // CustomAnimation overridden methods
  play() {
    this._animation.play();
    cancelAnimationFrame(this._tickCbId!);
    this._tickCbId = requestAnimationFrame(() => this._tick());
  }

  pause() {
    this._animation.pause();
    cancelAnimationFrame(this._tickCbId!);
    this._tickCbId = null;
  }

  cancel() {
    this.removeEventListener('finish', this._finishHandler);
    this.removeEventListener('remove', this._finishHandler);
    this._animation.cancel();
    // signaling cancelation for customEffect to handle it as desired
    this.customEffect(null);
    cancelAnimationFrame(this._tickCbId!);
    this._tickCbId = null;
  }

  commitStyles() {
    console.warn(
      'CustomEffect animations do not support commitStyles method as they have no style to commit',
    );
  }

  // Animation methods without override
  finish() {
    this._animation.finish();
  }
  persist() {
    this._animation.persist();
  }
  reverse() {
    this._animation.reverse();
  }
  updatePlaybackRate(playbackRate: number) {
    this._animation.updatePlaybackRate(playbackRate);
  }

  // Animation events API
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) {
    this._animation.addEventListener(type, listener, options);
  }
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ) {
    this._animation.removeEventListener(type, listener, options);
  }
  dispatchEvent(event: Event) {
    return this._animation.dispatchEvent(event);
  }
}
