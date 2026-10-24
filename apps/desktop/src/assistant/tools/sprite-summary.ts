/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';

const frameIndex = (sprite: Sprite, frameId: string): number =>
  Math.max(0, sprite.frames.findIndex((frame) => frame.id === frameId));

const spriteSummary = (sprite: Sprite) => ({
  spriteId: sprite.id,
  name: sprite.name,
  width: sprite.width,
  height: sprite.height,
  bankId: sprite.bankId,
  pivot: { x2: sprite.pivot.x2, y2: sprite.pivot.y2 },
  layers: sprite.layers.map((layer) => ({ layerId: layer.id, name: layer.name, visible: layer.visible, locked: layer.locked })),
  frames: sprite.frames.map((frame) => ({ frameId: frame.id, durationMs: frame.durationMs })),
  tags: sprite.tags.map((tag) => ({ name: tag.name, from: frameIndex(sprite, tag.from), to: frameIndex(sprite, tag.to) })),
});

export { spriteSummary };
