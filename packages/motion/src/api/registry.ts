import { NamedEffect } from "../types";

const registry: Record<string, NamedEffect> = {}

export function registerEffects(effects: Record<string, NamedEffect>) {
    Object.assign(registry, effects);
}

export function getRegisteredEffect(name: keyof NamedEffect) {
    if (name in registry) {
        return registry[name];
    } else {
        console.warn(`${name} not found in registry. Please make sure to import and register the preset.`);
        return null;
    }
}
