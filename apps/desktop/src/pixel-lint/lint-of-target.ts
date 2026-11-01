/* @layer renderer-app @kind logic */
import { flattenFrame } from '@bxel/document';
import type { FrameId, Sprite } from '@bxel/document';
import { lintPixels } from '@bxel/raster';
import type { LintFinding } from '@bxel/raster';

const cache = new WeakMap<Sprite, Map<string, readonly LintFinding[]>>();

/** The findings of one frame. A sprite object never changes, so a result stays good for as long as the sprite is the same object. */
const lintOfFrame = (sprite: Sprite, frameId: FrameId): readonly LintFinding[] => {
  const frames = cache.get(sprite) ?? new Map<string, readonly LintFinding[]>();
  cache.set(sprite, frames);
  const known = frames.get(frameId);
  if (known) return known;
  const found = lintPixels({ pixels: flattenFrame(sprite, frameId), width: sprite.width, height: sprite.height }).findings;
  frames.set(frameId, found);
  return found;
};

export { lintOfFrame };
