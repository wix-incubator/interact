export type CssAnimationData = {
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

export type CustomEffectEntry = { element: Element | null; progress: number | null };
