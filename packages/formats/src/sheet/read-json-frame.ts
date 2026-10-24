/* @layer core @kind logic */
import { isRecord } from './is-record';
import { readIntegers } from './read-integers';
import { readJsonBox } from './read-json-box';
import type { SheetFrameEntry } from './sheet-metadata.type';

const readRotated = (value: unknown): boolean | undefined => {
  if (value === undefined) return false;
  return typeof value === 'boolean' ? value : undefined;
};

const isDuration = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value >= 1;

const readJsonFrame = (value: unknown): SheetFrameEntry | undefined => {
  if (!isRecord(value)) return undefined;
  const box = readJsonBox(value['frame']);
  const offset = readIntegers(value['offset'], ['x', 'y']);
  const { trimmed, durationMs } = value;
  const rotated = readRotated(value['rotated']);
  if (!box || !offset || rotated === undefined || typeof trimmed !== 'boolean') return undefined;
  if (!isDuration(durationMs)) return undefined;
  const [sourceX = 0, sourceY = 0] = offset;
  return { box, rotated, trimmed, sourceX, sourceY, durationMs };
};

export { readJsonFrame };
