/* @layer renderer-app @kind logic */
import type { LayerFlag } from '../editor/layer-flag.type';
import { currentMap } from './current-map';
import { flagLabel } from './flag-label';
import { updateMapLayers } from './update-map-layers';

const setOtherMapLayers = (layerId: string, flag: LayerFlag): void => {
  const others = currentMap()?.tilemap.layers.filter((layer) => layer.id !== layerId) ?? [];
  if (others.length === 0) return;
  const value = flag === 'visible' ? !others.some((layer) => layer.visible) : others.some((layer) => !layer.locked);
  updateMapLayers(others.map((layer) => layer.id), { [flag]: value }, flagLabel(flag));
};

export { setOtherMapLayers };
