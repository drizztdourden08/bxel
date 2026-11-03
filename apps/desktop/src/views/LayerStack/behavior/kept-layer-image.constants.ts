/* @layer renderer-app @kind constants */
import type { KeptLayerImage } from './kept-layer-image.type';

const KEPT_LAYER_IMAGES = new WeakMap<object, KeptLayerImage>();

export { KEPT_LAYER_IMAGES };
