/* @layer renderer-app @kind logic */
import type { MaskView, PointMap, Rect } from '@bxel/raster';
import type { EditorTarget } from '../editor.type';
import { pendingLanding } from '../pending/pending-landing';
import type { PendingEdit } from '../pending/pending.type';
import { regionBox } from '../pending/region-box';
import { mapMask } from './map-mask';
import { mirrorSpec } from './mirror-spec';
import type { SiblingEdit } from './sibling-edit.type';

const siblingEdit = (target: EditorTarget, pending: PendingEdit, mask: MaskView, box: Rect, map: PointMap): SiblingEdit | null => {
  const moved = mapMask(mask, map);
  const spec = mirrorSpec(pending.spec, box, regionBox(target, moved), map);
  if (!spec) return null;
  const edit = { ...pending, mask: moved, spec };
  const landing = pendingLanding(target, edit);
  return landing ? { edit, moved, landing } : null;
};

export { siblingEdit };
