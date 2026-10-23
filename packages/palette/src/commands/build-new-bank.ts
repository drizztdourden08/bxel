/* @layer core @kind logic */
import { BACKGROUND_LABEL } from '@bxel/document';
import type { BankId, IdSource, PaletteBank, Swatch, SwatchId } from '@bxel/document';
import { checkBankOptions } from './check-bank-options';
import type { PaletteCreateOptions } from './palette-create.type';

const buildNewBank = (ids: IdSource, options: PaletteCreateOptions): PaletteBank => {
  const { name, colors } = checkBankOptions(options);
  const id = ids.next('bnk') as BankId;
  const lead: Swatch[] = options.transparent ? [{ id: ids.next('sw') as SwatchId, kind: 'transparent' }] : [];
  const painted = colors.map(
    (rgb, index): Swatch => ({
      id: ids.next('sw') as SwatchId,
      kind: 'color',
      rgb,
      name: !options.transparent && index === 0 ? BACKGROUND_LABEL : rgb,
    }),
  );
  return { id, name, cap: options.cap, transparent: options.transparent, slots: [...lead, ...painted], ramps: [] };
};

export { buildNewBank };
