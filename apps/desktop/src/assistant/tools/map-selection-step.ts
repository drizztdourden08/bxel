/* @layer renderer-app @kind logic */
import { currentMap } from '../../tilemap/current-map';
import { selectCells } from '../../tilemap/select-cells';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';
import { commitMapSelection } from '../../tilemap/commit-map-selection';

const mapSelectionStep: ViewStep = (patch) => {
  const { mapSelection } = patch;
  if (!mapSelection) return null;
  if (!currentMap()) return viewFail(APP_TOOL_TEXT.noMapSelectionTarget, 'mapSelection');
  if (mapSelection.cells === 'none') commitMapSelection(null);
  else selectCells(mapSelection.cells, mapSelection.op);
  return null;
};

export { mapSelectionStep };
