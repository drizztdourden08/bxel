/* @layer renderer-app @kind logic */
import type { Overlay } from '../../../editor/editor.type';
import type { FrameImage } from '../../../sheet/sheet.type';
import type { LayerThumbSource } from '../LayerStack.type';
import { layerThumbDeps } from './layer-thumb-deps';
import { layerThumbImageOf } from './layer-thumb-image-of';
import { KEPT_LAYER_IMAGES } from './kept-layer-image.constants';

const keptLayerImage = (source: LayerThumbSource, live: Overlay | null, stroke: number): FrameImage => {
  const { pixels, bank, width, height } = layerThumbDeps(source);
  const key: object = pixels ?? source.layer;
  const hit = KEPT_LAYER_IMAGES.get(key);
  if (hit?.bank === bank && hit.width === width && hit.height === height && hit.stroke === stroke && hit.live === live) return hit.image;
  const image = layerThumbImageOf(source, live);
  KEPT_LAYER_IMAGES.set(key, { bank, width, height, stroke, live, image });
  return image;
};

export { keptLayerImage };
