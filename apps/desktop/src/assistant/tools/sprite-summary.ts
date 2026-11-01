/* @layer renderer-app @kind logic */
import type { Sprite, Tag } from '@bxel/document';
import { guidesOf } from './guides-of';

const frameIndex = (sprite: Sprite, frameId: string): number =>
  Math.max(0, sprite.frames.findIndex((frame) => frame.id === frameId));

const tagSummary = (sprite: Sprite, tag: Tag, detailed: boolean) => ({
  name: tag.name,
  from: frameIndex(sprite, tag.from),
  to: frameIndex(sprite, tag.to),
  ...(tag.colour === undefined ? {} : { colour: tag.colour }),
  ...(detailed ? { tagId: tag.id, direction: tag.direction, repeat: tag.repeat } : {}),
});

const spriteSummary = (detailedTags: boolean) => (sprite: Sprite) => ({
  spriteId: sprite.id,
  name: sprite.name,
  width: sprite.width,
  height: sprite.height,
  bankId: sprite.bankId,
  pivot: { x2: sprite.pivot.x2, y2: sprite.pivot.y2 },
  layers: sprite.layers.map((layer) => ({
    layerId: layer.id,
    name: layer.name,
    visible: layer.visible,
    locked: layer.locked,
    ...(layer.lockTransparency === true ? { lockTransparency: true } : {}),
    ...(layer.colour === undefined ? {} : { colour: layer.colour }),
  })),
  frames: sprite.frames.map((frame) => ({ frameId: frame.id, durationMs: frame.durationMs })),
  tags: sprite.tags.map((tag) => tagSummary(sprite, tag, detailedTags)),
  slices: sprite.slices.map((slice) => ({ sliceId: slice.id, name: slice.name, rect: slice.rect, pivot: slice.pivot, center: slice.center })),
  guides: guidesOf(sprite.guides),
  selections: (sprite.selections ?? []).map((saved) => ({
    name: saved.name,
    width: saved.width,
    height: saved.height,
    pixels: saved.runs.reduce((sum, run) => sum + (run[2] - run[1] + 1), 0),
  })),
  symmetry: sprite.symmetry ?? null,
});

export { spriteSummary };
