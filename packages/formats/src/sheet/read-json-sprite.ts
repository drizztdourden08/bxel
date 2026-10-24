/* @layer core @kind logic */
import { isRecord } from './is-record';
import { readIntegers } from './read-integers';
import { readJsonFrame } from './read-json-frame';
import { readJsonList } from './read-json-list';
import { readJsonPivot } from './read-json-pivot';
import { readJsonSlice } from './read-json-slice';
import { readJsonTag } from './read-json-tag';
import type { SheetSpriteEntry } from './sheet-metadata.type';

const readJsonSprite = (value: unknown): SheetSpriteEntry | undefined => {
  if (!isRecord(value)) return undefined;
  const size = readIntegers(value['size'], ['w', 'h']);
  const pivot = readJsonPivot(value['pivot']);
  const frames = readJsonList(value['frames'], readJsonFrame);
  const tags = readJsonList(value['tags'], readJsonTag);
  const slices = readJsonList(value['slices'], readJsonSlice);
  const { name } = value;
  if (!size || !pivot || !frames || !tags || !slices || typeof name !== 'string') return undefined;
  const [width = 0, height = 0] = size;
  return { name, width, height, pivot, frames, tags, slices };
};

export { readJsonSprite };
