/* @layer renderer-app @kind constants */
import { readGpl, readHex, readJascPal, readPaintNet } from '@bxel/formats';
import type { PaletteReadResult } from '@bxel/formats';
import { PALETTE_FILE_KIND } from './palette-source.constants';

const TEXT_READERS: Readonly<Record<string, (text: string) => PaletteReadResult>> = {
  [PALETTE_FILE_KIND.gpl]: readGpl,
  [PALETTE_FILE_KIND.pal]: readJascPal,
  [PALETTE_FILE_KIND.hex]: readHex,
  [PALETTE_FILE_KIND.txt]: readPaintNet,
};

export { TEXT_READERS };
