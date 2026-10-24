/* @layer renderer-app @kind types */
import type { PaletteSlot } from '../../editor/palette-slots.type';
import type { ColourSlot } from '../../editor/press-plan.type';
import type { SourceGroup } from '../../palette-source/palette-source.type';
import type { PlatformReport } from '../../platform-preset/platform-preset.type';
import type { LoadMode } from '../../swatch-library/swatch-library.type';

type SwatchRole = ColourSlot | null;

interface PaletteSwatchProps {
  slot: PaletteSlot;
  role: SwatchRole;
  onPick: (index: number, which: ColourSlot) => void;
}

interface PlatformRowModel {
  value: string;
  report: PlatformReport | null;
  unknown: string | null;
  choose: (value: string) => void;
}

interface SetLoaderModel {
  groups: SourceGroup[];
  value: string;
  empty: boolean;
  choose: (key: string) => void;
  load: (mode: LoadMode) => void;
}

export type { PaletteSwatchProps, PlatformRowModel, SetLoaderModel, SwatchRole };
