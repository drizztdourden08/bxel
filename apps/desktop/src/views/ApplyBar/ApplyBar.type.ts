/* @layer renderer-app @kind types */
import type { PendingScopeText } from '../../editor/pending/pending.type';

interface ApplyBarModel {
  title: string;
  scope: PendingScopeText;
  clipping: string;
  error: string | null;
}

export type { ApplyBarModel };
