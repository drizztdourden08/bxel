/* @layer core @kind logic */
import type { CelId, FrameId } from '../model/ids.type';
import type { Layer } from '../model/sprite.type';
import type { CloneIds } from './clone-sprite.type';

const remapLayerCels = (cels: Layer['cels'], ids: CloneIds): Layer['cels'] => {
  const out: Record<FrameId, CelId> = {};
  for (const [frameId, celId] of Object.entries(cels)) {
    const frame = ids.frames.get(frameId as FrameId);
    const cel = ids.cels.get(celId);
    if (frame !== undefined && cel !== undefined) out[frame] = cel;
  }
  return out;
};

export { remapLayerCels };
