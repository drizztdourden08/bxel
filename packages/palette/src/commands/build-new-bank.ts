/* @layer core @kind logic */
import { BACKGROUND_LABEL, formatSwatchColor, swatchFields } from '@bxel/document';
import type { BankId, IdSource, PaletteBank, Swatch, SwatchId } from '@bxel/document';
import { checkBankOptions } from './check-bank-options';
import type { PaletteCreateOptions } from './palette-create.type';

const buildNewBank = (ids: IdSource, options: PaletteCreateOptions, created: number | undefined): PaletteBank => {
  const { name, colors } = checkBankOptions(options);
  const id = ids.next('bnk') as BankId;
  const lead: Swatch[] = options.transparent ? [{ id: ids.next('sw') as SwatchId, kind: 'transparent' }] : [];
  const painted = colors.map(
    (color, index): Swatch => ({
      id: ids.next('sw') as SwatchId,
      kind: 'color',
      ...swatchFields(color.rgb, color.alpha),
      name: !options.transparent && index === 0 ? BACKGROUND_LABEL : formatSwatchColor(color.rgb, color.alpha),
    }),
  );
  return { id, name, created, cap: options.cap, transparent: options.transparent, slots: [...lead, ...painted], ramps: [] };
};

export { buildNewBank };
