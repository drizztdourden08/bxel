/* @layer renderer-app @kind logic */
import type { Layer, Sprite } from '@bxel/document';

const linkedCels = (sprite: Sprite, layer: Layer): string[] => {
  const uses = new Map<string, number>();
  for (const each of sprite.layers) for (const celId of Object.values(each.cels)) uses.set(celId, (uses.get(celId) ?? 0) + 1);
  return Object.entries(layer.cels).flatMap(([frameId, celId]) => ((uses.get(celId) ?? 0) > 1 ? [frameId] : []));
};

export { linkedCels };
