/* @layer renderer-app @kind logic */
import { paletteRgba } from '@bxel/document';
import type { PaletteBank } from '@bxel/document';

const bankTable = (bank: PaletteBank): Uint8ClampedArray<ArrayBuffer> => Uint8ClampedArray.from(paletteRgba(bank));

export { bankTable };
