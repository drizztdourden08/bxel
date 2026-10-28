/* @layer renderer-app @kind types */
import type { PixelRect } from '../PixelViewport';
import type { PendingScopeText } from '../../editor/pending/pending.type';

interface BarRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface BarSize {
  width: number;
  height: number;
}

interface BarPlacement {
  x: number;
  y: number;
  docked: boolean;
}

interface ApplyBarModel {
  title: string;
  anchor: PixelRect | null;
  nudges: boolean;
  scope: PendingScopeText;
  clipping: string;
  error: string | null;
}

export type { ApplyBarModel, BarPlacement, BarRect, BarSize };
