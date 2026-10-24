/* @layer core @kind types */
import type { FormatFailure } from '../failure/format.type';

type PaletteColor = {
  readonly hex: string;
  readonly name: string;
};

type PaletteFile = {
  readonly name: string;
  readonly colors: readonly PaletteColor[];
};

type PaletteReadResult = { readonly ok: true; readonly palette: PaletteFile } | FormatFailure;

type PaletteTextResult = { readonly ok: true; readonly text: string } | FormatFailure;

type PalettePngLayout = 'row' | 'column';

export type { PaletteColor, PaletteFile, PalettePngLayout, PaletteReadResult, PaletteTextResult };
