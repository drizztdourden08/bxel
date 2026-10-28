/* @layer renderer-app @kind logic */
import type { LayerThumbSource, ThumbDeps } from '../LayerStack.type';

const layerThumbDeps = (source: LayerThumbSource): ThumbDeps => {
  if (source.kind === 'map') return { pixels: source.layer.cells, bank: null, width: source.columns, height: source.rows };
  const celId = source.layer.cels[source.frameId];
  return { pixels: celId === undefined ? null : source.sprite.cels[celId]?.pixels, bank: source.bank, width: source.sprite.width, height: source.sprite.height };
};

export { layerThumbDeps };
