/* @layer renderer-app @kind logic */
import { ADVANCED_COMMAND, emptyMask } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { commitSteps } from '../commit-request';
import type { CommitStep } from '../commit-request.type';
import { currentTarget } from '../current-target';
import { shiftMask } from '../pending/shift-mask';
import { unlockedTarget } from '../unlocked-target';
import { commitSelection } from './commit-selection';
import { distributePlan } from './distribute-plan';
import type { IslandMove } from './distribute-plan.type';
import { maskIslands } from './mask-islands';
import { SELECTION_LABELS, SELECTION_TEXT } from './selection.constants';
import { selectionMask } from './selection-mask';

const stepOf = (move: IslandMove): CommitStep => ({
  name: ADVANCED_COMMAND.pixelsMove,
  options: { offset: move.offset, skipZero: false, mask: move.island.mask },
});

const unionAfter = (base: MaskView, moves: readonly IslandMove[], moved: ReadonlySet<MaskView>, rest: readonly MaskView[]): MaskView => {
  const union = emptyMask(base);
  const parts = [...moves.map((move) => shiftMask(move.island.mask, move.offset)), ...rest.filter((part) => !moved.has(part))];
  for (const part of parts) for (const [at, bit] of part.bits.entries()) if (bit !== 0) union.bits[at] = 1;
  return union;
};

const distributeSelection = (axis: 'horizontal' | 'vertical'): boolean => {
  const notices = useNoticeStore.getState();
  const found = currentTarget();
  const mask = found ? selectionMask(found) : null;
  const islands = mask ? maskIslands(mask) : [];
  if (!found || !mask || islands.length < 3) {
    notices.post(SELECTION_TEXT.nothingToDistribute);
    return false;
  }
  const moves = distributePlan(islands, axis === 'horizontal');
  if (moves.length === 0) return true;
  const target = unlockedTarget();
  if (!target) return false;
  const result = useDocumentStore.getState().host.execute(commitSteps(target, SELECTION_LABELS.distribute, moves.map(stepOf)));
  if (!result.ok) {
    notices.post(result.error.message);
    return false;
  }
  const movedMasks = new Set(moves.map((move) => move.island.mask));
  commitSelection(target, unionAfter(mask, moves, movedMasks, islands.map((island) => island.mask)));
  return true;
};

export { distributeSelection };
