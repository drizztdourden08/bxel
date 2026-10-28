/* @layer renderer-app @kind logic */
import type { MapLayer } from '@bxel/document';

const isSoloMapLayer = (layers: readonly MapLayer[], layerId: string): boolean =>
  layers.length > 1 && layers.every((layer) => layer.visible === (layer.id === layerId));

export { isSoloMapLayer };
