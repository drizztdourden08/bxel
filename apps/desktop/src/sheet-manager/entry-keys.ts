/* @layer renderer-app @kind logic */
import type { AnimationFacts } from './manager.type';

const entryKeys = (picked: readonly string[], animations: readonly AnimationFacts[]): string[] => {
  const shown = new Set(animations.map((fact) => fact.key));
  return picked.filter((key) => shown.has(key));
};

export { entryKeys };
