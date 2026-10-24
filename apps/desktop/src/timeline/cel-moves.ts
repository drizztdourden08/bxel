/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';
import type { CelMove, CelStep, EffectiveSelection } from './timeline.type';

const celMoves = (sprite: Sprite, selection: EffectiveSelection, by: CelMove): CelStep[] | null => {
  const frames = sprite.frames.map((frame) => frame.id);
  const layers = sprite.layers.map((layer) => layer.id);
  const steps: CelStep[] = [];
  for (const layerId of selection.layers) {
    for (const frameId of selection.frames) {
      const toFrame = frames[frames.indexOf(frameId) + by.frames];
      const toLayer = layers[layers.indexOf(layerId) + by.layers];
      if (toFrame === undefined || toLayer === undefined) return null;
      const held = sprite.layers.find((layer) => layer.id === layerId)?.cels[frameId] !== undefined;
      if (held) steps.push({ layerId, frameId, toLayer, toFrame });
    }
  }
  const reach = (step: CelStep): number => by.frames * frames.indexOf(step.frameId) + by.layers * layers.indexOf(step.layerId);
  return steps.sort((a, b) => reach(b) - reach(a));
};

export { celMoves };
