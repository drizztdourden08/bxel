/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import { paletteFileOf } from './palette-file-of';

/** One colour per line as #RRGGBB (or #RRGGBBAA), ready to paste into a text field. */
const hexListOf = (bank: PaletteBank, indices: readonly number[] | null = null): string =>
  paletteFileOf(bank, indices)
    .colors.map((color) => color.hex.toUpperCase())
    .join('\n');

export { hexListOf };
