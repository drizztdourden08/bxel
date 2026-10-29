/* @layer renderer-app @kind types */
import type { PaintSession } from '../../../editor/editor.type';

interface GestureLive {
  session: PaintSession | null;
  image: ImageData | null;
  timer: number | null;
  held: { readonly x: number; readonly y: number } | null;
  show: (image: ImageData | null) => void;
  redraw: () => void;
}

export type { GestureLive };
