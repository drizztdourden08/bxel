/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { mapLayerStep } from './map-layer-steps';
import { readiedMap } from './readied-map';
import { TILE_LABEL } from './tilemap.constants';

const mergeMapLayerDown = (): boolean => {
  const target = readiedMap();
  if (!target) return false;
  const { layers } = target.tilemap;
  const below = layers[layers.findIndex((each) => each.id === target.layer.id) - 1];
  const done = runDocument(TILE_LABEL.layerMerge, [mapLayerStep(COMMAND_NAME.mapLayerMerge, target, target.layer.id, {})]);
  if (done && below) useTilemapStore.getState().setLayer(below.id);
  return done !== null;
};

export { mergeMapLayerDown };
