/* @layer renderer-app @kind logic */
import type { VirtualGridMove } from '@drizztdourden08/tessera';
import type { PaletteTarget } from '../../../editor/editor.type';
import { moveSwatches } from '../../../palette-panel/move-swatches';
import type { PanelOutcome } from '../../../palette-panel/palette-panel.type';
import { swapSwatches } from '../../../palette-panel/swap-swatches';

const gridOutcome = (target: PaletteTarget, moving: readonly number[], from: number, move: VirtualGridMove): PanelOutcome => {
  const gap = move.to.index;
  if (move.modifier === 'alt' && moving.length === 1) return swapSwatches(target, from, gap > from ? gap - 1 : gap);
  return moveSwatches(target, moving, gap);
};

export { gridOutcome };
