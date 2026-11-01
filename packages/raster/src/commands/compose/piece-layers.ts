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
  const fresh = new Map(source.layers.map((layer) => [layer.id, ids.next('lay') as LayerId]));
  const layers = source.layers.map((layer): Layer => {
    const held: Record<FrameId, CelId> = {};
    spec.frames.forEach((at, slot) => {
      const cel = celAt(source, layer, source.frames[at]?.id);
      const frame = frames[slot];
      if (cel && frame) held[frame.id] = copy(cel.id, () => cropped(source, cel, spec));
    });
    const parentId = layer.parentId === undefined ? undefined : fresh.get(layer.parentId);
    const piece = { ...layer, id: fresh.get(layer.id) ?? layer.id, cels: held };
    return parentId === undefined ? piece : { ...piece, parentId };
  });
  return { layers, cels };
};

export { pieceLayers };
