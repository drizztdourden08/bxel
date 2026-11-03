/* @layer renderer-app @kind logic */
import { combineMasks, maskBounds, symmetryMaps } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import { useToolStore } from '../../stores/useToolStore';
import { useTransformUiStore } from '../../stores/useTransformUiStore';
import type { EditorTarget } from '../editor.type';
import { pendingLanding } from '../pending/pending-landing';
import type { PendingEdit } from '../pending/pending.type';
import { regionBox } from '../pending/region-box';
import { symmetryOf } from '../symmetry-of';
import { UNMIRRORED_KINDS } from './mirror-siblings.constants';
import { siblingEdit } from './sibling-edit';

const touches = (a: MaskView, b: MaskView): boolean => maskBounds(combineMasks(a, b, 'intersect')) !== null;

const mirrorSiblings = (target: EditorTarget, pending: PendingEdit): PendingEdit[] => {
  const { mask, spec } = pending;
  if (!mask || !useTransformUiStore.getState().mirror || UNMIRRORED_KINDS.has(spec.kind)) return [];
  const maps = symmetryMaps(symmetryOf(useToolStore.getState(), target.sprite), 1).slice(1);
  const box = regionBox(target, mask);
  let busy: MaskView = combineMasks(mask, pendingLanding(target, pending) ?? mask, 'add');
  const siblings: PendingEdit[] = [];
  for (const map of maps) {
    const next = siblingEdit(target, pending, { mask, box, map });
    if (!next || touches(busy, next.moved) || touches(busy, next.landing)) continue;
    busy = combineMasks(combineMasks(busy, next.moved, 'add'), next.landing, 'add');
    siblings.push(next.edit);
  }
  return siblings;
};

export { mirrorSiblings };
