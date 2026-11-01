/* @layer tests @kind helper */
import type { PaletteFile, PaletteReadResult } from '@bxel/formats';

const mustRead = (result: PaletteReadResult): PaletteFile => {
  if (!result.ok) throw new Error(result.message);
  return result.palette;
};

export { mustRead };
