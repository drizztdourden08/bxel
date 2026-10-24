/* @layer renderer-app @kind hook */
import { useToolStore } from '../../../stores/useToolStore';
import type { HeldColours } from '../PalettePanel.type';

const useHeldColours = (): HeldColours => {
  const foreground = useToolStore((state) => state.foreground);
  const background = useToolStore((state) => state.background);
  const third = useToolStore((state) => state.third);
  const fourth = useToolStore((state) => state.fourth);
  return { foreground, background, third, fourth };
};

export { useHeldColours };
