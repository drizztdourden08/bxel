/* @layer renderer-app @kind types */
import type { AreaHighlight } from '../platform-preset/platform-preset.type';

interface AreaState {
  highlight: AreaHighlight | null;
  toggle: (area: AreaHighlight) => void;
  sync: (areas: readonly AreaHighlight[]) => void;
  clear: () => void;
}

export type { AreaState };
