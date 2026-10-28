/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useDrawingStore } from '../../../stores/useDrawingStore';
import { toggleItem } from '../../../toolbar-items';
import { DRAWING_TEXT, HINTS } from '../DrawingOptions.constants';

const useMapRandomItems = (): ToolbarItem[] => {
  const seed = useDrawingStore((state) => state.spraySeed);
  const patch = useDrawingStore((state) => state.patch);
  return [toggleItem({ id: 'map-seed', icon: 'pixel-lock', hint: HINTS.spraySeed, caption: DRAWING_TEXT.spraySeed, pressed: seed !== null, onChange: (on) => patch({ spraySeed: on ? 1 : null }) })];
};

export { useMapRandomItems };
