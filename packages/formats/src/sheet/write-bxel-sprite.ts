/* @layer core @kind logic */
import { boxJson } from './box-json';
import type {
  JsonValue,
  SheetFrameEntry,
  SheetSliceEntry,
  SheetSpriteEntry,
  SheetTagEntry,
} from './sheet-metadata.type';

const frameJson = (frame: SheetFrameEntry): JsonValue => ({
  frame: boxJson(frame.box),
  rotated: frame.rotated,
  trimmed: frame.trimmed,
  offset: { x: frame.sourceX, y: frame.sourceY },
  durationMs: frame.durationMs,
});

const tagJson = (tag: SheetTagEntry): JsonValue => ({
  name: tag.name,
  from: tag.from,
  to: tag.to,
  direction: tag.direction,
  repeat: tag.repeat,
  ...(tag.colour === undefined ? {} : { colour: tag.colour }),
  ...(tag.facing === undefined ? {} : { facing: tag.facing }),
  ...(tag.mirrorOf === undefined ? {} : { mirrorOf: tag.mirrorOf }),
  ...(tag.flip === undefined ? {} : { flip: tag.flip }),
});

const sliceJson = (slice: SheetSliceEntry): JsonValue => ({
  name: slice.name,
  bounds: boxJson(slice.bounds),
  pivot: slice.pivot ? { x2: slice.pivot.x2, y2: slice.pivot.y2 } : null,
  center: slice.center ? boxJson(slice.center) : null,
});

const writeBxelSprite = (sprite: SheetSpriteEntry): JsonValue => ({
  name: sprite.name,
  size: { w: sprite.width, h: sprite.height },
  pivot: { x2: sprite.pivot.x2, y2: sprite.pivot.y2 },
  frames: sprite.frames.map(frameJson),
  tags: sprite.tags.map(tagJson),
  slices: sprite.slices.map(sliceJson),
});

export { writeBxelSprite };
