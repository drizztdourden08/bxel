/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { MapLayerId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { mapLayerStep } from './map-layer-steps';
import { readiedMap } from './readied-map';
import { TILE_LABEL, TILE_REF } from './tilemap.constants';

const duplicateMapLayer = (): boolean => {
  const target = readiedMap();
  if (!target) return false;
  const step = { ...mapLayerStep(COMMAND_NAME.mapLayerDuplicate, target, target.layer.id, {}), ref: TILE_REF.layer };
  const done = runDocument(TILE_LABEL.layerDuplicate, [step]);
  if (done) useTilemapStore.getState().setLayer(done.created[TILE_REF.layer] as MapLayerId);
  return done !== null;
};

export { duplicateMapLayer };
