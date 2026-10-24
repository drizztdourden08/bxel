/* @layer renderer-app @kind logic */
import type { MaskView } from '@bxel/raster';
import { usePendingStore } from '../../stores/usePendingStore';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { currentTarget } from '../current-target';
import { layerBlock } from '../layer-block';
import { selectionMask } from '../selection/selection-mask';
import type { PendingEdit, PendingSpec } from './pending.type';
import { wholeSprite } from './whole-sprite';

const maskFor = (spec: PendingSpec, found: MaskView | null): MaskView | null => (spec.kind === 'paste' ? null : found);

const beginPending = (spec: PendingSpec, editing = false): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const pending: PendingEdit = { documentId: target.documentId, spec, mask: maskFor(spec, selectionMask(target)), editing };
  const blocked = wholeSprite(pending) ? null : layerBlock(target.layer);
  if (blocked !== null) {
    useNoticeStore.getState().post(blocked);
    return false;
  }
  usePendingStore.getState().begin(pending);
  return true;
};

export { beginPending };
