/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../../stores/useTilemapStore';
import { currentMap } from '../../tilemap/current-map';
import { selectCells } from '../../tilemap/select-cells';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';

const mapSelectionStep: ViewStep = (patch) => {
  const { mapSelection } = patch;
  if (!mapSelection) return null;
  if (!currentMap()) return viewFail(APP_TOOL_TEXT.noMapSelectionTarget, 'mapSelection');
  if (mapSelection.cells === 'none') useTilemapStore.getState().setSelection(null);
  else selectCells(mapSelection.cells, mapSelection.op);
  return null;
};

export { mapSelectionStep };
