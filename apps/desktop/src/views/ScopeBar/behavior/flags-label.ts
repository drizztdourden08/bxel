/* @layer renderer-app @kind logic */
import type { CellFlags } from '@bxel/document';
import { MAP_TEXT } from '../ScopeBar.constants';

const flagsLabel = (flags: CellFlags): string => {
  const parts = [flags.flipX ? 'X' : '', flags.flipY ? 'Y' : '', flags.diagonal ? 'Diagonal' : ''].filter(Boolean);
  return parts.length === 0 ? MAP_TEXT.noTurn : parts.join(' ');
};

export { flagsLabel };
