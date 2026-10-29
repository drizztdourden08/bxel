/* @layer renderer-app @kind logic */
import { selectCells } from './select-cells';
import { selectedMap } from './selected-map';

const selectSameTile = (): boolean => {
  const picked = selectedMap();
  return picked ? selectCells({ by: 'tile', key: picked.selection.from }, 'replace') : false;
};

export { selectSameTile };
