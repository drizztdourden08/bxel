/* @layer renderer-app @kind types */
import type { MaskView, PointMap, Rect } from '@bxel/raster';
import type { PendingEdit } from '../pending/pending.type';

interface SiblingEdit {
  edit: PendingEdit;
  moved: MaskView;
  landing: MaskView;
}

interface SiblingRegion {
  mask: MaskView;
  box: Rect;
  map: PointMap;
}

export type { SiblingEdit, SiblingRegion };
