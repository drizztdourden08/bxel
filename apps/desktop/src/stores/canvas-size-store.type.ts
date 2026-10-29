/* @layer renderer-app @kind types */
import type { ResizeSpec } from '../sheet-manager/manager.type';

interface SizePreview {
  width: number;
  height: number;
  anchor: ResizeSpec['anchor'];
}

interface CanvasSizeState {
  open: boolean;
  preview: SizePreview | null;
  setPreview: (preview: SizePreview | null) => void;
  show: () => void;
  hide: () => void;
}

export type { CanvasSizeState };
