/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { selectionMask } from '../../../editor/selection/selection-mask';
import { useAnimationFocus } from '../../../hooks/useAnimationFocus';
import { useEditorTarget } from '../../../hooks/useEditorTarget';
import { useMapContext } from '../../../hooks/useMapContext';
import { usePaletteSlots } from '../../../hooks/usePaletteSlots';
import { useSurface } from '../../../hooks/useSurface';
import { readExtras } from '../../../status-extras/read-extras';
import type { PixelRead } from '../../../status-extras/read-extras';
import type { StatusExtras } from '../../../status-extras/status-extras.type';
import { usePendingStore } from '../../../stores/usePendingStore';
import { useReadoutStore } from '../../../stores/useReadoutStore';
import { useSelectionStore } from '../../../stores/useSelectionStore';
import { readCell } from '../../../tilemap/read-cell';
import { cellOf } from '../../TilemapCanvas/behavior/cell-of';
import { mapTarget } from '../../../tilemap/map-target';

const useStatusExtras = (): StatusExtras => {
  const surface = useSurface();
  const pointer = useReadoutStore((state) => state.pointer);
  const target = useEditorTarget();
  const slots = usePaletteSlots();
  const focus = useAnimationFocus();
  const map = useMapContext();
  const mask = useSelectionStore((state) => state.mask);
  const pending = usePendingStore((state) => state.pending);
  return useMemo(() => {
    const full = mapTarget(map);
    const at = pointer && full ? cellOf(pointer, full) : null;
    const cell = at && full ? { at, key: readCell(full.tilemap, full.layer, at)?.key || null } : null;
    const read: PixelRead = {
      surface,
      pointer,
      target,
      slots,
      mask: target ? selectionMask(target) : null,
      move: pending?.spec.kind === 'move' ? pending.spec.offset : null,
      focus,
      cell,
    };
    return readExtras(read);
    // The selection mask is read through the store inside selectionMask, so it is a key here.
  }, [surface, pointer, target, slots, focus, map, mask, pending]);
};

export { useStatusExtras };
