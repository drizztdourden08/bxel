/* @layer renderer-app @kind constants */
import { NAME_COLLATOR } from './manager.constants';
import type { SortKey, SpriteFacts } from './manager.type';

const area = (fact: SpriteFacts): number => fact.sprite.width * fact.sprite.height;

const FACT_COMPARE: Readonly<Record<Exclude<SortKey, 'manual'>, (a: SpriteFacts, b: SpriteFacts) => number>> = {
  name: (a, b) => NAME_COLLATOR.compare(a.sprite.name, b.sprite.name),
  size: (a, b) => a.sprite.width - b.sprite.width || a.sprite.height - b.sprite.height,
  area: (a, b) => area(a) - area(b),
  frames: (a, b) => a.frames - b.frames,
  tags: (a, b) => a.tags - b.tags,
  bank: (a, b) => NAME_COLLATOR.compare(a.bank, b.bank),
  created: (a, b) => (a.sprite.created ?? 0) - (b.sprite.created ?? 0),
};

export { FACT_COMPARE };
