/* @layer renderer-app @kind constants */
import { NAME_COLLATOR } from './manager.constants';
import type { AnimationFacts, SortKey } from './manager.type';

const COMPARE: Readonly<Record<Exclude<SortKey, 'manual'>, (a: AnimationFacts, b: AnimationFacts) => number>> = {
  name: (a, b) => NAME_COLLATOR.compare(a.name, b.name),
  size: (a, b) => a.animation.width - b.animation.width || a.animation.height - b.animation.height,
  area: (a, b) => a.animation.width * a.animation.height - b.animation.width * b.animation.height,
  bank: (a, b) => NAME_COLLATOR.compare(a.bank, b.bank),
  created: (a, b) => (a.animation.created ?? 0) - (b.animation.created ?? 0),
};

export { COMPARE };
