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
import { mapMask } from './map-mask';
import { mirrorSpec } from './mirror-spec';

const touches = (a: MaskView, b: MaskView): boolean => maskBounds(combineMasks(a, b, 'intersect')) !== null;

const mirrorSiblings = (target: EditorTarget, pending: PendingEdit): PendingEdit[] => {
  const { mask, spec } = pending;
  if (!mask || !useTransformUiStore.getState().mirror || spec.kind === 'move' || spec.kind === 'paste' || spec.kind === 'patch') return [];
  const maps = symmetryMaps(symmetryOf(useToolStore.getState(), target.sprite), 1).slice(1);
  const box = regionBox(target, mask);
  let busy: MaskView = combineMasks(mask, pendingLanding(target, pending) ?? mask, 'add');
  const siblings: PendingEdit[] = [];
  for (const map of maps) {
    const moved = mapMask(mask, map);
    const sibling = mirrorSpec(spec, box, regionBox(target, moved), map);
    const next = sibling ? { ...pending, mask: moved, spec: sibling } : null;
    const landing = next ? pendingLanding(target, next) : null;
    if (!next || !landing || touches(busy, moved) || touches(busy, landing)) continue;
    busy = combineMasks(combineMasks(busy, moved, 'add'), landing, 'add');
    siblings.push(next);
  }
  return siblings;
};

export { mirrorSiblings };
