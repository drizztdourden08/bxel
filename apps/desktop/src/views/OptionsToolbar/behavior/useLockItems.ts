/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { toggleItem } from '../../../toolbar-items';
import { DRAWING_TEXT, HINTS } from '../DrawingOptions.constants';

const useLockItems = (): ToolbarItem[] => {
  const editing = useTilemapStore((state) => state.editMode === 'edit');
  const locked = useDrawingStore((state) => state.lockToTile);
  const patch = useDrawingStore((state) => state.patch);
  if (!editing) return [];
  return [toggleItem({ id: 'lock-tile', icon: 'pixel-lock', hint: HINTS.lockToTile, caption: DRAWING_TEXT.lockToTile, pressed: locked, onChange: (lockToTile) => patch({ lockToTile }) })];
};

export { useLockItems };
