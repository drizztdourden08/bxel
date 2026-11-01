/* @layer renderer-app @kind logic */
import { useSelectionStore } from '../../stores/useSelectionStore';
import type { MarqueeRule } from './selection.type';

const marqueeRule = (): MarqueeRule => {
  const { fixed, fixedWidth, fixedHeight } = useSelectionStore.getState();
  return { fixed, width: fixedWidth, height: fixedHeight };
};

export { marqueeRule };
