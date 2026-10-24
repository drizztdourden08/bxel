/* @layer renderer-app @kind logic */
import { ADVANCED_COMMAND } from '@bxel/raster';
import { useDocumentStore } from '../../stores/useDocumentStore';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { commitRequest } from '../commit-request';
import { currentTarget } from '../current-target';
import { layerBlock } from '../layer-block';
import { selectionMask } from './selection-mask';

const clearPixels = (label: string): boolean => {
  const target = currentTarget();
  const mask = target ? selectionMask(target) : null;
  if (!target || !mask) return false;
  const blocked = layerBlock(target.layer);
  const notices = useNoticeStore.getState();
  if (blocked !== null) {
    notices.post(blocked);
    return false;
  }
  const result = useDocumentStore.getState().host.execute(commitRequest(target, label, { name: ADVANCED_COMMAND.pixelsClear, options: { mask } }));
  if (!result.ok) notices.post(result.error.message);
  return result.ok;
};

export { clearPixels };
