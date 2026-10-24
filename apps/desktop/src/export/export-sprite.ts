/* @layer renderer-app @kind logic */
import type { Frame, Sprite } from '@bxel/document';
import type { ExportSprite, SheetTagEntry } from '@bxel/formats';
import { bankRgba } from './bank-rgba';
import type { Target } from './export.type';

const layersOf = (sprite: Sprite, frame: Frame): Uint8Array[] =>
  sprite.layers.flatMap((layer) => {
    const celId = layer.visible ? layer.cels[frame.id] : undefined;
    const cel = celId === undefined ? undefined : sprite.cels[celId];
    return cel ? [cel.pixels] : [];
  });

const tagsOf = (target: Target): SheetTagEntry[] =>
  target.sprite.tags.flatMap((tag) => {
    const from = target.frames.findIndex((frame) => frame.id === tag.from);
    const to = target.frames.findIndex((frame) => frame.id === tag.to);
    if (from < 0 || to < 0) return [];
    return [{ name: tag.name, from: Math.min(from, to), to: Math.max(from, to), direction: tag.direction, repeat: tag.repeat }];
  });

const exportSprite = (target: Target): ExportSprite => {
  const { sprite } = target;
  return {
    name: sprite.name,
    width: sprite.width,
    height: sprite.height,
    pivot: sprite.pivot,
    palette: bankRgba(target.bank),
    frames: target.frames.map((frame) => ({ layers: layersOf(sprite, frame), durationMs: frame.durationMs })),
    tags: tagsOf(target),
    slices: sprite.slices.map((slice) => ({ name: slice.name, bounds: slice.rect, pivot: slice.pivot, center: slice.center })),
  };
};

export { exportSprite };
