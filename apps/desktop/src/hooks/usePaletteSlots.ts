/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { paletteSlots } from '../editor/palette-slots';
import type { PaletteSlot } from '../editor/palette-slots.type';
import { usePaletteTarget } from './usePaletteTarget';

const usePaletteSlots = (): PaletteSlot[] => {
  const target = usePaletteTarget();
  return useMemo(() => (target ? paletteSlots(target.bank) : []), [target]);
};

export { usePaletteSlots };
