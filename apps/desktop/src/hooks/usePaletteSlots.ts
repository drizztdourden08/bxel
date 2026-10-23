/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { paletteSlots } from '../editor/palette-slots';
import type { PaletteSlot } from '../editor/palette-slots.type';
import { useEditorTarget } from './useEditorTarget';

const usePaletteSlots = (): PaletteSlot[] => {
  const target = useEditorTarget();
  return useMemo(() => (target ? paletteSlots(target.bank) : []), [target]);
};

export { usePaletteSlots };
