/* @layer core @kind logic */
import { hashFrameJson } from './hash-frame-json';
import { sheetFrameKey } from './sheet-frame-key';
import { sheetMetaJson } from './sheet-meta-json';
import type { JsonValue, SheetMetadata } from './sheet-metadata.type';

const writeArraySheetJson = (metadata: SheetMetadata): string => {
  const frames: JsonValue[] = metadata.sprites.flatMap((sprite) =>
    sprite.frames.map((frame, i): JsonValue => ({
      filename: frame.label ?? sheetFrameKey(sprite.name, i, sprite.frames.length),
      ...hashFrameJson(sprite, frame),
    })),
  );
  return `${JSON.stringify({ frames, meta: sheetMetaJson(metadata) }, null, 2)}\n`;
};

export { writeArraySheetJson };
