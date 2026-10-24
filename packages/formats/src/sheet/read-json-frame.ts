/* @layer core @kind logic */
import { isRecord } from './is-record';
import { readIntegers } from './read-integers';
import { readJsonBox } from './read-json-box';
import type { SheetFrameEntry } from './sheet-metadata.type';

const readJsonFrame = (value: unknown): SheetFrameEntry | undefined => {
  if (!isRecord(value)) return undefined;
  const box = readJsonBox(value['frame']);
  const offset = readIntegers(value['offset'], ['x', 'y']);
  const { trimmed, durationMs } = value;
  if (!box || !offset || typeof trimmed !== 'boolean') return undefined;
  if (typeof durationMs !== 'number' || !Number.isInteger(durationMs) || durationMs < 1) return undefined;
  const [sourceX = 0, sourceY = 0] = offset;
  return { box, trimmed, sourceX, sourceY, durationMs };
};

export { readJsonFrame };
