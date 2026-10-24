/* @layer renderer-app @kind logic */
import type { CelId, FrameId, Layer } from '@bxel/document';
import type { CelState } from './timeline.type';

const celState = (layer: Layer, frameId: FrameId, counts: ReadonlyMap<CelId, number>): CelState => {
  const celId = layer.cels[frameId];
  if (celId === undefined) return 'empty';
  return (counts.get(celId) ?? 0) > 1 ? 'linked' : 'filled';
};

export { celState };
