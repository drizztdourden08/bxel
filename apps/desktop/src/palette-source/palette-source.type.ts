/* @layer renderer-app @kind types */
interface SourceColor {
  rgb: string;
  name: string;
}

interface LoadedPalette {
  fileName: string;
  name: string;
  colors: readonly SourceColor[];
}

type SourceKind = 'preset' | 'file' | 'custom';

interface PaletteSource {
  kind: SourceKind;
  presetId: string;
  file: LoadedPalette | null;
}

interface PalettePreset {
  id: string;
  name: string;
  colors: readonly SourceColor[];
}

interface FittedColors {
  colors: readonly SourceColor[];
  dropped: number;
}

interface SourceOption {
  value: string;
  label: string;
}

interface BankDraft {
  name: string;
  cap: number;
  transparent: boolean;
  colors: readonly SourceColor[];
}

interface BankPlan {
  bank: BankDraft;
  dropped: number;
}

type PaletteRead = { ok: true; palette: LoadedPalette } | { ok: false; message: string };

export type { BankDraft, BankPlan, FittedColors, LoadedPalette, PaletteRead, PaletteSource, PalettePreset, SourceColor, SourceOption };
