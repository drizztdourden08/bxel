/* @layer core @kind logic */
import { boxJson } from './box-json';
import type { JsonValue, SheetFrameEntry, SheetSpriteEntry } from './sheet-metadata.type';

const hashFrameJson = (sprite: SheetSpriteEntry, frame: SheetFrameEntry): Record<string, JsonValue> => ({
  frame: boxJson(frame.box),
  rotated: frame.rotated,
  trimmed: frame.trimmed,
  spriteSourceSize: boxJson({
    x: frame.sourceX,
    y: frame.sourceY,
    width: frame.box.width,
    height: frame.box.height,
  }),
  sourceSize: { w: sprite.width, h: sprite.height },
  duration: frame.durationMs,
  pivot: { x: sprite.pivot.x2 / 2 / sprite.width, y: sprite.pivot.y2 / 2 / sprite.height },
});

export { hashFrameJson };
