/* @layer core @kind logic */
import { isPlainRecord } from './is-plain-record';

const remapIds = <T>(value: T, map: ReadonlyMap<string, string>): T => {
  if (map.size === 0) return value;
  if (typeof value === 'string') return (map.get(value) ?? value) as T;
  if (Array.isArray(value)) return value.map((item: unknown) => remapIds(item, map)) as T;
  if (!isPlainRecord(value)) return value;
  const entries = Object.entries(value).map(([key, child]) => [map.get(key) ?? key, remapIds(child, map)] as const);
  return Object.fromEntries(entries) as T;
};

export { remapIds };
