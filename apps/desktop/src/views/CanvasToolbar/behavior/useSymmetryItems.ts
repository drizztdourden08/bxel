/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { useToolStore } from '../../../stores/useToolStore';
import { toggleItem } from '../../../toolbar-items';
import { useHintKeys } from '../../ActionHint';
import { MIRROR_X_HINT, MIRROR_Y_HINT } from '../CanvasToolbar.constants';

const useSymmetryItems = (): ToolbarItem[] => {
  const disabled = useActiveDocument() === null;
  const x = useToolStore((state) => state.symmetryX);
  const y = useToolStore((state) => state.symmetryY);
  const toggle = useToolStore((state) => state.toggleSymmetry);
  const xKeys = useHintKeys(MIRROR_X_HINT);
  const yKeys = useHintKeys(MIRROR_Y_HINT);
  return [
    toggleItem({ id: 'mirror-x', icon: 'arrow-left-right', hint: MIRROR_X_HINT, keys: xKeys, disabled, pressed: x, onChange: () => toggle('x') }),
    toggleItem({ id: 'mirror-y', icon: 'arrow-up-down', hint: MIRROR_Y_HINT, keys: yKeys, disabled, pressed: y, onChange: () => toggle('y') }),
  ];
};

export { useSymmetryItems };
