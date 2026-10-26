/* @layer core @kind logic */
import { isRecord } from './is-record';
import { TAG_COLOUR } from './read-json-tag.constants';
import type { SheetFlip, SheetTagDirection, SheetTagEntry } from './sheet-metadata.type';

const isDirection = (value: unknown): value is SheetTagDirection =>
  value === 'forward' || value === 'reverse' || value === 'pingpong' || value === 'pingpongReverse';

const isFlip = (value: unknown): value is SheetFlip => value === 'x' || value === 'y';

const isIndex = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0;

const readExtras = (value: Readonly<Record<string, unknown>>): Partial<SheetTagEntry> => {
  const { colour, facing, mirrorOf, flip } = value;
  return {
    ...(typeof colour === 'string' && TAG_COLOUR.test(colour) ? { colour } : {}),
    ...(typeof facing === 'string' ? { facing } : {}),
    ...(typeof mirrorOf === 'string' ? { mirrorOf } : {}),
    ...(isFlip(flip) ? { flip } : {}),
  };
};

const readJsonTag = (value: unknown): SheetTagEntry | undefined => {
  if (!isRecord(value)) return undefined;
  const { name, from, to, direction, repeat } = value;
  if (typeof name !== 'string' || !isDirection(direction)) return undefined;
  if (!isIndex(from) || !isIndex(to) || !isIndex(repeat) || from > to) return undefined;
  return { name, from, to, direction, repeat, ...readExtras(value) };
};

export { readJsonTag };
