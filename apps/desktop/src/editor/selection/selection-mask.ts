/* @layer renderer-app @kind logic */
import type { MaskView } from '@bxel/raster';
import { useSelectionStore } from '../../stores/useSelectionStore';
import type { EditorTarget } from '../editor.type';

const selectionMask = (target: EditorTarget): MaskView | null => {
  const { mask, owner } = useSelectionStore.getState();
  if (!mask || owner !== target.documentId) return null;
  return mask.width === target.sprite.width && mask.height === target.sprite.height ? mask : null;
};

export { selectionMask };
