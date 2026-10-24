/* @layer core @kind logic */
import { isRecord } from './is-record';
import { readJsonBox } from './read-json-box';
import { readJsonPivot } from './read-json-pivot';
import type { SheetSliceEntry } from './sheet-metadata.type';

const readJsonSlice = (value: unknown): SheetSliceEntry | undefined => {
  if (!isRecord(value)) return undefined;
  const bounds = readJsonBox(value['bounds']);
  const pivot = value['pivot'] === null ? null : readJsonPivot(value['pivot']);
  const center = value['center'] === null ? null : readJsonBox(value['center']);
  const { name } = value;
  if (!bounds || pivot === undefined || center === undefined || typeof name !== 'string') {
    return undefined;
  }
  return { name, bounds, pivot, center };
};

export { readJsonSlice };
