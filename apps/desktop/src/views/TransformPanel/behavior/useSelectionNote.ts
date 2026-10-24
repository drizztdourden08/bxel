/* @layer renderer-app @kind hook */
import { maskBounds } from '@bxel/raster';
import { selectionMask } from '../../../editor/selection/selection-mask';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { TRANSFORM_PANEL_TEXT } from '../TransformPanel.constants';

const useSelectionNote = (): string | null => {
  const target = useEditorTarget();
  useSelectionStore((state) => state.mask);
  const mask = target ? selectionMask(target) : null;
  const box = mask ? maskBounds(mask) : null;
  if (!target) return null;
  return box ? TRANSFORM_PANEL_TEXT.selection(box.width, box.height, box.x, box.y) : TRANSFORM_PANEL_TEXT.whole;
};

export { useSelectionNote };
