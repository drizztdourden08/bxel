/* @layer renderer-app @kind types */
import type { MouseButton, ShortcutKey } from '@drizztdourden08/tessera';
import type { RefObject } from 'react';
import type { PaletteSlot } from '../../editor/palette-slots.type';
import type { ColourSlot } from '../../editor/press-plan.type';
import type { SwatchClick } from '../../editor/swatch-slot.type';

interface HeldCombo {
  keys?: readonly ShortcutKey[];
  mouse: MouseButton;
}

interface HeldChipDef {
  slot: ColourSlot;
  position: number;
  draw: HeldCombo;
  pick: HeldCombo;
}

type HeldColours = Readonly<Record<ColourSlot, number>>;

type EditSwatch = (index: number, element: HTMLElement) => void;

interface PaletteSwatchProps {
  slot: PaletteSlot;
  marks: readonly number[];
  onPick: (index: number, click: SwatchClick) => void;
  onEdit: EditSwatch;
}

interface SwatchGridProps {
  slots: readonly PaletteSlot[];
  held: HeldColours;
  onEdit: EditSwatch;
}

interface HeldRowProps {
  slots: readonly PaletteSlot[];
  held: HeldColours;
  onEdit: EditSwatch;
}

interface HeldChipProps {
  chip: HeldChipDef;
  slot: PaletteSlot | undefined;
  onEdit: EditSwatch;
}

interface SwatchDraft {
  index: number;
  value: string;
  alpha: number;
}

interface SwatchEditModel {
  index: number | null;
  value: string;
  alpha: number;
  anchor: RefObject<HTMLElement | null>;
  open: EditSwatch;
  change: (hex: string) => void;
  changeAlpha: (alpha: number) => void;
  close: () => void;
}

interface SwatchEditorProps {
  editor: SwatchEditModel;
}

export type { EditSwatch, HeldChipDef, HeldChipProps, HeldColours, HeldRowProps, PaletteSwatchProps, SwatchDraft, SwatchEditModel, SwatchEditorProps, SwatchGridProps };
