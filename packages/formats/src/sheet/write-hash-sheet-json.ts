/* @layer core @kind logic */
import { hashFrameJson } from './hash-frame-json';
import { hashSlicesJson } from './hash-slices-json';
import { hashTagsJson } from './hash-tags-json';
import { SHEET_JSON } from './sheet-json.constants';
import { sheetFrameKey } from './sheet-frame-key';
import type { JsonValue, SheetMetadata } from './sheet-metadata.type';
import { spriteFrameOffsets } from './sprite-frame-offsets';

const writeHashSheetJson = (metadata: SheetMetadata): string => {
  const offsets = spriteFrameOffsets(metadata.sprites);
  const frames: [string, JsonValue][] = metadata.sprites.flatMap((sprite) =>
    sprite.frames.map((frame, i): [string, JsonValue] => [
      sheetFrameKey(sprite.name, i, sprite.frames.length),
      hashFrameJson(sprite, frame),
    ]),
  );
  const meta = {
    app: SHEET_JSON.APP,
    version: String(SHEET_JSON.VERSION),
    image: metadata.image,
    format: SHEET_JSON.HASH_PIXEL_FORMAT,
    size: { w: metadata.width, h: metadata.height },
    scale: String(metadata.scale),
    frameTags: hashTagsJson(metadata.sprites, offsets),
    slices: hashSlicesJson(metadata.sprites, offsets),
  };
  return `${JSON.stringify({ frames: Object.fromEntries(frames), meta }, null, 2)}\n`;
};

export { writeHashSheetJson };
