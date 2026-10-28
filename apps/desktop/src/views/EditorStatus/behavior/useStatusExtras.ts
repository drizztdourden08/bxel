/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { selectionMask } from '../../../editor/selection/selection-mask';
import { useAnimationFocus } from '../../../hooks/useAnimationFocus';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { useMapContext } from '../../../hooks/useMapContext';
import { usePaletteSlots } from '../../../hooks/usePaletteSlots';
import { useSurface } from '../../../hooks/useSurface';
import { readExtras } from '../../../status-extras/read-extras';
import type { StatusExtras } from '../../../status-extras/status-extras.type';
import { usePendingStore } from '../../../stores/usePendingStore';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { cellUnder } from './cell-under';
import { moveOffset } from './move-offset';

const useStatusExtras = (): StatusExtras => {
  const surface = useSurface();
  const pointer = useReadoutStore((state) => state.pointer);
  const target = useEditorTarget();
  const slots = usePaletteSlots();
  const focus = useAnimationFocus();
  const map = useMapContext();
  const selected = useSelectionStore((state) => state.mask);
  const pending = usePendingStore((state) => state.pending);
  return useMemo(
    () => readExtras({ surface, pointer, target, slots, mask: target && selected ? selectionMask(target) : null, move: moveOffset(pending), focus, cell: cellUnder(map, pointer) }),
    [surface, pointer, target, slots, focus, map, selected, pending],
  );
};

export { useStatusExtras };
