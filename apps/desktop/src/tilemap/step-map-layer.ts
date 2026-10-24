/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentMap } from './current-map';

const stepMapLayer = (by: 1 | -1): void => {
  const target = currentMap();
  if (!target) return;
  const at = target.tilemap.layers.findIndex((each) => each.id === target.layer.id);
  const next = target.tilemap.layers[at + by];
  if (next) useTilemapStore.getState().setLayer(next.id);
};

export { stepMapLayer };
