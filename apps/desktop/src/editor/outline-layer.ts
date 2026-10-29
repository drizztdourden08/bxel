/* @layer renderer-app @kind logic */
import { ADVANCED_COMMAND } from '@bxel/raster';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useNoticeStore } from '../stores/useNoticeStore';
import { useToolStore } from '../stores/useToolStore';
import { commitRequest } from './commit-request';
import { currentTarget } from './current-target';
import { layerBlock } from './layer-block';
import { OUTLINE_TEXT } from './outline-layer.constants';
import { selectionMask } from './selection/selection-mask';
import { wrapOf } from './wrap-of';

const outlineLayer = (side: 'outside' | 'inside'): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const notices = useNoticeStore.getState();
  const blocked = layerBlock(target.layer);
  if (blocked !== null) {
    notices.post(blocked);
    return false;
  }
  const { outlineRing, outlineSelOut } = useDrawingStore.getState();
  const mask = selectionMask(target);
  const options = {
    side,
    ring: outlineRing,
    selOut: outlineSelOut,
    ...(outlineSelOut ? {} : { index: useToolStore.getState().foreground }),
    wrap: wrapOf(),
    ...(mask ? { mask } : {}),
  };
  const label = side === 'outside' ? OUTLINE_TEXT.outside : OUTLINE_TEXT.inside;
  const result = useDocumentStore.getState().host.execute(commitRequest(target, label, { name: ADVANCED_COMMAND.pixelsOutline, options }));
  if (!result.ok) notices.post(result.error.message);
  return result.ok;
};

export { outlineLayer };
