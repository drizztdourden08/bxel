/* @layer renderer-app @kind types */
import type { MaskView } from '@bxel/raster';
import type { PendingEdit } from '../pending/pending.type';

interface SiblingEdit {
  edit: PendingEdit;
  moved: MaskView;
  landing: MaskView;
}

export type { SiblingEdit };
