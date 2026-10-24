/* @layer renderer-app @kind logic */
import type { CellFlags } from '@bxel/document';
import { TILE_BAR_TEXT } from '../sub-components/TileBar.constants';

const flagsLabel = (flags: CellFlags): string => {
  const parts = [flags.flipX ? 'X' : '', flags.flipY ? 'Y' : '', flags.diagonal ? 'Diagonal' : ''].filter(Boolean);
  return parts.length === 0 ? TILE_BAR_TEXT.noTurn : parts.join(' ');
};

export { flagsLabel };
