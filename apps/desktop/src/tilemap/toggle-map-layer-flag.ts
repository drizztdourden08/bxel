/* @layer renderer-app @kind logic */
import { currentMap } from './current-map';
import { flagMapLayer } from './flag-map-layer';

const toggleMapLayerFlag = (flag: 'visible' | 'locked', layerId?: string): void => {
  const target = currentMap();
  const wanted = layerId ?? target?.layer.id;
  const layer = target?.tilemap.layers.find((each) => each.id === wanted);
  if (layer) flagMapLayer(layer.id, flag, !layer[flag]);
};

export { toggleMapLayerFlag };
