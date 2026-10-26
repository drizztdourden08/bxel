/* @layer core @kind logic */
import { hashSlicesJson } from './hash-slices-json';
import { hashTagsJson } from './hash-tags-json';
import { SHEET_JSON } from './sheet-json.constants';
import type { JsonValue, SheetMetadata } from './sheet-metadata.type';
import { spriteFrameOffsets } from './sprite-frame-offsets';

const sheetMetaJson = (metadata: SheetMetadata): JsonValue => {
  const offsets = spriteFrameOffsets(metadata.sprites);
  return {
    app: SHEET_JSON.APP,
    version: String(SHEET_JSON.VERSION),
    image: metadata.image,
    format: SHEET_JSON.HASH_PIXEL_FORMAT,
    size: { w: metadata.width, h: metadata.height },
    scale: String(metadata.scale),
    frameTags: hashTagsJson(metadata.sprites, offsets),
    slices: hashSlicesJson(metadata.sprites, offsets),
  };
};

export { sheetMetaJson };
