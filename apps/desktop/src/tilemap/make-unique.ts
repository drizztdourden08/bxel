/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { layerOptions } from './layer-options';
import { readCell } from './read-cell';
import { runMap } from './run-map';
import { selectedMap } from './selected-map';
import { selectionCells } from './selection-cells';
import { TILE_LABEL } from './tilemap.constants';

const makeUnique = (): boolean => {
  const picked = selectedMap();
  if (!picked) return false;
  const { target, selection } = picked;
  const reads = selectionCells(selection, target.tilemap).map((cell) => ({ cell, key: readCell(target.tilemap, target.layer, cell)?.key ?? 0 }));
  const key = selection.from === 0 ? reads.find((item) => item.key !== 0)?.key : selection.from;
  const cells = reads.filter((item) => item.key === key).map((item) => item.cell);
  if (key === undefined || cells.length === 0) return false;
  return runMap(TILE_LABEL.makeUnique, [{ name: COMMAND_NAME.tileUnique, targets: null, options: { ...layerOptions(target), cells } }]);
};

export { makeUnique };
