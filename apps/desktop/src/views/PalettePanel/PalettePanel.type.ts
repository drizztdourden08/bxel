/* @layer renderer-app @kind types */
import type { PaletteSlot } from '../../editor/palette-slots.type';
import type { ColourSlot } from '../../editor/press-plan.type';

type SwatchRole = ColourSlot | null;

interface PaletteSwatchProps {
  slot: PaletteSlot;
  role: SwatchRole;
  onPick: (index: number, which: ColourSlot) => void;
}

export type { PaletteSwatchProps, SwatchRole };
