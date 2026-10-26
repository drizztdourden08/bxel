/* @layer renderer-app @kind logic */
import { paletteRgba } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';

const bankRgba = (bank: PaletteBank): Uint8Array => paletteRgba(bank);

export { bankRgba };
