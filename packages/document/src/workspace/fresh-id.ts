/* @layer core @kind logic */
import type { IdPrefix, IdSource } from '../ids/id-source.type';

const freshId = (old: string, ids: IdSource, taken: Set<string>): string => {
  const prefix = old.slice(0, old.indexOf('_')) as IdPrefix;
  let next = ids.next(prefix);
  while (taken.has(next)) next = ids.next(prefix);
  taken.add(next);
  return next;
};

export { freshId };
