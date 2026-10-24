/* @layer core @kind logic */
import { boxJson } from './box-json';
import { SHEET_JSON } from './sheet-json.constants';
import type { JsonValue, SheetSliceEntry, SheetSpriteEntry } from './sheet-metadata.type';

const sliceKey = (slice: SheetSliceEntry, frame: number): JsonValue => ({
  frame,
  bounds: boxJson(slice.bounds),
  ...(slice.center ? { center: boxJson(slice.center) } : {}),
  ...(slice.pivot ? { pivot: { x: slice.pivot.x2 / 2, y: slice.pivot.y2 / 2 } } : {}),
});

const hashSlicesJson = (
  sprites: readonly SheetSpriteEntry[],
  offsets: readonly number[],
): JsonValue[] =>
  sprites.flatMap((sprite, i) =>
    sprite.slices.map((slice) => ({
      name: slice.name,
      color: SHEET_JSON.SLICE_COLOR,
      keys: [sliceKey(slice, offsets[i] ?? 0)],
    })),
  );

export { hashSlicesJson };
