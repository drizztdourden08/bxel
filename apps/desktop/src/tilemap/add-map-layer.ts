/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { MapLayerId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { readiedMap } from './readied-map';
import { TILE_LABEL, TILE_REF } from './tilemap.constants';

const addMapLayer = (): boolean => {
  const target = readiedMap();
  if (!target) return false;
  const options = { tilemap: target.tilemap.id, above: { by: 'id', id: target.layer.id } };
  const done = runDocument(TILE_LABEL.layerAdd, [{ name: COMMAND_NAME.mapLayerAdd, targets: null, options, ref: TILE_REF.layer }]);
  if (done) useTilemapStore.getState().setLayer(done.created[TILE_REF.layer] as MapLayerId);
  return done !== null;
};

export { addMapLayer };
