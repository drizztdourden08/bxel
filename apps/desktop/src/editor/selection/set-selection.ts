/* @layer renderer-app @kind logic */
import { maskBounds } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import { useSelectionStore } from '../../stores/useSelectionStore';
import type { EditorTarget } from '../editor.type';

const setSelection = (target: EditorTarget, mask: MaskView | null): void => {
  const kept = mask && maskBounds(mask) !== null ? mask : null;
  useSelectionStore.getState().setMask(kept, target.documentId);
};

export { setSelection };
