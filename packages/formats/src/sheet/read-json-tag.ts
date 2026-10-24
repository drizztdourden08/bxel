/* @layer core @kind logic */
import { isRecord } from './is-record';
import type { SheetTagDirection, SheetTagEntry } from './sheet-metadata.type';

const isDirection = (value: unknown): value is SheetTagDirection =>
  value === 'forward' || value === 'reverse' || value === 'pingpong';

const isIndex = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0;

const readJsonTag = (value: unknown): SheetTagEntry | undefined => {
  if (!isRecord(value)) return undefined;
  const { name, from, to, direction, repeat } = value;
  if (typeof name !== 'string' || !isDirection(direction)) return undefined;
  if (!isIndex(from) || !isIndex(to) || !isIndex(repeat) || from > to) return undefined;
  return { name, from, to, direction, repeat };
};

export { readJsonTag };
