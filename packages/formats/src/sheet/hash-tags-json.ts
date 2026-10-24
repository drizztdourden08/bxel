/* @layer core @kind logic */
import { SHEET_JSON } from './sheet-json.constants';
import type { JsonValue, SheetSpriteEntry } from './sheet-metadata.type';

const hashTagsJson = (
  sprites: readonly SheetSpriteEntry[],
  offsets: readonly number[],
): JsonValue[] =>
  sprites.flatMap((sprite, i) =>
    sprite.tags.map((tag) => ({
      name: tag.name,
      from: (offsets[i] ?? 0) + tag.from,
      to: (offsets[i] ?? 0) + tag.to,
      direction: tag.direction,
      color: SHEET_JSON.TAG_COLOR,
      ...(tag.repeat > 0 ? { repeat: String(tag.repeat) } : {}),
    })),
  );

export { hashTagsJson };
