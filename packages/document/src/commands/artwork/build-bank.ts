/* @layer core @kind logic */
import type { IdSource } from '../../ids/id-source.type';
import type { BankId, SwatchId } from '../../model/ids.type';
import type { PaletteBank, Rgb, Swatch } from '../../model/palette.type';
import { BACKGROUND_LABEL } from '../../model/transparent.constants';
import { swatchFields } from '../../read/swatch-fields';
import type { ArtworkCreateOptions } from '../../schema/command-options.type';

const buildBank = (ids: IdSource, bank: ArtworkCreateOptions['bank'], created: number | undefined): PaletteBank => {
  const id = ids.next('bnk') as BankId;
  const slots: Swatch[] = [];
  if (bank.transparent) slots.push({ id: ids.next('sw') as SwatchId, kind: 'transparent' });
  for (const [index, color] of bank.colors.entries()) {
    const rgb = color.rgb.toLowerCase() as Rgb;
    const fields = swatchFields(rgb, color.alpha);
    const name = !bank.transparent && index === 0 ? BACKGROUND_LABEL : (color.name?.trim() ?? rgb);
    slots.push({ id: ids.next('sw') as SwatchId, kind: 'color', ...fields, name });
  }
  return { id, name: bank.name.trim(), created, cap: bank.cap, transparent: bank.transparent, slots, ramps: [] };
};

export { buildBank };
