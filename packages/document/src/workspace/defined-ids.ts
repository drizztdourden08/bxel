/* @layer core @kind logic */
import { isPlainRecord } from './is-plain-record';

const collect = (value: unknown, into: Set<string>): void => {
  if (Array.isArray(value)) {
    for (const item of value) collect(item, into);
    return;
  }
  if (!isPlainRecord(value)) return;
  if (typeof value['id'] === 'string') into.add(value['id']);
  for (const child of Object.values(value)) collect(child, into);
};

const definedIds = (value: unknown): ReadonlySet<string> => {
  const found = new Set<string>();
  collect(value, found);
  return found;
};

export { definedIds };
