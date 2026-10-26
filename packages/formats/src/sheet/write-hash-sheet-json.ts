/* @layer core @kind logic */
import { hashFrameJson } from './hash-frame-json';
import { sheetFrameKey } from './sheet-frame-key';
import { sheetMetaJson } from './sheet-meta-json';
import type { JsonValue, SheetMetadata } from './sheet-metadata.type';

const writeHashSheetJson = (metadata: SheetMetadata): string => {
  const frames: [string, JsonValue][] = metadata.sprites.flatMap((sprite) =>
    sprite.frames.map((frame, i): [string, JsonValue] => [
      sheetFrameKey(sprite.name, i, sprite.frames.length),
      hashFrameJson(sprite, frame),
    ]),
  );
  return `${JSON.stringify({ frames: Object.fromEntries(frames), meta: sheetMetaJson(metadata) }, null, 2)}\n`;
};

export { writeHashSheetJson };
