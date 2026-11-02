/* @layer renderer-app @kind logic */
import { useTilesetViewStore } from '../../../stores/useTilesetViewStore';
import { nudgeShape } from '../../../tilemap/collision/nudge-shape';
import { snapStep } from '../../../tilemap/collision/snap-step';
import { currentTileset } from '../../../tilemap/current-tileset';
import { NUDGE_BIG } from './shape-editor.constants';
import { pickedShape } from './picked-shape';
import { replaceShape } from './replace-shape';

const nudgePicked = (dx: number, dy: number, big: boolean): boolean => {
  const picked = pickedShape();
  const tileset = currentTileset();
  if (!picked || !tileset) return false;
  const { shapeSnap, pointIndex } = useTilesetViewStore.getState();
  const reach = snapStep(shapeSnap) * (big ? NUDGE_BIG : 1);
  const size = { width: tileset.tileWidth, height: tileset.tileHeight };
  return replaceShape(picked.tile, picked.index, nudgeShape(picked.shape, pointIndex, { x: dx * reach, y: dy * reach }, size));
};

export { nudgePicked };
