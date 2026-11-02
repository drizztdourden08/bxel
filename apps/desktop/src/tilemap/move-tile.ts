/* @layer renderer-app @kind logic */
import { tileLayout } from '@bxel/document';
import { currentTileset } from './current-tileset';
import type { LayoutStep } from './move-tile.type';
import { pickedKey } from './picked-key';
import { setLayout } from './set-layout';
import { STEP_OF } from './move-tile.constants';

const moveTile = (direction: LayoutStep, key?: number): boolean => {
  const tileset = currentTileset();
  const wanted = key ?? pickedKey();
  if (!tileset || wanted === null) return false;
  const layout = tileLayout(tileset);
  const from = layout.indexOf.get(wanted);
  if (from === undefined) return false;
  const to = from + STEP_OF[direction](layout.columns);
  return to < 0 ? false : setLayout({ move: [{ key: wanted, to }] });
};

export { moveTile };
