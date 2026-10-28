/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { useToolStore } from '../../../stores/useToolStore';
import { toggleItem } from '../../../toolbar-items';
import { useHintKeys } from '../../ActionHint';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { MIRROR_DIAGONAL_HINT, MIRROR_TURN_HINT, MIRROR_X_HINT, MIRROR_Y_HINT } from '../CanvasToolbar.constants';

const useSymmetryItems = (): ToolbarItem[] => {
  const disabled = useActiveDocument() === null;
  const x = useToolStore((state) => state.symmetryX);
  const y = useToolStore((state) => state.symmetryY);
  const toggle = useToolStore((state) => state.toggleSymmetry);
  const xKeys = useHintKeys(MIRROR_X_HINT);
  const yKeys = useHintKeys(MIRROR_Y_HINT);
  const diagonal = useDrawingStore((state) => state.symmetryDiagonal);
  const turn = useDrawingStore((state) => state.symmetryTurn);
  const toggleMode = useDrawingStore((state) => state.toggleSymmetryMode);
  const diagonalKeys = useHintKeys(MIRROR_DIAGONAL_HINT);
  const turnKeys = useHintKeys(MIRROR_TURN_HINT);
  return [
    toggleItem({ id: 'mirror-x', icon: 'pixel-mirror-x', hint: MIRROR_X_HINT, keys: xKeys, disabled, pressed: x, onChange: () => toggle('x') }),
    toggleItem({ id: 'mirror-y', icon: 'pixel-mirror-y', hint: MIRROR_Y_HINT, keys: yKeys, disabled, pressed: y, onChange: () => toggle('y') }),
    toggleItem({ id: 'mirror-diagonal', icon: 'pixel-flip-tile-x', hint: MIRROR_DIAGONAL_HINT, keys: diagonalKeys, disabled, pressed: diagonal, onChange: () => toggleMode('diagonal') }),
    toggleItem({ id: 'mirror-turn', icon: 'pixel-turn-right', hint: MIRROR_TURN_HINT, keys: turnKeys, disabled, pressed: turn, onChange: () => toggleMode('turn') }),
  ];
};

export { useSymmetryItems };
