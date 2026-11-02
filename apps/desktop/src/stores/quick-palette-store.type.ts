/* @layer renderer-app @kind types */
import type { QuickPoint } from '../editor/quick-palette/quick-palette.type';

interface QuickPaletteState {
  open: boolean;
  at: QuickPoint;
  show: (at: QuickPoint) => void;
  close: () => void;
}

export type { QuickPaletteState };
