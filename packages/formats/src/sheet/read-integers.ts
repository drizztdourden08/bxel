/* @layer core @kind logic */
import { isRecord } from './is-record';

const readIntegers = (value: unknown, keys: readonly string[]): number[] | undefined => {
  if (!isRecord(value)) return undefined;
  const out: number[] = [];
  for (const key of keys) {
    const entry = value[key];
    if (typeof entry !== 'number' || !Number.isInteger(entry)) return undefined;
    out.push(entry);
  }
  return out;
};

export { readIntegers };
