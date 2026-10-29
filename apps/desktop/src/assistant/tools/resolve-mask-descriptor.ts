/* @layer renderer-app @kind logic */
import { flattenFrame } from '@bxel/document';
import type { Artwork, Sprite } from '@bxel/document';
import { ERROR_CODE } from '@bxel/document';
import { combineMasks, ellipseMask, indexMask, polygonMask, rectMask, runsMask, wandMask } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import { mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { maskOfRuns } from './mask-of-runs';
import type { BaseDescriptor, MaskDescriptor } from './mask-descriptor.type';
import { opaqueMask } from './opaque-mask';

const corners = (rect: { x: number; y: number; width: number; height: number }) => ({
  from: { x: rect.x, y: rect.y },
  to: { x: rect.x + rect.width - 1, y: rect.y + rect.height - 1 },
});

const firstSprite = (artwork: Artwork, targets: unknown): Sprite | undefined => {
  const ids = typeof targets === 'object' && targets !== null && 'sprites' in targets && Array.isArray(targets.sprites) ? targets.sprites : [];
  return artwork.sprites.find((each) => each.id === ids[0]);
};

const flattened = (sprite: Sprite): { pixels: Uint8Array; width: number; height: number } => {
  const frame = sprite.frames[0];
  return { pixels: frame ? flattenFrame(sprite, frame.id) : new Uint8Array(sprite.width * sprite.height), width: sprite.width, height: sprite.height };
};

const byPicture = (descriptor: BaseDescriptor, sprite: Sprite): MaskView | null => {
  const buffer = flattened(sprite);
  if (descriptor.by === 'wand') return wandMask({ target: buffer, seed: { x: descriptor.x, y: descriptor.y }, connectivity: descriptor.connectivity });
  if (descriptor.by === 'colour') return indexMask(buffer, descriptor.index);
  return descriptor.by === 'opaque' ? opaqueMask(buffer) : null;
};

const byShape = (descriptor: BaseDescriptor, sprite: Sprite): MaskView | null => {
  if (descriptor.by === 'rect') return rectMask(sprite, corners(descriptor.rect));
  if (descriptor.by === 'ellipse') return ellipseMask(sprite, corners(descriptor.rect));
  if (descriptor.by === 'polygon') return polygonMask(sprite, descriptor.points);
  return descriptor.by === 'runs' ? maskOfRuns(descriptor.runs, sprite) : null;
};

const bySaved = (descriptor: BaseDescriptor, sprite: Sprite): McpResult<MaskView | null> => {
  if (descriptor.by !== 'saved') return { ok: true, value: null };
  const saved = sprite.selections?.find((each) => each.name === descriptor.name);
  if (!saved) return mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, `No saved selection is called "${descriptor.name}" on this sprite.`, { path: 'mask.name' });
  return { ok: true, value: runsMask(sprite, saved.runs) };
};

const resolveBase = (descriptor: BaseDescriptor, sprite: Sprite): McpResult<MaskView> => {
  const saved = bySaved(descriptor, sprite);
  if (!saved.ok) return saved;
  const found = saved.value ?? byShape(descriptor, sprite) ?? byPicture(descriptor, sprite);
  return found ? { ok: true, value: found } : mcpFailure(ERROR_CODE.INVALID_OPTION, 'The mask description could not be resolved.', { path: 'mask' });
};

const resolveCombine = (descriptor: Extract<MaskDescriptor, { by: 'combine' }>, sprite: Sprite): McpResult<MaskView> => {
  let joined: MaskView | null = null;
  for (const part of descriptor.of) {
    const next = resolveBase(part, sprite);
    if (!next.ok) return next;
    joined = joined === null ? next.value : combineMasks(joined, next.value, descriptor.op);
  }
  return joined ? { ok: true, value: joined } : mcpFailure(ERROR_CODE.INVALID_OPTION, 'A combined mask needs parts.', { path: 'mask.of' });
};

const resolveMaskDescriptor = (descriptor: MaskDescriptor, artwork: Artwork, targets: unknown): McpResult<MaskView> => {
  const sprite = firstSprite(artwork, targets);
  if (!sprite) return mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, 'A described mask needs a targeted sprite to describe it against.', { path: 'mask' });
  return descriptor.by === 'combine' ? resolveCombine(descriptor, sprite) : resolveBase(descriptor, sprite);
};

export { resolveMaskDescriptor };
