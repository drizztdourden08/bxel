/* @layer renderer-app @kind logic */
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { shapeWithoutPoint } from '../../../tilemap/collision/shape-without-point';
import { pickedShape } from './picked-shape';
import { replaceShape } from './replace-shape';

const deletePickedPoint = (): boolean => {
  const picked = pickedShape();
  const at = useTilesetViewStore.getState().pointIndex;
  const next = shapeWithoutPoint(picked?.shape, at);
  if (!picked || !next) return false;
  useTilesetViewStore.getState().setPointIndex(null);
  return replaceShape(picked.tile, picked.index, next);
};

export { deletePickedPoint };
