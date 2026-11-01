/* @layer renderer-app @kind constants */
import { writeGpl, writeHex, writeJascPal, writePaintNet } from '@bxel/formats';
import type { PaletteFile, PaletteTextResult } from '@bxel/formats';

const TEXT_WRITERS: Readonly<Record<string, (palette: PaletteFile) => PaletteTextResult>> = {
  gpl: writeGpl,
  pal: writeJascPal,
  hex: writeHex,
  txt: writePaintNet,
};

export { TEXT_WRITERS };
