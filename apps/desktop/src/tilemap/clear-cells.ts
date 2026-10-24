/* @layer renderer-app @kind logic */
import { eraseSteps } from './erase-steps';
import { runMap } from './run-map';
import { selectedMap } from './selected-map';
import { selectionCells } from './selection-cells';
import { TILE_LABEL } from './tilemap.constants';

const clearCells = (): boolean => {
  const picked = selectedMap();
  if (!picked) return false;
  return runMap(TILE_LABEL.clear, eraseSteps(picked.target, selectionCells(picked.selection, picked.target.tilemap)));
};

export { clearCells };
