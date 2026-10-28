/* @layer renderer-app @kind logic */
import { maskBounds } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import { useSelectionHistoryStore } from '../../stores/useSelectionHistoryStore';
import type { EditorTarget } from '../editor.type';
import { newestTag } from './newest-tag';
import { sameMask } from './same-mask';
import { selectionMask } from './selection-mask';
import { setSelection } from './set-selection';

const commitSelection = (target: EditorTarget, mask: MaskView | null): void => {
  const before = selectionMask(target);
  const after = mask && maskBounds(mask) !== null ? mask : null;
  if (sameMask(before, after)) return;
  const history = useSelectionHistoryStore.getState();
  history.record({ documentId: target.documentId, tag: newestTag(target.documentId), before, after });
  if (before && !after) history.remember(before);
  setSelection(target, after);
};

export { commitSelection };
