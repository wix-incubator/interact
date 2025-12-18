import { BackgroundScrollAnimation, EntranceAnimation, MouseAnimation, OngoingAnimation, ScrollAnimation } from "../types";

type Preset = ScrollAnimation | EntranceAnimation | OngoingAnimation | MouseAnimation | BackgroundScrollAnimation;

export const registry: Record<string, Preset> = {}

export function registerEffects(effects: Record<string, Preset>) {
    Object.assign(registry, effects);
}
