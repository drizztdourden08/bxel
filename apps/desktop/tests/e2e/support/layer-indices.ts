/* @layer renderer-app @kind logic */
import type { Sprite } from '@bxel/document';

const layerIndices = (sprite: Sprite, layerName: string, frameAt = 0): Uint8Array => {
  const layer = sprite.layers.find((candidate) => candidate.name === layerName);
  const frame = sprite.frames[frameAt];
  const celId = layer && frame ? layer.cels[frame.id] : undefined;
  const cel = celId ? sprite.cels[celId] : undefined;
  if (!cel) throw new Error(`layer ${layerName} has no cel in frame ${frameAt}`);
  return cel.pixels;
};

export { layerIndices };
