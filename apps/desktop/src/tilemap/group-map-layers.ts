/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { useLayerViewStore } from '../stores/useLayerViewStore';
import { runDocument } from '../sheet/run-document';
import { currentMap } from './current-map';
import { TILE_LABEL, TILE_REF } from './tilemap.constants';

const groupMapLayers = (ids: readonly string[]): void => {
  const target = currentMap();
  if (!target || ids.length === 0) return;
  const layers = ids.map((id) => ({ by: 'id', id }));
  const options = { tilemap: target.tilemap.id, layers };
  const done = runDocument(TILE_LABEL.layerGroup, [{ name: COMMAND_NAME.mapLayerGroup, targets: null, options, ref: TILE_REF.layer }]);
  const group = done?.created[TILE_REF.layer];
  if (group !== undefined) useLayerViewStore.getState().select([group], group);
};

export { groupMapLayers };
