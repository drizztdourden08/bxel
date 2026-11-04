/* @layer renderer-app @kind types */
import type { PixelRect } from '../PixelViewport';
import type { PendingScopeText } from '../../editor/pending/pending.type';

interface ApplyBarModel {
  title: string;
  anchor: PixelRect | null;
  nudges: boolean;
  scope: PendingScopeText;
  clipping: string;
  error: string | null;
}

export type { ApplyBarModel };
