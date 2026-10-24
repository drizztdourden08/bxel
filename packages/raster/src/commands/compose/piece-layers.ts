/* @layer core @kind logic */
import type { Cel, CelId, Frame, FrameId, IdSource, Layer, LayerId, Sprite } from '@bxel/document';
import { reframeBuffer } from '../../region/reframe-buffer';
import { celAt } from './cel-at';
import { celCopier } from './cel-copier';
import type { PieceSpec } from './compose.type';

const cropped = (source: Sprite, cel: Cel, spec: PieceSpec): Uint8Array =>
  spec.crop === null ? cel.pixels : reframeBuffer({ pixels: cel.pixels, width: source.width, height: source.height }, spec.crop).pixels;

const pieceLayers = (ids: IdSource, source: Sprite, spec: PieceSpec, frames: readonly Frame[]): { layers: Layer[]; cels: Record<CelId, Cel> } => {
  const cels: Record<CelId, Cel> = {};
  const copy = celCopier(ids, cels);
  const layers = source.layers.map((layer): Layer => {
    const held: Record<FrameId, CelId> = {};
    spec.frames.forEach((at, slot) => {
      const cel = celAt(source, layer, source.frames[at]?.id);
      const frame = frames[slot];
      if (cel && frame) held[frame.id] = copy(cel.id, () => cropped(source, cel, spec));
    });
    return { id: ids.next('lay') as LayerId, name: layer.name, visible: layer.visible, locked: layer.locked, cels: held };
  });
  return { layers, cels };
};

export { pieceLayers };
