/* @layer renderer-app @kind types */
import type { PaintSession } from '../editor/editor.type';

interface LivePaintState {
  session: PaintSession | null;
  tick: number;
  start: (session: PaintSession) => void;
  update: () => void;
  end: () => void;
}

export type { LivePaintState };
