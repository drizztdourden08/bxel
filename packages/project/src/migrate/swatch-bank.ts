/* @layer core @kind logic */
import { formatSwatchColor, ID_PREFIX, swatchFields } from '@bxel/document';
import type { BankId, IdSource, PaletteBank, Rgb, SwatchId } from '@bxel/document';
import type { SwatchSet } from '../swatches/swatch.type';

const swatchBank = (set: SwatchSet, ids: IdSource): PaletteBank => ({
  id: ids.next(ID_PREFIX.bank) as BankId,
  name: set.name,
  cap: set.colors.length,
  transparent: false,
  slots: set.colors.map((color) => ({
    id: ids.next(ID_PREFIX.swatch) as SwatchId,
    kind: 'color',
    ...swatchFields(color.rgb as Rgb, color.alpha),
    name: color.name === '' ? formatSwatchColor(color.rgb as Rgb, color.alpha) : color.name,
  })),
  ramps: [],
});

export { swatchBank };
