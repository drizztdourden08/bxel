/* @layer core @kind logic */
import type { EntityChange } from '../commands/result.type';

const diffEntities = <I extends string>(
  before: readonly { readonly id: I }[],
  after: readonly { readonly id: I }[],
): EntityChange<I>[] => {
  const prior = new Map(before.map((item) => [item.id, item] as const));
  const present = new Set(after.map((item) => item.id));
  const changes: EntityChange<I>[] = [];
  for (const item of after) {
    const old = prior.get(item.id);
    if (!old) changes.push({ id: item.id, kind: 'added' });
    else if (old !== item) changes.push({ id: item.id, kind: 'updated' });
  }
  for (const item of before) {
    if (!present.has(item.id)) changes.push({ id: item.id, kind: 'removed' });
  }
  return changes;
};

export { diffEntities };
