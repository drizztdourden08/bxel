/* @layer tests @kind helper */
import type { PaletteTextResult } from '@bxel/formats';

const mustText = (result: PaletteTextResult): string => {
  if (!result.ok) throw new Error(result.message);
  return result.text;
};

export { mustText };
