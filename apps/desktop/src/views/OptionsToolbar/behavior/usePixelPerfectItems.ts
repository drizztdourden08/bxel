/* @layer renderer-app @kind hook */
import type { ToolbarItem } from '@drizztdourden08/tessera';
import { useToolStore } from '../../../stores/useToolStore';
import { toggleItem } from '../../../toolbar-items';
import { OPTIONS_TEXT, PIXEL_PERFECT_HINT } from '../OptionsToolbar.constants';

const usePixelPerfectItems = (): ToolbarItem[] => {
  const on = useToolStore((state) => state.pixelPerfect);
  const size = useToolStore((state) => state.brushSize);
  const setOn = useToolStore((state) => state.setPixelPerfect);
  if (size > 1) return [];
  return [toggleItem({ id: 'pixel-perfect', icon: 'pixel-pixel-perfect', hint: PIXEL_PERFECT_HINT, caption: OPTIONS_TEXT.pixelPerfectCaption, pressed: on, onChange: setOn })];
};

export { usePixelPerfectItems };
